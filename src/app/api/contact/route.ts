import { getDB, insertContactMessage } from "@/lib/db";
import { sendNotification } from "@/lib/mailer";
import { submitBusinessApplication } from "@/lib/businessService";
import { contactSchema, readSubmission, protectSubmission, SubmissionError, submissionError } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.safeParse(await readSubmission(request));
    if (!parsed.success) throw new SubmissionError(400, "Bitte die Angaben prüfen.");
    const data = parsed.data;
    await protectSubmission(request, data.email, data.honeypot);
    await insertContactMessage(getDB(), {
      id: crypto.randomUUID(), name: data.name, email: data.email, topic: data.topic, message: data.message,
    });
    if (data.topic === "business") {
      await submitBusinessApplication({
        userId: "",
        companyName: data.companyName || data.name,
        contactName: data.name,
        email: data.email,
        phone: data.phone,
        businessType: data.businessType || "Business enquiry",
        country: "Germany",
        notes: data.message,
      });
    }
    const subjects = { general: "Kontaktanfrage", business: "Für Unternehmen – Anfrage", partner: "Partneranfrage", order: "Bestellanfrage", advice: "Beratungsanfrage" };
    const mail = await sendNotification(
      `SomnoBalance: ${subjects[data.topic]}`,
      `${data.name} <${data.email}>\n\n${data.message}`, data.email,
    );
    if (mail.status !== "accepted") {
      console.warn("[contact] enquiry saved but email notification was not accepted", mail.reason);
      return Response.json({ ok: true, persisted: true, notification: "failed" });
    }
    return Response.json({ ok: true, persisted: true, notification: "accepted" });
  } catch (error) { return submissionError(error); }
}
