import { z } from "zod";
import { getDB } from "@/lib/db";
import { serverConfig } from "@/lib/serverConfig";

export const emailSchema = z.string().trim().max(254).email().transform(v => v.toLowerCase());
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: emailSchema,
  topic: z.enum(["general", "business", "partner", "order", "advice"]),
  message: z.string().trim().min(1).max(5000),
  companyName: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(40).optional(),
  businessType: z.string().trim().max(200).optional(),
  honeypot: z.string().max(200).optional(),
});
const optionalText = z.string().trim().max(300).optional();
export const partnerSchema = z.object({
  name: z.string().trim().min(1).max(200), email: emailSchema,
  phone: optionalText, businessName: optionalText, businessType: optionalText,
  website: optionalText, country: optionalText, address: optionalText,
  audienceType: optionalText, description: z.string().trim().max(5000).optional(),
  bankName: optionalText, iban: optionalText, bicSwift: optionalText,
  honeypot: z.string().max(200).optional(),
});

export class SubmissionError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function submissionError(error: unknown): Response {
  const known = error instanceof SubmissionError;
  return Response.json({ error: known ? error.message : "Der Dienst ist vorübergehend nicht verfügbar. Bitte später erneut versuchen." }, {
    status: known ? error.status : 503,
    headers: { "Cache-Control": "no-store", ...(known && error.status === 429 ? { "Retry-After": "600" } : {}) },
  });
}

export async function readSubmission(request: Request): Promise<unknown> {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new SubmissionError(403, "Diese Anfrage ist nicht erlaubt.");
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new SubmissionError(415, "JSON erforderlich.");
  }
  // Bound the actual stream, not just the untrusted Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) throw new SubmissionError(400, "Ungültige Anfrage.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32768) {
      await reader.cancel();
      throw new SubmissionError(413, "Anfrage zu groß.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new SubmissionError(400, "Ungültiges JSON."); }
}

export async function privateKey(value: string): Promise<string> {
  const secret = serverConfig("ABUSE_HMAC_KEY");
  if (!secret || secret.length < 32) throw new SubmissionError(503, "Dienst nicht konfiguriert.");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

// Atomic D1 counter shared by all Worker instances. Never retain raw IP addresses.
export async function consumeLimit(scope: string, identity: string, seconds: number, limit: number): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const key = await privateKey(`${scope}:${identity}`);
  const db = getDB();
  await db.prepare('DELETE FROM "SubmissionLimit" WHERE "expiresAt" <= ?').bind(now).run();
  const row = await db.prepare(`INSERT INTO "SubmissionLimit" ("key", "count", "expiresAt") VALUES (?, 1, ?)
    ON CONFLICT("key") DO UPDATE SET "count" = "count" + 1
    RETURNING "count"`).bind(key, now + seconds).first<{ count: number }>();
  if (!row) throw new SubmissionError(503, "Dienst vorübergehend nicht verfügbar.");
  return row.count <= limit;
}

export async function protectSubmission(request: Request, email: string, honeypot?: string) {
  if (honeypot) throw new SubmissionError(400, "Ungültige Anfrage.");
  // Cloudflare supplies this header at the edge. Do not trust X-Forwarded-For.
  const ip = request.headers.get("cf-connecting-ip") || "local-or-unknown";
  if (!await consumeLimit("submission-ip", ip, 600, 10)) {
    throw new SubmissionError(429, "Zu viele Anfragen. Bitte später erneut versuchen.");
  }
  if (!await consumeLimit("enquiry-email", email, 3600, 5)) {
    throw new SubmissionError(429, "Zu viele Anfragen. Bitte später erneut versuchen.");
  }
}
