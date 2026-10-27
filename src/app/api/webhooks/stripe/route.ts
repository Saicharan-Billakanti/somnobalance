import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getDB, dbConfigured } from "@/lib/db";
import { sendNotification } from "@/lib/mailer";
import { recordPaidOrderCommission } from "@/lib/affiliateService";

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

  const db = getDB();
  const reservation = await db.prepare('INSERT OR IGNORE INTO "StripeWebhookEvent" (eventId) VALUES (?)').bind(event.id).run();
  if (!reservation.meta?.changes) return NextResponse.json({ received: true, duplicate: true });

  try {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id ?? session.metadata?.orderId;
      if (orderId && session.payment_status === "paid") {
        const order = await db.prepare('SELECT id,stripeSessionId,status FROM "Order" WHERE id=?').bind(orderId).first<{id:string;stripeSessionId:string|null;status:string}>();
        if (order && order.stripeSessionId === session.id) {
          const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
          const updated = await db.prepare('UPDATE "Order" SET status=\'PAID\',stripePaymentIntentId=COALESCE(?,stripePaymentIntentId) WHERE id=? AND stripeSessionId=? AND status<>\'PAID\'').bind(paymentIntentId,orderId,session.id).run();
          await recordPaidOrderCommission(orderId);
          if (updated.meta?.changes) {
            await sendNotification(`Order ${orderId} paid`, `Stripe session ${session.id} completed payment.`);
          }
        } else {
          console.error("[stripe webhook] session does not match a stored order", { orderId, sessionId: session.id });
        }
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id ?? session.metadata?.orderId;
      if (orderId) await db.prepare('UPDATE "Order" SET status=\'CANCELLED\' WHERE id=? AND stripeSessionId=? AND status=\'PENDING_PAYMENT\'').bind(orderId,session.id).run();
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    await db.prepare('DELETE FROM "StripeWebhookEvent" WHERE eventId=?').bind(event.id).run().catch(() => undefined);
    console.error("[stripe webhook] failed to process event:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
