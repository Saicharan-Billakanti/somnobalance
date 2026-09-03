import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSessionCookieValue,
  sessionAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !sessionAuthConfigured()) {
    return NextResponse.json(
      { error: "Accounts are not available in this environment yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email } });

  // Same error for "no such user" and "wrong password" so we don't leak which emails exist.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
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
