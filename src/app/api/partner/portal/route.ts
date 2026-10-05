import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { getPartnerPortalData } from "@/lib/affiliateService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const user = await getCurrentUser();
    const email = user?.email || body.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const data = await getPartnerPortalData(String(email));

    if (!data) {
      return NextResponse.json(
        { error: "No partner account found for this email." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[partner portal error]:", err);
    return NextResponse.json(
      { error: "Could not load partner portal data." },
      { status: 500 }
    );
  }
}
