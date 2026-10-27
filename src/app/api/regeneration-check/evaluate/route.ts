import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateRegenerationCheck } from "@/lib/regenerationCheck";
import { sendEmail } from "@/lib/mailer";
import { requestNewsletter, type NewsletterOutcome } from "@/lib/newsletter";
import { readSubmission, protectSubmission, submissionError, SubmissionError } from "@/lib/submission";

const evaluateRequestSchema = z.object({
  answers: z.union([
    z.array(z.number().int().min(0).max(4)).length(20),
    z.record(z.string(), z.number().int().min(0).max(4)),
  ]).optional(),
  // Also accept flat q01..q20 in the root object
  q01: z.number().int().min(0).max(4).optional(),
  q02: z.number().int().min(0).max(4).optional(),
  q03: z.number().int().min(0).max(4).optional(),
  q04: z.number().int().min(0).max(4).optional(),
  q05: z.number().int().min(0).max(4).optional(),
  q06: z.number().int().min(0).max(4).optional(),
  q07: z.number().int().min(0).max(4).optional(),
  q08: z.number().int().min(0).max(4).optional(),
  q09: z.number().int().min(0).max(4).optional(),
  q10: z.number().int().min(0).max(4).optional(),
  q11: z.number().int().min(0).max(4).optional(),
  q12: z.number().int().min(0).max(4).optional(),
  q13: z.number().int().min(0).max(4).optional(),
  q14: z.number().int().min(0).max(4).optional(),
  q15: z.number().int().min(0).max(4).optional(),
  q16: z.number().int().min(0).max(4).optional(),
  q17: z.number().int().min(0).max(4).optional(),
  q18: z.number().int().min(0).max(4).optional(),
  q19: z.number().int().min(0).max(4).optional(),
  q20: z.number().int().min(0).max(4).optional(),
  email: z.string().email().optional().or(z.literal("")),
  sendResultsByEmail: z.boolean().optional(),
  newsletterConsent: z.boolean().optional(),
  lang: z.enum(["de", "en"]).optional().default("de"),
});

export async function POST(request: Request) {
  try {
    const body = await readSubmission(request);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = evaluateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      answers,
      email,
      sendResultsByEmail,
      newsletterConsent,
      lang = "de",
      ...flatQuestions
    } = parsed.data;

    // Collect raw answers
    let rawAnswers: Record<string, number> | number[] = answers || {};
    if (!answers) {
      rawAnswers = flatQuestions as Record<string, number>;
    }

    const values = Array.isArray(rawAnswers) ? rawAnswers : Array.from({ length: 20 }, (_, index) => (rawAnswers as Record<string, number>)[`q${String(index + 1).padStart(2, "0")}`]);
    if (values.length !== 20 || values.some(value => !Number.isInteger(value) || Number(value) < 0 || Number(value) > 4)) {
      throw new SubmissionError(400, "Please answer all 20 questions.");
    }
    if ((sendResultsByEmail || newsletterConsent) && !email) {
      throw new SubmissionError(400, "Email is required for the requested email service.");
    }

    // Evaluate purely on the server using non-diagnostic wellness rules
    const result = evaluateRegenerationCheck(rawAnswers, lang);

    let newsletter: NewsletterOutcome = { status: "not_requested" };
    let resultEmail: "not_requested" | "accepted" | "failed" = "not_requested";
    let allowed = true;
    if (email && (sendResultsByEmail || newsletterConsent)) {
      try { await protectSubmission(request, email.trim().toLowerCase()); }
      catch { allowed = false; }
    }
    if (newsletterConsent === true && email) {
      newsletter = allowed ? await requestNewsletter({ email, consent: true }, "regeneration-check") : { status: "failed" };
    }
    if (sendResultsByEmail && email && !allowed) resultEmail = "failed";
    // Send results only when separately requested, and to the participant.
    if (email && sendResultsByEmail === true && allowed) {
      const emailSubject =
        lang === "de"
          ? `Dein persönlicher SomnoBalance® Regenerationscheck: ${result.title}`
          : `Your SomnoBalance® Regeneration Check: ${result.title}`;

      const emailBody = [
        lang === "de" ? "Hallo," : "Hello,",
        "",
        lang === "de"
          ? `hier ist deine Auswertung für deinen SomnoBalance® Regenerationscheck:`
          : `here is the evaluation for your SomnoBalance® Regeneration Check:`,
        "",
        `✦ ${result.title}`,
        `"${result.headline}"`,
        "",
        result.narrative,
        "",
        result.ritualName
          ? `${lang === "de" ? "Empfohlenes Ritual" : "Recommended Ritual"}: ${result.ritualName}`
          : "",
        result.ritualSteps && result.ritualSteps.length > 0
          ? `${lang === "de" ? "Ritual-Schritte" : "Ritual Steps"}:\n` +
            result.ritualSteps.map((s, idx) => `  ${idx + 1}. ${s}`).join("\n")
          : "",
        "",
        `"${result.essence}"`,
        "",
        `${lang === "de" ? "Empfohlenes Produkt" : "Recommended Product"}: ${result.primaryProduct.name} - ${result.primaryProduct.subtitle}`,
        result.addonProduct
          ? `${lang === "de" ? "Ergänzende Empfehlung" : "Complementary Product"}: ${result.addonProduct.name} - ${result.addonProduct.subtitle}`
          : "",
        "",
        result.showSecondary && result.secondarySnippet
          ? `${lang === "de" ? "Weiterer Impuls" : "Additional Focus"}: ${result.secondarySnippet.name}\n${result.secondarySnippet.description}`
          : "",
        "",
        "Herzliche Grüße,",
        "Dein SomnoBalance Team",
        "",
      ]
        .filter(Boolean)
        .join("\n");

      const delivery = await sendEmail(email, emailSubject, emailBody);
      resultEmail = delivery.status === "accepted" ? "accepted" : "failed";
    }

    // Return the evaluation independently of optional provider outcomes.
    return NextResponse.json({
      success: true,
      result,
      newsletter,
      resultEmail,
    });
  } catch (error) {
    return submissionError(error);
  }
}
