import crypto from "crypto";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE_NAME = "sb_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET not configured");
  return secret;
}

export function sessionAuthConfigured() {
  return Boolean(process.env.SESSION_SECRET);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionCookieValue(userId: string) {
  const secret = getSecret();
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${expires}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionCookieValue(value: string | undefined): string | null {
  if (!value || !sessionAuthConfigured()) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiresStr, sig] = parts;

  const expires = Number(expiresStr);
  if (!userId || !Number.isFinite(expires) || Date.now() > expires) return null;

  const secret = process.env.SESSION_SECRET!;
  const payload = `${userId}.${expiresStr}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  return userId;
}
