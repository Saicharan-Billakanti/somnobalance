import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { sendNotification } from "@/lib/mailer";
import { processOrderCommission } from "@/lib/affiliateService";
import { getAllOrders, updateOrderStatus } from "@/lib/userService";

// Stripe signs the raw body, so this route must read the request as text
// (not JSON) before verifying — Next.js would otherwise re-serialize it and
// break the signature check.
export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_KEY || process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("[stripe webhook] signature verification failed:", err?.message || err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 1. EVENT: CHECKOUT SESSION COMPLETED (Paid Order)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id ?? session.metadata?.orderId;
    const couponCode = session.metadata?.couponCode;
    const customerEmail = session.customer_email || session.customer_details?.email || "";
    const total = (session.amount_total ?? 0) / 100;
    const subtotal = Number(session.metadata?.subtotal) || total;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (orderId) {
      await updateOrderStatus(orderId, {
        status: "PAID",
        stripePaymentIntentId: paymentIntentId,
        stripeSessionId: session.id,
      });

      await sendNotification(
        `Order ${orderId} paid`,
        `Stripe session ${session.id} completed payment. Payment Intent: ${paymentIntentId || "N/A"}`
      ).catch(() => null);

      // Process affiliate commission idempotently
      if (couponCode) {
        try {
          await processOrderCommission({
            orderId,
            orderTotal: total,
            subtotal,
            customerEmail,
            couponCode,
          });
        } catch (commErr) {
          console.error("[stripe webhook] failed to process commission:", commErr);
        }
      }
    }
  }

  // 2. EVENT: CHARGE REFUNDED (External or API Refund)
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id;
    const refundAmount = (charge.amount_refunded ?? 0) / 100;
    const refundId = charge.refunds?.data?.[0]?.id || `re_stripe_${charge.id.slice(-8)}`;

    const orders = await getAllOrders();
    const matchingOrder = orders.find(
      (o) =>
        (paymentIntentId && o.stripePaymentIntentId === paymentIntentId) ||
        (charge.metadata?.orderId && o.id === charge.metadata.orderId)
    );

    if (matchingOrder) {
      await updateOrderStatus(matchingOrder.id, {
        status: "REFUNDED",
        returnStatus: "REFUNDED",
        refundTransactionId: refundId,
        refundAmount,
        refundedAt: new Date().toISOString(),
      });

      await sendNotification(
        `Stripe Refund Confirmed for Order #${matchingOrder.id}`,
        `Refund of €${refundAmount.toFixed(2)} completed for Order #${matchingOrder.id}.\nStripe Refund ID: ${refundId}`
      ).catch(() => null);
    }
  }

  // 3. EVENT: CONNECTED ACCOUNT UPDATED
  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    console.log(
      `[stripe webhook] Connected account ${account.id} updated: payouts_enabled=${account.payouts_enabled}, charges_enabled=${account.charges_enabled}`
    );
  }

  return NextResponse.json({ received: true });
}

