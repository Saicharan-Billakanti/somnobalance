// src/app/api/auth/otp/resend/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { getDB, dbConfigured, getUserById } from "@/lib/db";
import { checkOtpRateLimit, createAndStoreOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";
import { sendOtpSms } from "@/lib/sms";
import { verifyTurnstileToken } from "@/lib/turnstile";

const schema = z.object({
  userId: z.string().min(1),
  channel: z.enum(["EMAIL", "SMS"]),
  lang: z.enum(["de", "en"]).optional().default("de"),
  turnstileToken: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { userId, channel, lang, turnstileToken } = parsed.data;

  // Turnstile bot verification
  const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    return NextResponse.json(
      { error: "Sicherheitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 403 }
    );
  }

  const db = getDB();
  const user = await getUserById(db, userId);

  if (!user) {
    return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });
  }

  const identifier = channel === "EMAIL" ? user.email : user.phone;
  if (!identifier) {
    return NextResponse.json(
      { error: channel === "EMAIL" ? "Keine E-Mail hinterlegt." : "Keine Mobilnummer hinterlegt." },
      { status: 400 }
    );
  }

  // Check rate limit (60s cooldown)
  const rateLimit = await checkOtpRateLimit(db, identifier, channel, "REGISTRATION");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Bitte warten Sie noch ${rateLimit.waitSeconds} Sekunden, bevor Sie einen neuen Code anfordern.`,
        waitSeconds: rateLimit.waitSeconds,
      },
      { status: 429 }
    );
  }

  // Generate & Store new OTP
  const otpRes = await createAndStoreOtp(db, identifier, channel, "REGISTRATION");

  // Send via the selected channel
  if (channel === "EMAIL") {
    const sent = await sendOtpEmail(user.email, otpRes.otp, lang);
    if (!sent.success) {
      return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
    }
  } else {
    const sent = await sendOtpSms(identifier, otpRes.otp, lang);
    if (!sent.success) {
      return NextResponse.json({ error: "SMS konnte nicht gesendet werden." }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    channel,
    message:
      channel === "EMAIL"
        ? "Ein neuer Bestätigungscode wurde per E-Mail gesendet."
        : "Ein neuer Bestätigungscode wurde per SMS gesendet.",
  });
}
