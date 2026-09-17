import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import {
  verifyPassword,
  createSessionCookieValue,
  sessionAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth";
import {
  createSessionCookieValue as createAdminCookieValue,
  adminConfigured,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/adminAuth";
import { getAffiliateByEmail } from "@/lib/affiliateService";
import { getBusinessApplicationByEmail } from "@/lib/businessService";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
  }
  if (!supabaseConfigured() || !sessionAuthConfigured()) {
    return NextResponse.json({ error: "Accounts are not configured in this environment." }, { status: 503 });
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  const { data: user, error } = await getSupabase()
    .from("User")
    .select("id, email, firstName, lastName, passwordHash, role")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("[auth/login] database error:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const [affiliate, businessApp] = await Promise.all([
    getAffiliateByEmail(user.email),
    getBusinessApplicationByEmail(user.email),
  ]);
  const isAffiliate = Boolean(affiliate && ["active", "pending"].includes(affiliate.status));
  const isBusiness = Boolean(businessApp);
  const isAdmin = user.role === "admin";
  const role = isAdmin ? "admin" : isBusiness ? "business" : isAffiliate ? "affiliate" : "customer";
  const userPayload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role,
    isAffiliate,
    isBusiness,
    isAdmin,
  };

  const res = NextResponse.json({ user: userPayload });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
  if (isAdmin && adminConfigured()) {
    res.cookies.set(ADMIN_COOKIE_NAME, createAdminCookieValue(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
    });
  } else {
    res.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  }
  return res;
}
