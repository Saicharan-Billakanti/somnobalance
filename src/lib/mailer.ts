// src/lib/mailer.ts
//
// HTTP-based email via Resend (https://resend.com).
// Replaces nodemailer, which depends on Node.js net/tls sockets unavailable
// on Cloudflare Workers even with nodejs_compat.
//
// Required environment variable (set as a Cloudflare Worker secret):
//   RESEND_API_KEY  — from https://resend.com/api-keys
//   MAIL_FROM       — verified sender address, e.g. "SomnoBalance <noreply@yourdomain.com>"
//   MAIL_TO         — notification recipient, e.g. "faw@willing1863.com"
//
// If RESEND_API_KEY is not set, the function logs to console and returns
// without throwing — same graceful-degradation behaviour as the old nodemailer
// implementation.

const RESEND_API = "https://api.resend.com/emails";

function mailerConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.MAIL_FROM &&
    process.env.MAIL_TO
  );
}

export async function sendNotification(subject: string, text: string): Promise<void> {
  if (!mailerConfigured()) {
    console.log(`[mailer] not configured — would have sent: ${subject}\n${text}`);
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
        to: [process.env.MAIL_TO],
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
