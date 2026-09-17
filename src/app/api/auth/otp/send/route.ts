import { NextResponse } from "next/server";
import { z } from "zod";
import { sendPhoneOtp } from "@/lib/otpService";

const sendOtpSchema = z.object({
  phone: z.string().min(6).max(30),
  purpose: z.enum(["register", "profile_update", "login"]).optional().default("register"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige Telefonnummer ein (Deutschland +49 oder Indien +91)." },
        { status: 400 }
      );
    }

    const { phone, purpose } = parsed.data;
    const result = await sendPhoneOtp(phone, purpose);

    if (!result.success) {
      const status = result.cooldownSeconds ? 429 : 400;
      return NextResponse.json(
        {
          error: result.error || "SMS-Code konnte nicht gesendet werden.",
          cooldownSeconds: result.cooldownSeconds,
        },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      phone: result.phone,
      masked: result.masked,
      cooldownSeconds: result.cooldownSeconds,
      message: `Bestätigungscode an ${result.masked} gesendet.`,
    });
  } catch (error) {
    console.error("[otp/send] error:", error);
    return NextResponse.json(
      { error: "Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
