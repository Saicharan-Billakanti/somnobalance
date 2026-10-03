// src/lib/sms.ts
//
// SMS dispatch and phone number normalization for Cloudflare Workers.
// Specially tailored for German (+49) and international E.164 numbers.

/**
 * Normalizes user-input phone numbers to standard E.164 format.
 * Examples for Germany:
 *   "0151 12345678"     -> "+4915112345678"
 *   "0170/1234567"      -> "+491701234567"
 *   "+49 151 12345678"  -> "+4915112345678"
 *   "0049 151 12345678" -> "+4915112345678"
 *   "4915112345678"     -> "+4915112345678"
 *   "+1 (555) 012-3456" -> "+15550123456"
 */
export function normalizePhoneNumber(raw: string, defaultCountryCode = "49"): string | null {
  if (!raw || typeof raw !== "string") return null;

  // Remove spaces, parentheses, slashes, and dashes
  let cleaned = raw.trim().replace(/[\s\(\)\/\-\.]/g, "");

  // Replace leading 00 with +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  if (cleaned.startsWith("+")) {
    // Already in international format (+ followed by digits)
    const digitsOnly = cleaned.slice(1).replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;
    return "+" + digitsOnly;
  }

  // If starts with national prefix 0 (e.g. 0151... for Germany)
  if (cleaned.startsWith("0")) {
    const withoutZero = cleaned.slice(1).replace(/\D/g, "");
    if (withoutZero.length < 6 || withoutZero.length > 14) return null;
    return `+${defaultCountryCode}${withoutZero}`;
  }

  // If starts directly with country code digits (e.g. 49151...)
  if (cleaned.startsWith(defaultCountryCode)) {
    const digitsOnly = cleaned.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;
    return `+${digitsOnly}`;
  }

  // Generic fallback: prepend default country code
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length < 6 || digitsOnly.length > 14) return null;
  return `+${defaultCountryCode}${digitsOnly}`;
}

export function isValidPhoneNumber(phone: string): boolean {
  return normalizePhoneNumber(phone) !== null;
}

/**
 * Sends an SMS containing a 6-digit OTP code.
 * Uses configured HTTP SMS provider (e.g. Twilio, MessageBird, Brevo, or generic webhook).
 * If no SMS credentials are set, it logs gracefully to console in development.
 */
export async function sendOtpSms(
  to: string,
  otp: string,
  lang: "de" | "en" = "de"
): Promise<{ success: boolean; error?: string }> {
  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) {
    return { success: false, error: "Invalid phone number format" };
  }

  const message =
    lang === "de"
      ? `Ihr SomnoBalance Bestätigungscode lautet: ${otp}. Dieser Code ist 10 Minuten lang gültig.`
      : `Your SomnoBalance verification code is: ${otp}. This code is valid for 10 minutes.`;

  // 1. Twilio SMS Integration (if configured)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER || "SomnoBal";

  if (twilioSid && twilioToken) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const basicAuth = btoa(`${twilioSid}:${twilioToken}`);

      const body = new URLSearchParams();
      body.append("To", normalizedTo);
      body.append("From", twilioFrom);
      body.append("Body", message);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "(unknown)");
        console.error(`[sms/twilio] failed ${res.status}:`, errorText);
        return { success: false, error: "SMS delivery service error" };
      }

      return { success: true };
    } catch (err) {
      console.error("[sms/twilio] exception:", err);
      return { success: false, error: "SMS network error" };
    }
  }

  // 2. Generic SMS Gateway / Webhook (if SMS_GATEWAY_URL configured)
  const gatewayUrl = process.env.SMS_GATEWAY_URL;
  const apiKey = process.env.SMS_API_KEY;

  if (gatewayUrl) {
    try {
      const res = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          to: normalizedTo,
          message,
          otp,
          sender: "SomnoBalance",
        }),
      });

      if (!res.ok) {
        console.error(`[sms/gateway] failed ${res.status}`);
        return { success: false, error: "SMS gateway error" };
      }

      return { success: true };
    } catch (err) {
      console.error("[sms/gateway] exception:", err);
      return { success: false, error: "SMS gateway connection failed" };
    }
  }

  // Graceful development / demo logging
  console.log(`[sms] Demo mode — OTP for ${normalizedTo}: [${otp}] | Message: "${message}"`);
  return { success: true };
}
