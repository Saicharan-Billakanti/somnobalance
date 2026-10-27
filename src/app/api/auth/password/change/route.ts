import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/currentUser";
import { getDB, getUserByEmail } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { consumeLimit } from "@/lib/submission";

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "This request is not allowed." }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a new password with at least 8 characters." }, { status: 400 });
  }

  try {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    if (!await consumeLimit("password-change", `${user.id}:${ip}`, 900, 5)) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const db = getDB();
    const account = await getUserByEmail(db, user.email);
    if (!account || !await verifyPassword(parsed.data.currentPassword, account.passwordHash)) {
      return NextResponse.json({ error: "The current password is incorrect." }, { status: 400 });
    }
    if (await verifyPassword(parsed.data.newPassword, account.passwordHash)) {
      return NextResponse.json({ error: "Choose a password different from your current one." }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await db.prepare(`UPDATE "User" SET passwordHash = ? WHERE id = ?`).bind(passwordHash, account.id).run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[auth/password/change] failed:", error);
    return NextResponse.json({ error: "Password change is temporarily unavailable." }, { status: 503 });
  }
}
