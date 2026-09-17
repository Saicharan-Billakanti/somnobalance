import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/userService";
import { sendNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, returnReason, returnNote } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const returnRequestedAt = new Date().toISOString();
    const updated = await updateOrderStatus(orderId, {
      returnStatus: "REQUESTED",
      returnReason: returnReason || "comfort_expectation",
      returnNote: returnNote || "",
      returnRequestedAt,
    });

    // Send admin notification
    await sendNotification(
      `Return & Refund Requested for Order #${orderId}`,
      `Customer ${order.firstName || ""} ${order.lastName || ""} (${order.email})\nReason: ${returnReason}\nNote: ${returnNote || "None"}\nRefund Amount: €${Number(order.total).toFixed(2)}`
    ).catch(() => null);

    return NextResponse.json({
      success: true,
      message: "Return request received and pending admin approval.",
      order: updated,
    });
  } catch (err: any) {
    console.error("[orders return error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process return request" },
      { status: 500 }
    );
  }
}
