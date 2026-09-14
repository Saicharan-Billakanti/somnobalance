import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import {
  getBusinessApplicationByEmail,
  getBusinessApplicationById,
  submitBusinessApplication,
} from "@/lib/businessService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  const emailParam = searchParams.get("email");

  if (idParam) {
    const appById = await getBusinessApplicationById(idParam);
    if (appById) {
      return NextResponse.json({ application: appById });
    }
  }

  const user = await getCurrentUser();
  const targetEmail = emailParam || user?.email;

  if (!targetEmail) {
    return NextResponse.json({ application: null });
  }

  const app = await getBusinessApplicationByEmail(targetEmail);
  return NextResponse.json({ application: app });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please log in or sign up before sending a business request so we can keep track of it." },
      { status: 401 }
    );
  }

  const { companyName, contactName, email, phone, businessType, vatId, address, city, country, estimatedVolume, notes } = body;

  if (!companyName || !contactName || !email) {
    return NextResponse.json({ error: "Company name, contact name, and email are required" }, { status: 400 });
  }

  try {
    const app = await submitBusinessApplication({
      userId: user.id,
      companyName,
      contactName,
      email,
      phone,
      businessType,
      vatId,
      address,
      city,
      country,
      estimatedVolume,
      notes,
    });

    return NextResponse.json({ success: true, application: app });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit application" }, { status: 500 });
  }
}
