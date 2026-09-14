import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminOrPartnerAccess } from "@/lib/adminAuth";
import {
  getAllAdminAffiliateData,
  updateAffiliateStatus,
  createAffiliateCoupon,
  createAffiliatePayout,
  updateAffiliateStripeAccount,
  createStripeConnectAccount,
  getStripeConnectAccountStatus,
} from "@/lib/affiliateService";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminOrPartnerAccess(session);
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getAllAdminAffiliateData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[admin affiliates GET error]:", err);
    return NextResponse.json({ error: "Failed to load affiliate data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    if (action === "update_status") {
      const { affiliateId, status } = body;
      if (!affiliateId || !status) {
        return NextResponse.json({ error: "Missing affiliateId or status" }, { status: 400 });
      }
      await updateAffiliateStatus(affiliateId, status);
      return NextResponse.json({ success: true });
    }

    if (action === "update_stripe_account") {
      const { affiliateId, stripeAccountId } = body;
      if (!affiliateId || !stripeAccountId) {
        return NextResponse.json({ error: "Missing affiliateId or stripeAccountId" }, { status: 400 });
      }
      const res = await updateAffiliateStripeAccount(affiliateId, stripeAccountId);
      return NextResponse.json(res);
    }

    if (action === "check_stripe_account") {
      const { stripeAccountId } = body;
      if (!stripeAccountId) {
        return NextResponse.json({ error: "Missing stripeAccountId" }, { status: 400 });
      }
      const status = await getStripeConnectAccountStatus(stripeAccountId);
      return NextResponse.json({ success: true, status });
    }

    if (action === "create_connect_onboarding") {
      const { affiliateId, email, lang = "en" } = body;
      if (!affiliateId) {
        return NextResponse.json({ error: "Missing affiliateId" }, { status: 400 });
      }
      const origin = request.headers.get("origin") ?? new URL(request.url).origin;
      const res = await createStripeConnectAccount(
        affiliateId,
        email || "partner@somnobalance.online",
        origin,
        lang
      );
      return NextResponse.json(res);
    }

    if (action === "create_coupon") {
      const { affiliateId, couponCode, discountRate, commissionRate, minimumOrderValue } = body;
      if (!affiliateId || !couponCode) {
        return NextResponse.json({ error: "Missing required coupon fields" }, { status: 400 });
      }
      const coupon = await createAffiliateCoupon({
        affiliateId,
        couponCode,
        discountRate: Number(discountRate),
        commissionRate: Number(commissionRate),
        minimumOrderValue: Number(minimumOrderValue),
      });
      return NextResponse.json({ success: true, coupon });
    }

    if (action === "create_payout" || action === "record_payout") {
      const { affiliateId, amount, paymentMethod, paymentReference, notes } = body;
      if (!affiliateId || !amount) {
        return NextResponse.json({ error: "Missing required payout fields" }, { status: 400 });
      }
      const payout = await createAffiliatePayout({
        affiliateId,
        amount: Number(amount),
        paymentMethod: paymentMethod || "stripe_connect",
        paymentReference,
        notes,
      });
      return NextResponse.json({ success: true, payout });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("[admin affiliates POST error]:", err);
    return NextResponse.json({ error: err.message || "Operation failed" }, { status: 500 });
  }
}

