import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import {
  hashPassword,
  createSessionCookieValue,
  sessionAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth";

const schema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(200),
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
    return NextResponse.json(
      { error: "Please check your details — password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, password } = parsed.data;
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { firstName, lastName, email, passwordHash },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
