import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateRegenerationCheck } from "@/lib/regenerationCheck";
import { sendNotification } from "@/lib/mailer";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

const evaluateRequestSchema = z.object({
  answers: z.union([
    z.array(z.number().min(0).max(4)).length(20),
    z.record(z.string(), z.number().min(0).max(4)),
  ]).optional(),
  // Also accept flat q01..q20 in the root object
  q01: z.number().min(0).max(4).optional(),
  q02: z.number().min(0).max(4).optional(),
  q03: z.number().min(0).max(4).optional(),
  q04: z.number().min(0).max(4).optional(),
  q05: z.number().min(0).max(4).optional(),
  q06: z.number().min(0).max(4).optional(),
  q07: z.number().min(0).max(4).optional(),
  q08: z.number().min(0).max(4).optional(),
  q09: z.number().min(0).max(4).optional(),
  q10: z.number().min(0).max(4).optional(),
  q11: z.number().min(0).max(4).optional(),
  q12: z.number().min(0).max(4).optional(),
  q13: z.number().min(0).max(4).optional(),
  q14: z.number().min(0).max(4).optional(),
  q15: z.number().min(0).max(4).optional(),
  q16: z.number().min(0).max(4).optional(),
  q17: z.number().min(0).max(4).optional(),
  q18: z.number().min(0).max(4).optional(),
  q19: z.number().min(0).max(4).optional(),
  q20: z.number().min(0).max(4).optional(),
  email: z.string().email().optional().or(z.literal("")),
  sendResultsByEmail: z.boolean().optional(),
  newsletterConsent: z.boolean().optional(),
  lang: z.enum(["de", "en"]).optional().default("de"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
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

    // Evaluate purely on the server using non-diagnostic wellness rules
    const result = evaluateRegenerationCheck(rawAnswers, lang);

    // Optional email dispatch (decoupled consent per Section 12)
    if (email && (sendResultsByEmail || newsletterConsent)) {
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
        newsletterConsent
          ? `[Newsletter: Angemeldet / Subscribed]`
          : `[Newsletter: Nicht angemeldet / Not subscribed]`,
      ]
        .filter(Boolean)
        .join("\n");

      await sendNotification(emailSubject, `${email}\n\n${emailBody}`);
    }

    // Return the non-diagnostic, privacy-compliant response without numerical scores
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("[regeneration-check/evaluate] error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during evaluation." },
      { status: 500 }
    );
  }
}
