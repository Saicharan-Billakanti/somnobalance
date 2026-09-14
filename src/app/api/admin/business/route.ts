import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import {
  getAllBusinessApplications,
  updateBusinessAppStatus,
  sendBusinessMessage,
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

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
