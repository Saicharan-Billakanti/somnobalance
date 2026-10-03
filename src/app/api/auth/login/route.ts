// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { getDB, dbConfigured, getUserByEmail } from "@/lib/db";
import {
  verifyPassword,
  createSessionCookieValue,
  sessionAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/turnstile";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
    return NextResponse.json({ error: "Bitte geben Sie Ihre E-Mail und Ihr Passwort ein." }, { status: 400 });
  }

  const { email, password, turnstileToken } = parsed.data;

  // Turnstile verification
  const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    return NextResponse.json(
      { error: "Sicherheitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut." },
      { status: 403 }
    );
  }

  const db = getDB();
  const user = await getUserByEmail(db, email);

  // Same error for "no such user" and "wrong password" — don't leak which emails exist.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "E-Mail oder Passwort ist nicht korrekt." }, { status: 401 });
  }

  // Check if user has pending email verification
  const isDemoAdmin = user.email.toLowerCase() === "admin@somnobalance.com";
  const needsVerification = !user.emailVerifiedAt && !isDemoAdmin;

  if (needsVerification) {
    return NextResponse.json({
      requiresVerification: true,
      userId: user.id,
      email: user.email,
      phone: user.phone,
      emailVerified: Boolean(user.emailVerifiedAt),
      phoneVerified: true,
      message: "Bitte verifizieren Sie Ihre E-Mail-Adresse.",
    });
  }

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
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
