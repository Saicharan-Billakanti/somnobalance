import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPhoneOtp } from "@/lib/otpService";

const verifyOtpSchema = z.object({
  phone: z.string().min(6).max(30),
  code: z.string().min(4).max(10),
  purpose: z.enum(["register", "profile_update", "login"]).optional().default("register"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bitte geben Sie Telefonnummer und 6-stelligen Bestätigungscode an." },
        { status: 400 }
      );
    }

    const { phone, code, purpose } = parsed.data;
    const result = await verifyPhoneOtp(phone, code, purpose);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Ungültiger Bestätigungscode." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      phone: result.phone,
      verificationToken: result.verificationToken,
      message: "Telefonnummer erfolgreich verifiziert.",
    });
  } catch (error) {
    console.error("[otp/verify] error:", error);
    return NextResponse.json(
      { error: "Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
