import { NextResponse } from "next/server";
import { z } from "zod";
import { getDB, dbConfigured, getUserEmailExists, insertUser } from "@/lib/db";
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
      { error: "Please check your details — password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, password } = parsed.data;
  const db = getDB();

  try {
    const exists = await getUserEmailExists(db, email);
    if (exists) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    await insertUser(db, { id, email, passwordHash, firstName, lastName });

    const res = NextResponse.json({
      user: { id, email, firstName, lastName },
    });
    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    console.error("[auth/register] failed:", err);
    return NextResponse.json(
      { error: "Could not create your account. Please try again." },
      { status: 500 }
    );
  }
}
