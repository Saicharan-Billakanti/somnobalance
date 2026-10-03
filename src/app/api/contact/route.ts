import { NextResponse } from "next/server";
import { z } from "zod";
import { getDB, dbConfigured, insertContactMessage } from "@/lib/db";
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
  const persisted = dbConfigured();

  if (persisted) {
    try {
      await insertContactMessage(getDB(), {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        topic: data.topic,
        message: data.message,
      });
    } catch (err) {
      console.error("[contact] failed to save message:", err);
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 500 }
      );
    }
  }

  await sendNotification(
    `New contact form message (${data.topic})`,
    `${data.name} <${data.email}>\n\n${data.message}${persisted ? "" : "\n\n[not persisted — D1 not configured]"}`
  );

  return NextResponse.json({ ok: true, persisted });
}
