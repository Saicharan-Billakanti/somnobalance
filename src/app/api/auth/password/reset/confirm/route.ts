import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/auth";
import { emailSchema } from "@/lib/submission";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { email?: unknown; code?: unknown; password?: unknown };
  const parsed = emailSchema.safeParse(body.email);
  if (!parsed.success || typeof body.code !== "string" || !/^\d{6}$/.test(body.code) || typeof body.password !== "string" || body.password.length < 8) {
    return NextResponse.json({ error: "Enter your email, six-digit code, and a password with at least 8 characters." }, { status: 400 });
  }
  try {
    const db = getDB(), email = parsed.data.toLowerCase();
    const verification = await verifyOtp(db, email, "EMAIL", "RESET_PASSWORD", body.code);
    if (!verification.success) return NextResponse.json({ error: "The reset code is invalid or expired. Request a new code." }, { status: 400 });
    const passwordHash = await hashPassword(body.password);
    const result = await db.prepare('UPDATE "User" SET passwordHash = ? WHERE email = ?').bind(passwordHash, email).run();
    if (!result.meta?.changes) return NextResponse.json({ error: "The account could not be updated." }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Password reset is temporarily unavailable." }, { status: 503 });
  }
}
