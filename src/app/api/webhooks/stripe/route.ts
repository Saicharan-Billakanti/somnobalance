import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getDB, dbConfigured, updateOrderStatus } from "@/lib/db";
import { sendNotification } from "@/lib/mailer";

// Affiliate commission tracking (processOrderCommission from
// affiliateService) is intentionally NOT wired back in here: it depends on
// Supabase's AffiliateCoupon/Affiliate/CommissionRecord tables, which have
// no D1 equivalent yet (0001_init.sql only covers User/Order/OrderItem/
// ContactMessage). A paid order with a coupon code currently does NOT
// credit the referring partner — tracked as a required follow-up before
// the partner program can run fully on D1, not something to guess a
// schema for here.

// Stripe signs the raw body — read as text before verifying.
export async function POST(request: Request) {
  if (!stripeConfigured() || !dbConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id ?? session.metadata?.orderId;

    if (orderId) {
      try {
        await updateOrderStatus(getDB(), orderId, "PAID");
        await sendNotification(
          `Order ${orderId} paid`,
          `Stripe session ${session.id} completed payment.`
        );
      } catch (err) {
        console.error("[stripe webhook] failed to mark order paid:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
