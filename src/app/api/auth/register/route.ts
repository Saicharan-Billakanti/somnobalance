// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { getDB, dbConfigured, getUserEmailExists, getUserByPhone, insertUser } from "@/lib/db";
import { hashPassword, sessionAuthConfigured } from "@/lib/auth";
import { normalizePhoneNumber, sendOtpSms } from "@/lib/sms";
import { sendOtpEmail } from "@/lib/mailer";
import { createAndStoreOtp } from "@/lib/otp";
import { verifyTurnstileToken } from "@/lib/turnstile";

const schema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  password: z.string().min(8).max(200),
  lang: z.enum(["de", "en"]).optional().default("de"),
  turnstileToken: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  if (!dbConfigured() || !sessionAuthConfigured()) {
    return NextResponse.json(
      { error: "Accounts are not available in this environment yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bitte überprüfen Sie Ihre Eingaben. Das Passwort muss mindestens 8 Zeichen lang sein." },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, phone, password, lang, turnstileToken } = parsed.data;

  // 1. Bot Verification via Turnstile (server-side)
  const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    return NextResponse.json(
      { error: "Sicherheitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 403 }
    );
  }

  // 2. Validate and Normalize Phone Number
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone) {
    return NextResponse.json(
      { error: "Bitte geben Sie eine gültige Mobilfunknummer ein (z.B. +49 151 12345678)." },
      { status: 400 }
    );
  }

  const db = getDB();

  try {
    // 3. Email Uniqueness Check
    const emailExists = await getUserEmailExists(db, email);
    if (emailExists) {
      return NextResponse.json(
        { error: "Ein Konto mit dieser E-Mail-Adresse existiert bereits." },
        { status: 409 }
      );
    }

    // 4. Phone Uniqueness Check
    const phoneUser = await getUserByPhone(db, normalizedPhone);
    if (phoneUser && phoneUser.phoneVerifiedAt) {
      return NextResponse.json(
        { error: "Diese Mobilnummer ist bereits mit einem verifizierten Konto verknüpft." },
        { status: 409 }
      );
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    // 5. Create unverified user in D1
    await insertUser(db, {
      id,
      email,
      passwordHash,
      firstName,
      lastName,
      phone: normalizedPhone,
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
    });

    // 6. Generate secure 6-digit OTPs
    const emailOtpRes = await createAndStoreOtp(db, email, "EMAIL", "REGISTRATION");
    const smsOtpRes = await createAndStoreOtp(db, normalizedPhone, "SMS", "REGISTRATION");

    // 7. Dispatch OTPs concurrently
    await Promise.allSettled([
      sendOtpEmail(email, emailOtpRes.otp, lang),
      sendOtpSms(normalizedPhone, smsOtpRes.otp, lang),
    ]);

    return NextResponse.json({
      ok: true,
      userId: id,
      email,
      phone: normalizedPhone,
      requiresVerification: true,
      emailVerified: false,
      phoneVerified: false,
    });
  } catch (err) {
    console.error("[auth/register] failed:", err);
    return NextResponse.json(
      { error: "Konto konnte nicht erstellt werden. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }
}
