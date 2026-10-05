import { NextResponse } from "next/server";
import {
  getAffiliateByEmail,
  createStripeConnectAccount,
  getStripeConnectAccountStatus,
} from "@/lib/affiliateService";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, lang = "en" } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return NextResponse.json(
        { error: "You must be signed in as an affiliate." },
        { status: 401 }
      );
    }

    const affiliate = await getAffiliateByEmail(currentUser.email);
    const affId = affiliate?.id;
    if (!affId) {
      return NextResponse.json(
        { error: "Partner account not found." },
        { status: 404 }
      );
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    // 1. Initiate Stripe Connect Onboarding
    if (action === "onboard" || action === "connect") {
      const result = await createStripeConnectAccount(
        affId,
        affiliate.email,
        origin,
        lang
      );
      return NextResponse.json(result);
    }

    // 2. Check Stripe Connect Account Status
    if (action === "status" || action === "check_status") {
      const status = await getStripeConnectAccountStatus(affiliate.stripeAccountId);
      return NextResponse.json({ success: true, status });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("[partner connect error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process Stripe Connect operation." },
      { status: 500 }
    );
  }
}
