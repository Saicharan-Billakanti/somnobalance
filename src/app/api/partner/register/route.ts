import { registerAffiliate } from "@/lib/affiliateService";
import { notificationConfigured, sendNotification } from "@/lib/mailer";
import { partnerSchema, readSubmission, protectSubmission, SubmissionError, submissionError } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const parsed = partnerSchema.safeParse(await readSubmission(request));
    if (!parsed.success) throw new SubmissionError(400, "Bitte die Angaben prüfen.");
    const { honeypot, ...data } = parsed.data;
    if (!notificationConfigured()) throw new SubmissionError(503, "E-Mail-Dienst nicht konfiguriert.");
    await protectSubmission(request, data.email, honeypot);
    const affiliate = await registerAffiliate(data);
    // Banking information stays in the application store, not in email.
    const fields = [
      `Name: ${data.name}`, `E-Mail: ${data.email}`, `Telefon: ${data.phone || "–"}`,
      `Unternehmen: ${data.businessName || "–"}`, `Art: ${data.businessType || "–"}`,
      `Website: ${data.website || "–"}`, `Land: ${data.country || "–"}`,
      `Adresse: ${data.address || "–"}`, `Zielgruppe: ${data.audienceType || "–"}`,
      `Nachricht: ${data.description || "–"}`,
    ];
    const mail = await sendNotification("SomnoBalance: Partner werden – Bewerbung", fields.join("\n"), data.email);
    if (mail.status !== "accepted") {
      return Response.json({ error: "Bewerbung gespeichert, E-Mail-Benachrichtigung fehlgeschlagen.", persisted: true, notification: "failed" }, { status: 502 });
    }
    return Response.json({ success: true, affiliate, notification: "accepted" });
  } catch (error) { return submissionError(error); }
}
