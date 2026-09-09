import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const ADMIN_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function timingSafeStringsEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  return timingSafeStringsEqual(input, secret);
}

export function createSessionCookieValue() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD not configured");
  const expires = Date.now() + SESSION_TTL_MS;
  const sig = crypto.createHmac("sha256", secret).update(String(expires)).digest("hex");
  return `${expires}.${sig}`;
}

export function verifySessionCookieValue(value: string | undefined) {
  if (!value) return false;
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const [expiresStr, sig] = value.split(".");
  if (!expiresStr || !sig) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = crypto.createHmac("sha256", secret).update(expiresStr).digest("hex");
  return timingSafeStringsEqual(sig, expected);
}
