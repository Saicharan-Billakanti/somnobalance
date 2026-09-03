import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  topic: z.enum(["general", "business", "partner", "order"]),
  message: z.string().min(1).max(5000),
});

const dbConfigured = Boolean(process.env.DATABASE_URL);

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

  if (dbConfigured) {
    await getPrisma().contactMessage.create({ data });
  }

  await sendNotification(
    `New contact form message (${data.topic})`,
    `${data.name} <${data.email}>\n\n${data.message}${dbConfigured ? "" : "\n\n[not persisted — no DATABASE_URL configured]"}`
  );

  return NextResponse.json({ ok: true, persisted: dbConfigured });
}
