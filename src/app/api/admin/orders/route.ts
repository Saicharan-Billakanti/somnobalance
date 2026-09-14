import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import { getAllOrders, getOrderById, updateOrderStatus } from "@/lib/userService";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { sendNotification } from "@/lib/mailer";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminOrPartnerAccess(session);
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("[admin orders GET error]:", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { action, orderId, notes } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ACTION 1: APPROVE RETURN & ISSUE STRIPE REFUND
    if (action === "approve_refund") {
      let refundTransactionId: string | undefined = undefined;

      if (stripeConfigured()) {
        const stripe = getStripe();
        let paymentIntentId = order.stripePaymentIntentId;

        // If paymentIntentId is not stored, resolve it from Stripe checkout session
        if (!paymentIntentId && order.stripeSessionId) {
          try {
            const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
            if (session.payment_intent) {
              paymentIntentId =
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : session.payment_intent.id;
            }
          } catch (sessErr) {
            console.warn("[admin refund] session retrieval note:", sessErr);
          }
        }

        if (paymentIntentId) {
          try {
            const refund = await stripe.refunds.create({
              payment_intent: paymentIntentId,
              amount: Math.round(Number(order.total) * 100),
              reason: "requested_by_customer",
            });
            refundTransactionId = refund.id;
          } catch (stripeErr: any) {
            console.error("[admin refund] Stripe refund error:", stripeErr);
            return NextResponse.json(
              { error: stripeErr.message || "Failed to issue Stripe refund." },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: "No Stripe payment intent found for this order to process refund." },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY to issue live refunds." },
          { status: 503 }
        );
      }

      const refundedAt = new Date().toISOString();
      const updatedOrder = await updateOrderStatus(orderId, {
        status: "REFUNDED",
        returnStatus: "REFUNDED",
        refundedAt,
        refundTransactionId,
        refundAmount: Number(order.total),
      });

      await sendNotification(
        `Refund Processed for Order #${orderId}`,
        `Order #${orderId} for ${order.firstName} ${order.lastName} (${order.email}) has been refunded for €${Number(order.total).toFixed(2)}.\nStripe Transaction: ${refundTransactionId}`
      ).catch(() => null);

      return NextResponse.json({
        success: true,
        message: "Stripe refund executed and confirmed.",
        refundTransactionId,
        order: updatedOrder,
      });
    }

    // ACTION 2: REJECT RETURN REQUEST
    if (action === "reject_return") {
      const updatedOrder = await updateOrderStatus(orderId, {
        returnStatus: "REJECTED",
        returnRejectReason: notes || "Did not meet return warranty criteria",
      });

      return NextResponse.json({
        success: true,
        message: "Return request rejected.",
        order: updatedOrder,
      });
    }

    // ACTION 3: UPDATE DELIVERY STATUS
    if (action === "update_delivery") {
      const { deliveryStatus, trackingNumber, carrier } = body;
      const updatedOrder = await updateOrderStatus(orderId, {
        deliveryStatus: deliveryStatus || order.deliveryStatus,
        trackingNumber: trackingNumber || order.trackingNumber,
        carrier: carrier || order.carrier || "DHL GoGreen",
        ...(deliveryStatus === "DELIVERED" ? { deliveredAt: new Date().toISOString() } : {}),
      });

      return NextResponse.json({
        success: true,
        order: updatedOrder,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("[admin orders POST error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order operation" },
      { status: 500 }
    );
  }
}
