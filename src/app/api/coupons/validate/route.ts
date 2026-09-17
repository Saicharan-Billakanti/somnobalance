import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/affiliateService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { couponCode, subtotal, email } = body;

    if (!couponCode) {
      return NextResponse.json({ error: "Missing coupon code" }, { status: 400 });
    }

    const orderSubtotal = Number(subtotal) || 0;
    const result = await validateCoupon(String(couponCode), orderSubtotal, email);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[coupon validate error]:", err);
    return NextResponse.json({ error: "Could not validate coupon." }, { status: 500 });
  }
}
