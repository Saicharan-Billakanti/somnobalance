import { NextResponse } from "next/server";
import { z } from "zod";
import { getDB, dbConfigured, insertOrderWithItems, updateOrderStripeSession, deleteOrder } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { sendNotification } from "@/lib/mailer";
import { priceOrderItems, computeShipping } from "@/lib/products";
import { validateCoupon } from "@/lib/affiliateService";

// getProductReturnInfo()'s per-item returnPeriodDays/refundPolicy/
// refundRules were also dropped from this route in the D1 rewrite, but
// confirmed via grep that no current frontend page reads them from the
// order API response — the returns/legal pages read policy straight from
// the static product catalog instead — so left out rather than adding an
// unused field back in.

const orderSchema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  street: z.string().min(1).max(300),
  postalCode: z.string().min(1).max(20),
  city: z.string().min(1).max(200),
  country: z.string().trim().min(1).max(100),
  lang: z.enum(["de", "en"]).default("de"),
  couponCode: z.string().trim().max(64).nullable().optional(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().min(1).max(50),
        variant: z.string().min(1).max(200).optional(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // The shop currently ships only within Germany. Enforce this on the server
  // as well as in the checkout UI so callers cannot submit another country.
  if (!['de', 'germany', 'deutschland'].includes(data.country.toLowerCase())) {
    return NextResponse.json({
      error: data.lang === "de"
        ? "Wir liefern derzeit nur innerhalb Deutschlands."
        : "We currently deliver within Germany only.",
    }, { status: 400 });
  }

  // Re-price every line server-side — never trust a price sent by the client.
  const priced = priceOrderItems(data.items);
  if ("error" in priced) {
    return NextResponse.json({ error: priced.error }, { status: 400 });
  }

  const items = priced.lines.map((l) => ({
    slug: l.slug,
    name: l.name,
    price: l.unitPrice,
    qty: l.qty,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = computeShipping(priced.lines);
  const couponResult = data.couponCode ? await validateCoupon(data.couponCode, subtotal, data.email) : null;
  if (couponResult && !couponResult.valid) {
    return NextResponse.json({ error: couponResult.error }, { status: 400 });
  }
  const discountAmount = couponResult?.valid ? couponResult.discountAmount : 0;
  const discountedSubtotal = couponResult?.valid ? couponResult.finalSubtotal : subtotal;
  const total = discountedSubtotal + shipping;

  // DB not configured — accept the order shape but skip persistence.
  if (!dbConfigured()) {
    await sendNotification(
      "New demo order (not persisted — D1 not configured)",
      `${data.firstName} ${data.lastName} <${data.email}>\nTotal: €${total.toFixed(2)}\nItems: ${items
        .map((i) => `${i.name} x${i.qty}`)
        .join(", ")}`
    );
    return NextResponse.json({
      id: null,
      persisted: false,
      checkoutUrl: null,
      status: "PENDING_PAYMENT",
      subtotal,
      shipping,
      total,
    });
  }

  const orderId = crypto.randomUUID();
  const db = getDB();

  try {
    await insertOrderWithItems(
      db,
      {
        id: orderId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        street: data.street,
        postalCode: data.postalCode,
        city: data.city,
        country: "Germany",
        subtotal,
        shipping,
        total,
        ...(couponResult?.valid ? {
          affiliateId: couponResult.affiliateId,
          couponId: couponResult.couponId,
          couponCode: couponResult.couponCode,
          discountAmount,
          discountRate: couponResult.discountRate,
          commissionRate: couponResult.commissionRate,
          commissionBaseType: couponResult.commissionBaseType,
        } : {}),
      },
      items.map((item) => ({ id: crypto.randomUUID(), ...item }))
    );
  } catch (err) {
    console.error("[orders] failed to create order:", err);
    return NextResponse.json(
      { error: "Could not save the order. Please try again." },
      { status: 500 }
    );
  }

  // Stripe not configured — order stays PENDING_PAYMENT.
  if (!stripeConfigured()) {
    await sendNotification(
      `New order ${orderId} (Stripe not configured — no payment collected)`,
      `${data.firstName} ${data.lastName} <${data.email}>\nTotal: €${total.toFixed(2)}\nItems: ${items
        .map((i) => `${i.name} x${i.qty}`)
        .join(", ")}`
    );
    return NextResponse.json({
      id: orderId,
      persisted: true,
      checkoutUrl: null,
      status: "PENDING_PAYMENT",
      subtotal,
      discountAmount,
      shipping,
      total,
    });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  try {
    const stripe = getStripe();
    const stripeCoupon = couponResult?.valid && discountAmount > 0
      ? await stripe.coupons.create({
          amount_off: Math.round(discountAmount * 100),
          currency: "eur",
          duration: "once",
          max_redemptions: 1,
          name: `SomnoBalance ${couponResult.couponCode}`,
          metadata: { orderId },
        })
      : null;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      client_reference_id: orderId,
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.name },
        },
      })),
      shipping_options:
        shipping > 0
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: Math.round(shipping * 100), currency: "eur" },
                  display_name: "Shipping",
                },
              },
            ]
          : undefined,
      ...(stripeCoupon ? { discounts: [{ coupon: stripeCoupon.id }] } : {}),
      success_url: `${origin}/${data.lang}/checkout/success?order=${orderId}`,
      cancel_url: `${origin}/${data.lang}/checkout/cancel?order=${orderId}`,
      metadata: { orderId },
    });

    await updateOrderStripeSession(db, orderId, session.id);

    return NextResponse.json({
      id: orderId,
      persisted: true,
      checkoutUrl: session.url,
      status: "PENDING_PAYMENT",
      subtotal,
      discountAmount,
      shipping,
      total,
    });
  } catch (err) {
    console.error("[orders] failed to create Stripe session:", err);
    // Clean up the order row so it doesn't sit orphaned without a Stripe session.
    await deleteOrder(db, orderId).catch(() => {});
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}
