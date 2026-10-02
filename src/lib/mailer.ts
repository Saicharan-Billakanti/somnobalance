// src/lib/mailer.ts
//
// HTTP-based email via Resend (https://resend.com) or Cloudflare Email.
// Replaces nodemailer, which depends on Node.js net/tls sockets unavailable
// on Cloudflare Workers.
//
// Required environment variable (set as a Cloudflare Worker secret):
//   RESEND_API_KEY  — from https://resend.com/api-keys
//   MAIL_FROM       — verified sender address, e.g. "SomnoBalance <noreply@somnobalance.com>"
//   MAIL_TO         — notification recipient, e.g. "faw@willing1863.com"

const RESEND_API = "https://api.resend.com/emails";

function mailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

export async function sendNotification(subject: string, text: string): Promise<void> {
  const mailTo = process.env.MAIL_TO;
  if (!mailerConfigured() || !mailTo) {
    console.log(`[mailer] not configured — would have sent notification: ${subject}\n${text}`);
    return;
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [mailTo],
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      console.error(`[mailer] Resend API error ${res.status}: ${body}`);
    }
  } catch (err) {
    console.error("[mailer] failed to send notification:", err);
  }
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  lang: "de" | "en" = "de"
): Promise<{ success: boolean; error?: string }> {
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

  if (!mailerConfigured()) {
    console.log(`[mailer] Demo mode — Email OTP for ${to}: [${otp}]`);
    return { success: true };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "(unreadable)");
      console.error(`[mailer] Resend OTP error ${res.status}: ${errBody}`);
      return { success: false, error: "Email delivery failed" };
    }

    return { success: true };
  } catch (err) {
    console.error("[mailer] Resend OTP exception:", err);
    return { success: false, error: "Email network error" };
  }
}
