import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { checkOtpRateLimit, createAndStoreOtp } from "@/lib/otp";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { emailSchema } from "@/lib/submission";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { email?: unknown; lang?: unknown };
  const parsed = emailSchema.safeParse(body.email);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const email = parsed.data.toLowerCase();
  try {
    const db = getDB();
    const user = await db.prepare('SELECT id FROM "User" WHERE email = ?').bind(email).first<{ id: string }>();
    if (user) {
      const limit = await checkOtpRateLimit(db, email, "EMAIL", "RESET_PASSWORD");
      if (limit.allowed) {
        const { otp } = await createAndStoreOtp(db, email, "EMAIL", "RESET_PASSWORD");
        const lang = body.lang === "en" ? "en" : "de";
        const sent = await sendPasswordResetEmail(email, otp, lang);
        if (!sent.success) console.warn("[password-reset] could not deliver reset code");
      }
    }
    return NextResponse.json({ success: true, message: "If the account exists, a reset code has been sent." });
  } catch {
    return NextResponse.json({ error: "Password reset is temporarily unavailable." }, { status: 503 });
  }
}
