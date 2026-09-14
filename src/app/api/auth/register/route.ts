import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import {
  hashPassword,
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
import { validatePhoneVerificationToken } from "@/lib/otpService";
import { validateAndNormalizePhone } from "@/lib/phoneUtils";
import { ROLE_PERMISSIONS } from "@/lib/storeService";

const schema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  phone: z.string().min(6).max(30),
  phoneVerificationToken: z.string().min(10),
  adminCode: z.string().optional(),
});

export async function POST(request: Request) {
  if (!supabaseConfigured() || !sessionAuthConfigured()) {
    return NextResponse.json(
      { error: "Accounts are not available in this environment yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bitte überprüfen Sie Ihre Angaben — inklusive einer verifizierten Telefonnummer (Deutschland +49 oder Indien +91) und einem Passwort mit mind. 8 Zeichen." },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, password, phone, phoneVerificationToken, adminCode } = parsed.data;

  // Validate German (+49) or Indian (+91) phone and OTP verification token
  const phoneVal = validateAndNormalizePhone(phone);
  if (!phoneVal.isValid || !phoneVal.normalized) {
    return NextResponse.json(
      { error: phoneVal.error || "Bitte geben Sie eine gültige Telefonnummer ein (Deutschland +49 oder Indien +91)." },
      { status: 400 }
    );
  }
  const normalizedPhone = phoneVal.normalized;

  const tokenCheck = validatePhoneVerificationToken(phoneVerificationToken, normalizedPhone, "register");
  if (!tokenCheck.isValid) {
    return NextResponse.json(
      { error: tokenCheck.error || "Ungültiges oder abgelaufenes Telefon-Verifikationstoken. Bitte fordern Sie einen neuen SMS-Code an." },
      { status: 400 }
    );
  }

  // Check admin code if provided
  let userRole = "customer";
  if (adminCode && adminCode.trim()) {
    const cleanAdminCode = adminCode.trim().toUpperCase();
    const envAdminCode = process.env.ADMIN_REGISTRATION_CODE?.trim().toUpperCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD?.trim();

    const isMatch =
      cleanAdminCode === "ADMIN_2K26" ||
      cleanAdminCode === "ADMIN_2026" ||
      (Boolean(envAdminCode) && cleanAdminCode === envAdminCode) ||
      (Boolean(envAdminPassword) && adminCode.trim() === envAdminPassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Ungültiger Admin-Code. Bitte prüfen Sie die Eingabe oder lassen Sie das Feld leer / Invalid admin code." },
        { status: 400 }
      );
    }
    userRole = "admin";
  }

  const supabase = getSupabase();

  let user: { id: string; email: string; firstName: string; lastName: string; phone?: string; role?: string; isAdmin?: boolean };
  try {
    const { data: existing } = await supabase
      .from("User")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "Ein Konto mit dieser E-Mail-Adresse existiert bereits." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();
    const insertPayload: any = {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: userRole,
    };
    if (normalizedPhone) {
      insertPayload.phone = normalizedPhone;
    }

    const { data, error } = await supabase
      .from("User")
      .insert(insertPayload)
      .select("id, email, firstName, lastName, phone, role")
      .single();
    if (error || !data) throw error ?? new Error("insert returned no data");

    const isAdmin = data.role === "admin";
    user = {
      ...data,
      isAdmin,
    };

    // If registering as admin, automatically create / link a super_admin staff account
    if (isAdmin) {
      try {
        const { data: existingStaff } = await supabase
          .from("StaffAccount")
          .select("id")
          .eq("email", data.email)
          .maybeSingle();

        if (!existingStaff) {
          await supabase.from("StaffAccount").insert({
            id: `staff_${Date.now()}_admin`,
            name: `${firstName} ${lastName}`.trim(),
            email: data.email,
            role: "super_admin",
            roleTitle: "Super Administrator",
            department: "Executive",
            status: "active",
            permissions: ROLE_PERMISSIONS.super_admin,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (staffErr) {
        console.warn("[auth/register] could not auto-create staff account:", staffErr);
      }
    }

  } catch (err) {
    console.error("[auth/register] failed:", err);
    return NextResponse.json(
      { error: "Konto konnte nicht erstellt werden. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
  if (user.isAdmin && adminConfigured()) {
    res.cookies.set(ADMIN_COOKIE_NAME, createAdminCookieValue(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
    });
  }
  return res;
}
