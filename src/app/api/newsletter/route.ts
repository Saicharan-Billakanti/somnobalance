import { newsletterSchema, requestNewsletter } from "@/lib/newsletter";
import { readSubmission, protectSubmission, SubmissionError, submissionError } from "@/lib/submission";

export async function POST(request: Request) {
  try {
    const parsed = newsletterSchema.safeParse(await readSubmission(request));
    if (!parsed.success) throw new SubmissionError(400, "Bitte eine gültige E-Mail-Adresse angeben und der Anmeldung zustimmen.");
    await protectSubmission(request, parsed.data.email);
    const newsletter = await requestNewsletter(parsed.data, "footer");
    if (newsletter.status === "failed") throw new SubmissionError(503, "Die Anmeldung ist momentan nicht möglich. Bitte später erneut versuchen.");
    return Response.json({ ok: true, newsletter }, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return submissionError(error); }
}
