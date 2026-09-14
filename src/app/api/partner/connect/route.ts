import { NextResponse } from "next/server";
import {
  getAffiliateByEmail,
  createStripeConnectAccount,
  getStripeConnectAccountStatus,
  updateAffiliateStripeAccount,
  updateAffiliatePaymentDetails,
} from "@/lib/affiliateService";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, email, affiliateId, stripeAccountId, lang = "en" } = body;

    if (!email && !affiliateId) {
      return NextResponse.json(
        { error: "Email or affiliateId is required." },
        { status: 400 }
      );
    }

    let affiliate = null;
    if (email) {
      affiliate = await getAffiliateByEmail(email);
    }

    const affId = affiliateId || affiliate?.id;
    if (!affId) {
      return NextResponse.json(
        { error: "Partner account not found." },
        { status: 404 }
      );
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    if (action === "save_payment_details") {
      const currentUser = await getCurrentUser();
      if (!currentUser?.email || currentUser.email.toLowerCase() !== (affiliate?.email || "").toLowerCase()) {
        return NextResponse.json({ error: "You can only update your own payout details." }, { status: 403 });
      }

      const { paymentMethod, bankName, iban, bicSwift } = body;
      if (paymentMethod !== "stripe_connect" && paymentMethod !== "bank_transfer") {
        return NextResponse.json({ error: "Choose a valid payout method." }, { status: 400 });
      }

      const result = await updateAffiliatePaymentDetails(affId, {
        paymentMethod,
        bankName,
        iban,
        bicSwift,
      });
      return NextResponse.json(result);
    }

    // 1. Initiate Stripe Connect Onboarding
    if (action === "onboard" || action === "connect") {
      const result = await createStripeConnectAccount(
        affId,
        email || affiliate?.email || "partner@somnobalance.online",
        origin,
        lang
      );
      return NextResponse.json(result);
    }

    // 2. Check Stripe Connect Account Status
    if (action === "status" || action === "check_status") {
      const targetAcct = stripeAccountId || affiliate?.stripeAccountId;
      const status = await getStripeConnectAccountStatus(targetAcct);
      return NextResponse.json({ success: true, status });
    }

    // 3. Save Custom or Existing Stripe Account ID
    if (action === "save_account" || action === "update_account") {
      if (!stripeAccountId) {
        return NextResponse.json(
          { error: "Missing stripeAccountId" },
          { status: 400 }
        );
      }
      const res = await updateAffiliateStripeAccount(affId, stripeAccountId);
      return NextResponse.json(res);
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
