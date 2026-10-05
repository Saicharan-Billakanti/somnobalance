import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import {
  sendBusinessMessage,
  getBusinessApplicationByEmail,
  getBusinessApplicationById,
  getAllBusinessApplications,
} from "@/lib/businessService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("applicationId") || searchParams.get("id");
  const emailParam = searchParams.get("email");

  let app = null;
  if (idParam) {
    app = await getBusinessApplicationById(idParam);
  }
  if (!app) {
    const user = await getCurrentUser();
    const email = emailParam || user?.email;
    if (email) {
      app = await getBusinessApplicationByEmail(email);
    }
  }

  if (!app) {
    return NextResponse.json({ messages: [] });
  }

  return NextResponse.json({ messages: app.messages || [], application: app });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const applicationId = body.applicationId;
  const email = body.email || user?.email;

  let app = null;
  if (applicationId) {
    app = await getBusinessApplicationById(applicationId);
  }
  if (!app && email) {
    app = await getBusinessApplicationByEmail(email);
  }

  if (!app) {
    return NextResponse.json({ error: "No business account or inquiry found. Please submit your application first." }, { status: 404 });
  }

  const senderName = user
    ? `${user.firstName} ${user.lastName}`.trim() || app.contactName || "Business Customer"
    : body.senderName || app.contactName || "Business Customer";

  const msg = await sendBusinessMessage(app.id, "business", senderName, body.message);

  return NextResponse.json({ success: true, message: msg, application: app });
}

