import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { sendNotification } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  topic: z.enum(["general", "business", "partner", "order"]),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid message", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const persisted = supabaseConfigured();

  if (persisted) {
    const { error } = await getSupabase()
      .from("ContactMessage")
      .insert({ id: crypto.randomUUID(), ...data });
    if (error) {
      console.error("[contact] failed to save message:", error);
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 500 }
      );
    }
  }

  await sendNotification(
    `New contact form message (${data.topic})`,
    `${data.name} <${data.email}>\n\n${data.message}${persisted ? "" : "\n\n[not persisted — Supabase not configured]"}`
  );

  return NextResponse.json({ ok: true, persisted });
}
