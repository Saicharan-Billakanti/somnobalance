import { serverConfig } from "@/lib/serverConfig";
import { emailSchema } from "@/lib/submission";

export type MailResult =
  | { status: "accepted"; id: string }
  | { status: "failed"; reason: "configuration" | "provider" | "network" };

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function notificationConfigured(): boolean {
  return Boolean(serverConfig("RESEND_API_KEY") && validSender() && emailSchema.safeParse(serverConfig("MAIL_TO")).success);
}

function validSender(): string | undefined {
  const from = serverConfig("MAIL_FROM");
  if (!from || /[\r\n]/.test(from)) return undefined;
  const address = from.match(/<([^<>]+)>$/)?.[1] || from;
  return emailSchema.safeParse(address).success ? from : undefined;
}

export async function sendEmail(to: string, subject: string, text: string, replyTo?: string, html?: string): Promise<MailResult> {
  const key = serverConfig("RESEND_API_KEY");
  const from = validSender();
  if (!key || !from || !emailSchema.safeParse(to).success || (replyTo && !emailSchema.safeParse(replyTo).success)) {
    return { status: "failed", reason: "configuration" };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ from, to: [to], subject: subject.replace(/[\r\n]/g, " "), text,
        html: html ?? `<pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(text)}</pre>`,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!response.ok) {
      console.warn("[mailer] provider rejected request", response.status);
      return { status: "failed", reason: "provider" };
    }
    const body = await response.json() as { id?: unknown };
    if (typeof body.id !== "string" || !body.id) return { status: "failed", reason: "provider" };
    // Acceptance is not proof of inbox delivery.
    return { status: "accepted", id: body.id };
  } catch {
    console.warn("[mailer] provider request failed or timed out");
    return { status: "failed", reason: "network" };
  }
}

export async function sendNotification(subject: string, text: string, replyTo?: string): Promise<MailResult> {
  const to = serverConfig("MAIL_TO");
  if (!to) return { status: "failed", reason: "configuration" };
  return sendEmail(to, subject, text, replyTo);
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  lang: "de" | "en" = "de"
): Promise<{ success: boolean; error?: string }> {
  if (!/^\d{6}$/.test(otp)) return { success: false, error: "Invalid verification code" };
  const subject =
    lang === "de"
      ? `${otp} ist Ihr SomnoBalance Bestätigungscode`
      : `${otp} is your SomnoBalance verification code`;

  const text =
    lang === "de"
      ? `Hallo,\n\nIhr 6-stelliger Bestätigungscode für SomnoBalance lautet:\n\n  ${otp}\n\nDieser Code ist 10 Minuten lang gültig. Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.\n\nHerzliche Grüße,\nIhr SomnoBalance Team`
      : `Hello,\n\nYour 6-digit verification code for SomnoBalance is:\n\n  ${otp}\n\nThis code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.\n\nWarm regards,\nYour SomnoBalance Team`;

  const html =
    lang === "de"
      ? `<div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1e1b18; line-height: 1.6;">
          <h2 style="font-family: Georgia, serif; font-weight: normal; font-size: 24px; color: #1e1b18; margin-bottom: 24px;">E-Mail-Adresse bestätigen</h2>
          <p style="font-size: 15px; color: #4a453e;">Vielen Dank für Ihre Registrierung bei SomnoBalance. Bitte geben Sie den folgenden Bestätigungscode ein, um Ihr Konto zu aktivieren:</p>
          <div style="margin: 28px 0; text-align: center;">
            <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 14px 28px; background: #f7f5f0; border: 1px solid #e5e0d5; border-radius: 12px; color: #2d4a43;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #7a7368;">Dieser Code ist <strong>10 Minuten</strong> lang gültig.</p>
          <hr style="border: none; border-top: 1px solid #eae5db; margin: 32px 0 20px;" />
          <p style="font-size: 12px; color: #9c9488;">SomnoBalance · Regeneration · Ruhe · Balance</p>
        </div>`
      : `<div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1e1b18; line-height: 1.6;">
          <h2 style="font-family: Georgia, serif; font-weight: normal; font-size: 24px; color: #1e1b18; margin-bottom: 24px;">Verify your email address</h2>
          <p style="font-size: 15px; color: #4a453e;">Thank you for registering with SomnoBalance. Please enter the verification code below to activate your account:</p>
          <div style="margin: 28px 0; text-align: center;">
            <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 14px 28px; background: #f7f5f0; border: 1px solid #e5e0d5; border-radius: 12px; color: #2d4a43;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #7a7368;">This code is valid for <strong>10 minutes</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eae5db; margin: 32px 0 20px;" />
          <p style="font-size: 12px; color: #9c9488;">SomnoBalance · Regeneration · Rest · Balance</p>
        </div>`;

  const result = await sendEmail(to, subject, text, undefined, html);
  return result.status === "accepted"
    ? { success: true }
    : { success: false, error: "Email delivery request failed" };
}

export async function sendPasswordResetEmail(to: string, otp: string, lang: "de" | "en" = "de") {
  if (!/^\d{6}$/.test(otp)) return { success: false, error: "Invalid reset code" };
  const subject = lang === "de" ? "Ihr SomnoBalance Passwort-Reset-Code" : "Your SomnoBalance password reset code";
  const text = lang === "de"
    ? `Sie haben eine Passwortzurücksetzung angefordert. Ihr Code lautet ${otp} und ist 10 Minuten gültig. Wenn Sie das nicht angefordert haben, ignorieren Sie diese E-Mail.`
    : `You requested a password reset. Your code is ${otp} and is valid for 10 minutes. If you did not request this, you can ignore this email.`;
  const result = await sendEmail(to, subject, text);
  return result.status === "accepted" ? { success: true } : { success: false, error: "Could not deliver password reset code." };
}
