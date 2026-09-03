import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;

const configured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && MAIL_FROM && MAIL_TO);

const transporter = configured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

// Sends a notification email if SMTP_* env vars are configured; otherwise
// logs to the server console so nothing breaks in environments (like the
// live demo deployment) that don't have mail credentials set.
export async function sendNotification(subject: string, text: string) {
  if (!transporter) {
    console.log(`[mailer] SMTP not configured — would have sent: ${subject}\n${text}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject,
      text,
    });
  } catch (err) {
    console.error("[mailer] failed to send notification:", err);
  }
}
