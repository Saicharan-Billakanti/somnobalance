import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import {
  getAllBusinessApplications,
  updateBusinessAppStatus,
  sendBusinessMessage,
  createBusinessProduct,
  deleteBusinessProduct,
} from "@/lib/businessService";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminOrPartnerAccess(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await getAllBusinessApplications();
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminOrPartnerAccess(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { action } = body;

  if (action === "update_status") {
    const { applicationId, status, discountRate } = body;
    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing applicationId or status" }, { status: 400 });
    }
    const updated = await updateBusinessAppStatus(applicationId, status, discountRate ? Number(discountRate) : undefined);
    return NextResponse.json({ success: true, application: updated });
  }

  if (action === "send_message") {
    const { applicationId, message, senderName } = body;
    if (!applicationId || !message) {
      return NextResponse.json({ error: "Missing applicationId or message" }, { status: 400 });
    }
    const msg = await sendBusinessMessage(
      applicationId,
      "admin",
      senderName || "SomnoBalance B2B Desk",
      message
    );
    return NextResponse.json({ success: true, message: msg });
  }

  if (action === "create_product") {
    const { applicationId, name, description, image, category, retailPrice, discountRate, maxQuantity } = body;
    if (!applicationId || !name || retailPrice === undefined || discountRate === undefined) {
      return NextResponse.json({ error: "Business, name, retail price, and discount are required" }, { status: 400 });
    }
    const product = await createBusinessProduct({
      applicationId,
      name,
      description,
      image,
      category,
      retailPrice: Number(retailPrice),
      discountRate: Number(discountRate),
      maxQuantity: Number(maxQuantity || 1000),
    });
    return NextResponse.json({ success: true, product });
  }

  if (action === "delete_product") {
    if (!body.productId) return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    await deleteBusinessProduct(body.productId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
