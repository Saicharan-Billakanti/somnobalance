import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/userService";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  let order = await getOrderById(id);

  // If order was paid via Stripe Checkout, sync live with Stripe
  if (stripeConfigured() && (sessionId || order?.stripeSessionId)) {
    try {
      const stripe = getStripe();
      const sess = await stripe.checkout.sessions.retrieve(sessionId || order.stripeSessionId);
      if (
        sess &&
        sess.payment_status === "paid" &&
        order?.status !== "PAID" &&
        order?.status !== "REFUNDED"
      ) {
        const paymentIntentId =
          typeof sess.payment_intent === "string"
            ? sess.payment_intent
            : sess.payment_intent?.id;

        order = await updateOrderStatus(id, {
          status: "PAID",
          stripePaymentIntentId: paymentIntentId,
          stripeSessionId: sess.id,
        });
      }
    } catch (stripeSyncErr) {
      console.warn("[orders/[id]] Stripe session sync note:", stripeSyncErr);
    }
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

