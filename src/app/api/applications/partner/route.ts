import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { sendNotification } from "@/lib/mailer";

// Affiliate/referral partner application. Distinct from the B2B wholesale
// application above — per the client's spec (email, 2026-09-16), these are
// two separate account types: this one gets a personal referral link with a
// 5% customer discount and up to 10% commission for the partner, never
// wholesale pricing. This route only collects and stores the application;
// generating the actual referral link/commission tracking is backend work
// not done here.
const partnerApplicationSchema = z.object({
  contactName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  profession: z.enum(["physiotherapist", "alternative-practitioner", "kinesiologist", "massage-therapist", "hotel", "other"]),
  practiceOrPropertyName: z.string().min(1).max(200),
  website: z.string().max(300).optional(),
  message: z.string().max(5000).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = partnerApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid application", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const persisted = supabaseConfigured();

  if (persisted) {
    const { error } = await getSupabase()
      .from("PartnerApplication")
      .insert({ id: crypto.randomUUID(), status: "pending", ...data });
    if (error) {
      console.error("[applications/partner] failed to save application:", error);
      return NextResponse.json(
        { error: "Could not submit your application. Please try again." },
        { status: 500 },
      );
    }
  }

  await sendNotification(
    `New partner application: ${data.practiceOrPropertyName}`,
    `${data.contactName} <${data.email}>${data.phone ? ` · ${data.phone}` : ""}\n` +
      `Profession: ${data.profession}\n` +
      `Practice/property: ${data.practiceOrPropertyName}${data.website ? `\nWebsite: ${data.website}` : ""}\n\n` +
      `${data.message ?? ""}${persisted ? "" : "\n\n[not persisted — Supabase not configured]"}`,
  );

  return NextResponse.json({ ok: true, persisted });
}
