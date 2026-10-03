import { NextResponse } from "next/server";
import { getDB, dbConfigured, getOrderById, updateOrderStatus } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "No database configured" }, { status: 503 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  const db = getDB();
  let order = await getOrderById(db, id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Fallback sync: if the Stripe webhook hasn't landed yet (or was missed)
  // by the time the customer reaches the success page, poll Stripe
  // directly here so they don't see a stale PENDING_PAYMENT status.
  const sessionToCheck = sessionId || order.stripeSessionId;
  if (stripeConfigured() && sessionToCheck && order.status !== "PAID" && order.status !== "CANCELLED") {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionToCheck);
      if (session.payment_status === "paid") {
        await updateOrderStatus(db, id, "PAID");
        order = await getOrderById(db, id);
      }
    } catch (err) {
      console.warn("[orders/[id]] Stripe session sync note:", err);
    }
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
