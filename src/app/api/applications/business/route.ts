import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { sendNotification } from "@/lib/mailer";

// B2B wholesale account application. Distinct from the Partner/affiliate
// application below (src/app/api/applications/partner/route.ts) — per the
// client's spec (email, 2026-09-16), these are two separate account types
// with no shared logic: wholesale pricing + no commission vs. a personal
// discount link + commission. This route only collects and stores the
// application; account creation/approval is backend work not done here.
const businessApplicationSchema = z.object({
  contactName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  companyName: z.string().min(1).max(200),
  companyType: z.enum(["hotel", "planning-office", "clinic", "other"]),
  propertyCount: z.string().max(50).optional(),
  projectStage: z.enum(["planning", "active", "renovation", "other"]),
  message: z.string().max(5000).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = businessApplicationSchema.safeParse(body);

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
      .from("BusinessApplication")
      .insert({ id: crypto.randomUUID(), status: "pending", ...data });
    if (error) {
      console.error("[applications/business] failed to save application:", error);
      return NextResponse.json(
        { error: "Could not submit your application. Please try again." },
        { status: 500 },
      );
    }
  }

  await sendNotification(
    `New B2B wholesale application: ${data.companyName}`,
    `${data.contactName} <${data.email}>${data.phone ? ` · ${data.phone}` : ""}\n` +
      `Company: ${data.companyName} (${data.companyType})\n` +
      `Project stage: ${data.projectStage}${data.propertyCount ? `\nProperties/rooms: ${data.propertyCount}` : ""}\n\n` +
      `${data.message ?? ""}${persisted ? "" : "\n\n[not persisted — Supabase not configured]"}`,
  );

  return NextResponse.json({ ok: true, persisted });
}
