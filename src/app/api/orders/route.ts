import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { sendNotification } from "@/lib/mailer";
import { priceOrderItems, computeShipping } from "@/lib/products";

const orderSchema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  street: z.string().min(1).max(300),
  postalCode: z.string().min(1).max(20),
  city: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  paymentMethod: z.enum(["CARD", "SEPA", "PAYPAL"]),
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

  // Re-price every line server-side from the product catalog — never trust
  // a price sent by the client. Same helper the checkout UI uses for
  // display, so the two can never disagree.
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
  const total = subtotal + shipping;

  // SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY intentionally unset in some
  // environments (e.g. before the backend is wired up there). In that case
  // we accept the order shape but skip persistence, so the checkout flow
  // keeps working for gateway/courier application reviewers instead of
  // failing with a 500.
  if (!supabaseConfigured()) {
    await sendNotification(
      "New demo order (not persisted — Supabase not configured)",
      `${data.firstName} ${data.lastName} <${data.email}>\nTotal: €${total.toFixed(2)}\nItems: ${items
        .map((i) => `${i.name} x${i.qty}`)
        .join(", ")}`
    );
    return NextResponse.json({
      id: null,
      persisted: false,
      status: "PENDING_PAYMENT",
      subtotal,
      shipping,
      total,
    });
  }

  const orderId = crypto.randomUUID();
  try {
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
      paymentMethod: data.paymentMethod,
      subtotal,
      shipping,
      total,
    });
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from("OrderItem").insert(
      items.map((item) => ({
        id: crypto.randomUUID(),
        orderId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }))
    );
    if (itemsError) {
      // Not a real transaction across two REST calls — clean up the
      // now-orphaned Order row rather than leave an order with no items.
      await supabase.from("Order").delete().eq("id", orderId);
      throw itemsError;
    }
  } catch (err) {
    console.error("[orders] failed to create order:", err);
    return NextResponse.json({ error: "Could not save the order. Please try again." }, { status: 500 });
  }

  await sendNotification(
    `New order ${orderId}`,
    `${data.firstName} ${data.lastName} <${data.email}>\nTotal: €${total.toFixed(2)}\nItems: ${items
      .map((i) => `${i.name} x${i.qty}`)
      .join(", ")}`
  );

  return NextResponse.json({
    id: orderId,
    persisted: true,
    status: "PENDING_PAYMENT",
    subtotal,
    shipping,
    total,
  });
}
