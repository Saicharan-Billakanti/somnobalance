import { NextResponse } from "next/server";
import { registerAffiliate } from "@/lib/affiliateService";
import { sendNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      businessName,
      businessType,
      website,
      country,
      address,
      audienceType,
      description,
      bankName,
      iban,
      bicSwift,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const affiliate = await registerAffiliate({
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      businessName: businessName ? String(businessName) : undefined,
      businessType: businessType ? String(businessType) : undefined,
      website: website ? String(website) : undefined,
      country: country ? String(country) : undefined,
      address: address ? String(address) : undefined,
      audienceType: audienceType ? String(audienceType) : undefined,
      description: description ? String(description) : undefined,
      bankName: bankName ? String(bankName) : undefined,
      iban: iban ? String(iban) : undefined,
      bicSwift: bicSwift ? String(bicSwift) : undefined,
    });

    await sendNotification(
      `New Partner Application: ${name}`,
      `${name} <${email}>\nBusiness: ${businessName || "Individual"}\nType: ${businessType || "N/A"}\nAudience: ${audienceType || "N/A"}`
    );

    return NextResponse.json({ success: true, affiliate });
  } catch (err) {
    console.error("[partner register error]:", err);
    return NextResponse.json(
      { error: "Could not submit partner application. Please try again." },
      { status: 500 }
    );
  }
}
