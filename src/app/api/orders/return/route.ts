import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/userService";
import { sendNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const { orderId, returnReason, returnNote } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order || order.email?.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
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
  } catch (err: unknown) {
    console.error("[orders return error]:", err);
    return NextResponse.json(
      { error: "Failed to process return request" },
      { status: 500 }
    );
  }
}
