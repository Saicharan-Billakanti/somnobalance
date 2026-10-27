import { z } from "zod";
import { getDB } from "@/lib/db";
import { serverConfig } from "@/lib/serverConfig";
import { consumeLimit, emailSchema } from "@/lib/submission";

export const CONSENT_VERSION = "2026-10-22-v1";
export const newsletterSchema = z.object({ email: emailSchema, consent: z.literal(true) });
const sourceSchema = z.enum(["footer", "regeneration-check"]);
export type NewsletterOutcome = { status: "pending_confirmation" | "failed" | "not_requested" };

export async function requestNewsletter(input: unknown, source: "footer" | "regeneration-check"): Promise<NewsletterOutcome> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success || !sourceSchema.safeParse(source).success) return { status: "failed" };
  const { email } = parsed.data;
  const apiKey = serverConfig("BREVO_API_KEY");
  const listId = Number(serverConfig("BREVO_LIST_ID"));
  const templateId = Number(serverConfig("BREVO_DOI_TEMPLATE_ID"));
  const redirect = serverConfig("BREVO_DOI_REDIRECT_URL");
  if (!apiKey || !Number.isSafeInteger(listId) || listId <= 0 || !Number.isSafeInteger(templateId) || templateId <= 0) return { status: "failed" };
  try {
    if (!redirect || new URL(redirect).protocol !== "https:") return { status: "failed" };
    // Shared across footer and quiz; concurrent/repeated requests do not resend.
    if (!await consumeLimit("newsletter-cooldown", email, 900, 1)) return { status: "pending_confirmation" };
    if (!await consumeLimit("newsletter-daily", email, 86400, 3)) return { status: "pending_confirmation" };
    const db = getDB();
    const id = crypto.randomUUID();
    await db.prepare(`INSERT INTO "NewsletterConsentRequest"
      ("id", "email", "source", "consentVersion", "submittedAt", "status") VALUES (?, ?, ?, ?, ?, 'requested')`)
      .bind(id, email, source, CONSENT_VERSION, new Date().toISOString()).run();

    let status = "provider_unknown";
    let pending = false;
    try {
      const response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
        method: "POST",
        headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ email, includeListIds: [listId], templateId, redirectionUrl: redirect,
          contactPixelTrackingConsent: false }),
      });
      if (response.ok) { status = "provider_accepted"; pending = true; }
      else {
        const error = await response.json().catch(() => ({})) as { code?: string };
        // Do not expose whether an address already exists, or force resubscription.
        if (response.status === 400 && (error.code === "duplicate_parameter" || error.code === "duplicate_request")) {
          status = "duplicate"; pending = true;
        } else {
          status = "provider_rejected";
          console.warn("[newsletter] provider rejected request", response.status);
        }
      }
    } catch {
      console.warn("[newsletter] provider request failed or timed out");
    }
    await db.prepare('UPDATE "NewsletterConsentRequest" SET "status" = ? WHERE "id" = ?').bind(status, id).run();
    return { status: pending ? "pending_confirmation" : "failed" };
  } catch {
    // Fail closed if durable evidence or abuse protection is unavailable.
    console.warn("[newsletter] configuration or durable storage unavailable");
    return { status: "failed" };
  }
}
