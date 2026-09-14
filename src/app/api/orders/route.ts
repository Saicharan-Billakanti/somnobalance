import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { priceOrderItems, computeShipping, getProductReturnInfo } from "@/lib/products";
import { validateCoupon } from "@/lib/affiliateService";
import { updateUserProfile, getUserById } from "@/lib/userService";

const orderSchema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  street: z.string().min(1).max(300),
  postalCode: z.string().min(1).max(20),
  city: z.string().min(1).max(200),
  country: z.string().min(1).max(100).default("Germany"),
  lang: z.enum(["de", "en"]).default("de"),
  couponCode: z.string().max(50).optional().nullable(),
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
  try {
    const body = await request.json().catch(() => null);
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Re-price every line server-side from the product catalog
    const priced = priceOrderItems(data.items);
    if ("error" in priced) {
      return NextResponse.json({ error: priced.error }, { status: 400 });
    }

    const items = priced.lines.map((l) => {
      const returnInfo = getProductReturnInfo(l.slug);
      return {
        slug: l.slug,
        name: l.name,
        price: l.unitPrice,
        qty: l.qty,
        variant: (l as any).variant,
        returnPeriodDays: returnInfo.returnPeriodDays,
        refundPolicy: returnInfo.refundPolicy,
        refundRules: returnInfo.refundRules,
        returnEligible: returnInfo.returnEligible,
      };
    });

    const maxReturnDays = Math.max(...items.map((i) => i.returnPeriodDays || 14), 14);
    const primaryRefundPolicy = items.find((i) => (i.returnPeriodDays || 0) === maxReturnDays)?.refundPolicy || "30-Day Money-Back Guarantee";
    const primaryRefundRules =
      items.find((i) => (i.returnPeriodDays || 0) === maxReturnDays)?.refundRules ||
      "Hygienic seal must be intact and unbroken upon return; unsoiled in original packaging.";

    const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Validate coupon server-side
    let discountAmount = 0;
    let discountRate = 0;
    let appliedCouponCode: string | null = null;
    let affiliateId: string | null = null;
    let commissionAmount = 0;

    if (data.couponCode) {
      try {
        const couponValidation = await validateCoupon(data.couponCode, rawSubtotal, data.email);
        if (couponValidation.valid) {
          discountAmount = couponValidation.discountAmount;
          discountRate = couponValidation.discountRate;
          appliedCouponCode = couponValidation.couponCode;
          affiliateId = couponValidation.affiliateId;

          const commissionBase =
            couponValidation.commissionBaseType === "original_value"
              ? rawSubtotal
              : couponValidation.finalSubtotal;
          commissionAmount =
            Math.round(commissionBase * (couponValidation.commissionRate / 100) * 100) / 100;
        }
      } catch (couponErr) {
        console.warn("[orders] Coupon validation non-critical error:", couponErr);
      }
    }

    const subtotal = Math.max(0, Math.round((rawSubtotal - discountAmount) * 100) / 100);
    const shipping = computeShipping(priced.lines);
    const total = Math.round((subtotal + shipping) * 100) / 100;

    // Generate unique order ID & DHL GoGreen tracking code
    const orderNum = Math.floor(10000000 + Math.random() * 90000000);
    const orderId = `ord_sb_${orderNum}`;
    const trackingNumber = `DHL-DE-${orderNum}DE`;
    const createdAt = new Date().toISOString();

    // 1. Update user address profile if user exists
    try {
      const existingUser = await getUserById(data.email);
      if (existingUser) {
        await updateUserProfile(existingUser.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.street,
          postalCode: data.postalCode,
          city: data.city,
          country: data.country,
        });
      }
    } catch (profileErr) {
      console.warn("[orders] user profile sync note:", profileErr);
    }

    // 2. Persist to Supabase before creating checkout.
    if (!supabaseConfigured()) {
      return NextResponse.json(
        { error: "Database is not configured. Orders cannot be accepted." },
        { status: 503 }
      );
    }

    const supabase = getSupabase();
    const { error: orderError } = await supabase.from("Order").insert({
      id: orderId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      subtotal,
      shipping,
      total,
      couponCode: appliedCouponCode,
      discountAmount,
      discountRate,
      affiliateId,
      commissionAmount,
      carrier: "DHL GoGreen",
      trackingNumber,
    });

    if (orderError) {
      throw new Error(`Failed to save order: ${orderError.message}`);
    }

    const { error: itemError } = await supabase.from("OrderItem").insert(
      items.map((item) => ({
        id: crypto.randomUUID(),
        orderId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }))
    );

    if (itemError) {
      throw new Error(`Failed to save order items: ${itemError.message}`);
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    // 4. Create Stripe Checkout Session only if Stripe is configured in the runtime environment.
    if (!stripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in the runtime environment." },
        { status: 503 }
      );
    }

    try {
      const stripe = getStripe();
      const discountMultiplier = rawSubtotal > 0 ? (rawSubtotal - discountAmount) / rawSubtotal : 1;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: data.email,
        client_reference_id: orderId,
        line_items: items.map((item) => {
          const unitAmount = Math.round(item.price * discountMultiplier * 100);
          return {
            quantity: item.qty,
            price_data: {
              currency: "eur",
              unit_amount: Math.max(1, unitAmount),
              product_data: {
                name: appliedCouponCode ? `${item.name} (${discountRate}% off applied)` : item.name,
              },
            },
          };
        }),
        shipping_options:
          shipping > 0
            ? [
                {
                  shipping_rate_data: {
                    type: "fixed_amount" as const,
                    fixed_amount: { amount: Math.round(shipping * 100), currency: "eur" },
                    display_name: "DHL GoGreen Shipping",
                  },
                },
              ]
            : undefined,
        success_url: `${origin}/${data.lang}/checkout/success?order=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${data.lang}/checkout?canceled=true`,
        metadata: {
          orderId,
          couponCode: appliedCouponCode || "",
          affiliateId: affiliateId || "",
          subtotal: String(subtotal),
        },
      });

      const { error: stripeSessionError } = await getSupabase()
        .from("Order")
        .update({ stripeSessionId: session.id })
        .eq("id", orderId);

      if (stripeSessionError) {
        throw new Error(`Failed to save Stripe session: ${stripeSessionError.message}`);
      }

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
    } catch (stripeErr: any) {
      console.error("[orders] Stripe checkout creation error:", stripeErr);
      return NextResponse.json(
        { error: stripeErr.message || "Failed to create Stripe Checkout session" },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal order error";
    console.error("[orders] Unexpected error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
