import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { requestAffiliatePayout } from "@/lib/affiliateService";

export async function POST() {
  const user = await getCurrentUser();
  if (!user?.email) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  try {
    const payout = await requestAffiliatePayout(user.email);
    return NextResponse.json({ success: true, payout }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not request payout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
