import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/mailer";
import { getProduct } from "@/lib/products";

const SHIPPING_FLAT_RATE = 4.9;

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
      })
    )
    .min(1),
});

// DATABASE_URL is intentionally unset on the live demo deployment (no
// hosted DB provisioned yet). In that case we accept the order shape but
// skip persistence, so the checkout flow keeps working for gateway/courier
// application reviewers instead of failing with a 500.
const dbConfigured = Boolean(process.env.DATABASE_URL);

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
  // a price sent by the client.
  const items: { slug: string; name: string; price: number; qty: number }[] = [];
  for (const line of data.items) {
    const product = getProduct(line.slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${line.slug}` }, { status: 400 });
    }
    items.push({ slug: product.slug, name: product.name, price: product.price, qty: line.qty });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  if (!dbConfigured) {
    await sendNotification(
      "New demo order (not persisted — no DATABASE_URL configured)",
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

  let order;
  try {
    order = await getPrisma().order.create({
      data: {
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
        items: { create: items },
      },
      include: { items: true },
    });
  } catch (err) {
    console.error("[orders] failed to create order:", err);
    return NextResponse.json({ error: "Could not save the order. Please try again." }, { status: 500 });
  }

  await sendNotification(
    `New order ${order.id}`,
    `${order.firstName} ${order.lastName} <${order.email}>\nTotal: €${order.total.toFixed(2)}\nItems: ${items
      .map((i) => `${i.name} x${i.qty}`)
      .join(", ")}`
  );

  return NextResponse.json({
    id: order.id,
    persisted: true,
    status: order.status,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
  });
}
