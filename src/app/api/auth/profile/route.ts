import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { getUserById, updateUserProfile, getUserOrders } from "@/lib/userService";
import { validatePhoneVerificationToken } from "@/lib/otpService";
import { validateAndNormalizePhone } from "@/lib/phoneUtils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = (await getUserById(user.id)) || user;
  const orders = await getUserOrders(user.email);

  return NextResponse.json({ profile, orders });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { firstName, lastName, phone, phoneVerificationToken, street, postalCode, city, country } = body;

  let finalPhone = phone;

  // If phone is modified and provided, check verification
  if (phone) {
    const existing = (await getUserById(user.id)) || user;
    const phoneVal = validateAndNormalizePhone(phone);
    if (!phoneVal.isValid || !phoneVal.normalized) {
      return NextResponse.json(
        { error: phoneVal.error || "Bitte geben Sie eine gültige Telefonnummer ein (Deutschland +49 oder Indien +91)." },
        { status: 400 }
      );
    }
    finalPhone = phoneVal.normalized;

    // If changing to a new phone number, require verification token
    const existingNorm = existing.phone ? validateAndNormalizePhone(existing.phone).normalized : "";
    if (finalPhone !== existingNorm) {
      if (!phoneVerificationToken) {
        return NextResponse.json(
          { error: "Bitte verifizieren Sie die neue Telefonnummer per SMS-Code." },
          { status: 400 }
        );
      }
      const tokenCheck = validatePhoneVerificationToken(phoneVerificationToken, finalPhone, "profile_update");
      if (!tokenCheck.isValid) {
        return NextResponse.json(
          { error: tokenCheck.error || "Ungültiges oder abgelaufenes Telefon-Verifikationstoken." },
          { status: 400 }
        );
      }
    }
  }

  const updated = await updateUserProfile(user.id, {
    firstName,
    lastName,
    phone: finalPhone,
    street,
    postalCode,
    city,
    country,
  });

  return NextResponse.json({ success: true, profile: updated });
}

