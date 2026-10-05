// src/app/api/auth/otp/verify/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getDB,
  dbConfigured,
  getUserById,
  updateUserEmailVerified,
  updateUserPhoneVerified,
} from "@/lib/db";
import {
  createSessionCookieValue,
  sessionAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";

const schema = z.object({
  userId: z.string().min(1),
  channel: z.enum(["EMAIL", "SMS", "BOTH"]).optional(),
  emailCode: z.string().optional(),
  phoneCode: z.string().optional(),
  code: z.string().optional(),
});

export async function POST(request: Request) {
  if (!dbConfigured() || !sessionAuthConfigured()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  const { userId, channel, emailCode, phoneCode, code } = parsed.data;
  const db = getDB();
  const user = await getUserById(db, userId);

  if (!user) {
    return NextResponse.json(
      { error: "Benutzerkonto nicht gefunden." },
      { status: 404 }
    );
  }

  let emailOk = Boolean(user.emailVerifiedAt);
  let phoneOk = Boolean(user.phoneVerifiedAt);

  const errors: Record<string, string> = {};

  // 1. Verify Email OTP if provided or requested
  const emailOtpToVerify = emailCode || code || (channel === "EMAIL" ? code : undefined);
  if (emailOtpToVerify && !emailOk) {
    const res = await verifyOtp(db, user.email, "EMAIL", "REGISTRATION", emailOtpToVerify);
    if (res.success) {
      emailOk = true;
      await updateUserEmailVerified(db, user.id);
    } else {
      if (res.error === "EXPIRED") {
        errors.email = "Der E-Mail-Code ist abgelaufen. Bitte fordern Sie einen neuen an.";
      } else if (res.error === "MAX_ATTEMPTS") {
        errors.email = "Maximale Anzahl an Versuchen erreicht. Bitte fordern Sie einen neuen Code an.";
      } else {
        errors.email = `Ungültiger E-Mail-Code. ${res.remainingAttempts !== undefined ? `Verbleibende Versuche: ${res.remainingAttempts}` : ""}`;
      }
    }
  }

  // 2. Verify Phone OTP if provided (optional)
  const phoneOtpToVerify = phoneCode || (channel === "SMS" ? code : undefined);
  if (phoneOtpToVerify && !phoneOk && user.phone) {
    const res = await verifyOtp(db, user.phone, "SMS", "REGISTRATION", phoneOtpToVerify);
    if (res.success) {
      phoneOk = true;
      await updateUserPhoneVerified(db, user.id);
    } else {
      if (res.error === "EXPIRED") {
        errors.phone = "Der SMS-Code ist abgelaufen. Bitte fordern Sie einen neuen an.";
      } else if (res.error === "MAX_ATTEMPTS") {
        errors.phone = "Maximale Anzahl an Versuchen erreicht. Bitte fordern Sie einen neuen Code an.";
      } else {
        errors.phone = `Ungültiger SMS-Code. ${res.remainingAttempts !== undefined ? `Verbleibende Versuche: ${res.remainingAttempts}` : ""}`;
      }
    }
  }

  // If errors occurred
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        error: errors.email || errors.phone || "Verifizierung fehlgeschlagen.",
        errors,
        emailVerified: emailOk,
        phoneVerified: phoneOk,
      },
      { status: 400 }
    );
  }

  // 3. Email Verified: Issue Session Cookie
  if (emailOk) {
    const res = NextResponse.json({
      ok: true,
      fullyVerified: true,
      emailVerified: true,
      phoneVerified: phoneOk,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    });

    return res;
  }

  return NextResponse.json({
    ok: true,
    fullyVerified: false,
    emailVerified: emailOk,
    phoneVerified: phoneOk,
  });
}
