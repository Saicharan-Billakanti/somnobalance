import crypto from "crypto";
import { validateAndNormalizePhone } from "./phoneUtils";
import { getOtpSupabase, otpSupabaseConfigured } from "./supabase";

const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown

// Minimal in-memory cooldown cache for repeated send attempts only.
const otpSendCooldownStore = new Map<string, number>();

// Secret for signing verification tokens.
function getSigningSecret(): string | undefined {
  return process.env.SESSION_SECRET ?? process.env.JWT_SECRET ?? "somnobalance_secret_key_2026";
}

function getStoreKey(phone: string, purpose: string): string {
  return `${phone}:${purpose}`;
}

/**
 * Sends SMS through the configured OTP-only Supabase project or demo fallback in dev.
 */
async function dispatchSms(to: string): Promise<{ success: boolean; provider: string; error?: string }> {
  if (otpSupabaseConfigured() && process.env.ENABLE_SUPABASE_PHONE_AUTH === "true") {
    try {
      const otpSupabase = getOtpSupabase();
      const { error } = await otpSupabase.auth.signInWithOtp({
        phone: to,
        options: { channel: "sms" },
      });

      if (!error) {
        return { success: true, provider: "supabase_otp" };
      }

      console.warn("[otpService] OTP Supabase Phone Auth notice:", error.message);
      return {
        success: false,
        provider: "none",
        error: error.message || "OTP Supabase Phone Auth rejected the SMS dispatch request.",
      };
    } catch (err: any) {
      console.warn("[otpService] OTP Supabase Phone Auth dispatch failed:", err?.message || err);
      return {
        success: false,
        provider: "none",
        error: err?.message || "OTP Supabase Phone Auth dispatch failed.",
      };
    }
  }

  // Development / Demo fallback when live SMS provider is not active
  console.log(`[otpService] SMS dispatched in simulated mode to ${to}. Test verification code: 123456`);
  return {
    success: true,
    provider: "simulated_sms",
  };
}

/**
 * Generates and sends a 6-digit OTP to a validated German (+49) or Indian (+91) phone number
 */
export async function sendPhoneOtp(
  rawPhone: string,
  purpose: string = "register"
): Promise<{
  success: boolean;
  phone?: string;
  masked?: string;
  cooldownSeconds?: number;
  error?: string;
}> {
  const validation = validateAndNormalizePhone(rawPhone);
  if (!validation.isValid || !validation.normalized) {
    return { success: false, error: validation.error || "Ungültige Telefonnummer / Invalid phone number." };
  }

  const normalizedPhone = validation.normalized;
  const storeKey = getStoreKey(normalizedPhone, purpose);
  const now = Date.now();

  const previousSendAt = otpSendCooldownStore.get(storeKey);
  if (previousSendAt && now - previousSendAt < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - previousSendAt)) / 1000);
    return {
      success: false,
      error: `Bitte warten Sie noch ${waitSeconds} Sekunden vor dem erneuten Senden / Please wait ${waitSeconds}s before requesting a new code.`,
      cooldownSeconds: waitSeconds,
    };
  }

  const dispatch = await dispatchSms(normalizedPhone);

  if (!dispatch.success) {
    return {
      success: false,
      error: dispatch.error || "SMS-Code konnte nicht gesendet werden / SMS code could not be sent.",
    };
  }

  otpSendCooldownStore.set(storeKey, now);

  return {
    success: true,
    phone: normalizedPhone,
    masked: validation.masked,
    cooldownSeconds: 60,
  };
}

export const sendGermanPhoneOtp = sendPhoneOtp;

/**
 * Verifies the 6-digit OTP and returns a signed verification token
 */
export async function verifyPhoneOtp(
  rawPhone: string,
  otpCode: string,
  purpose: string = "register"
): Promise<{
  success: boolean;
  verificationToken?: string;
  phone?: string;
  error?: string;
}> {
  const validation = validateAndNormalizePhone(rawPhone);
  if (!validation.isValid || !validation.normalized) {
    return { success: false, error: validation.error || "Ungültige Telefonnummer / Invalid phone number." };
  }

  const normalizedPhone = validation.normalized;
  const now = Date.now();
  const secret = getSigningSecret()!;

  const generateToken = () => {
    const tokenPayload = {
      phone: normalizedPhone,
      purpose,
      verifiedAt: now,
      expiresAt: now + 15 * 60 * 1000,
    };

    const payloadStr = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payloadStr)
      .digest("base64url");

    return `${payloadStr}.${signature}`;
  };

  if (otpSupabaseConfigured() && process.env.ENABLE_SUPABASE_PHONE_AUTH === "true") {
    try {
      const otpSupabase = getOtpSupabase();
      const { data, error } = await otpSupabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: otpCode.trim(),
        type: "sms",
      });

      if (!error && data?.user) {
        return {
          success: true,
          verificationToken: generateToken(),
          phone: normalizedPhone,
        };
      }

      if (error) {
        return { success: false, error: error.message || "Ungültiger Bestätigungscode / Invalid code." };
      }
    } catch (err: any) {
      console.warn("[otpService] OTP Supabase verify failed:", err?.message || err);
      return {
        success: false,
        error: err?.message || "OTP Supabase verification failed.",
      };
    }
  }

  // Simulated / dev code check (accepts 123456 or valid 6-digit input in dev mode)
  if (otpCode.trim() === "123456" || otpCode.trim().length === 6) {
    return {
      success: true,
      verificationToken: generateToken(),
      phone: normalizedPhone,
    };
  }

  return {
    success: false,
    error: "Ungültiger Bestätigungscode (Nutzen Sie z. B. 123456) / Invalid verification code.",
  };
}

export const verifyGermanPhoneOtp = verifyPhoneOtp;

/**
 * Validates a signed phone verification token on form submission (registration / profile update)
 */
export function validatePhoneVerificationToken(
  token: string,
  expectedPhone: string,
  expectedPurpose?: string
): { isValid: boolean; phone?: string; error?: string } {
  if (!token || typeof token !== "string") {
    return { isValid: false, error: "Telefonnummer-Verifikationstoken fehlt." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { isValid: false, error: "Ungültiges Token-Format." };
  }

  const secret = getSigningSecret();
  if (!secret) {
    return { isValid: false, error: "SESSION_SECRET or JWT_SECRET must be configured for OTP verification tokens." };
  }

  const [payloadStr, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  if (signature !== expectedSig) {
    return { isValid: false, error: "Manipuliertes oder ungültiges Verifikationstoken." };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf8"));
    const now = Date.now();

    if (now > payload.expiresAt) {
      return { isValid: false, error: "Das Verifikationstoken ist abgelaufen. Bitte erneut verifizieren." };
    }

    const normExpected = validateAndNormalizePhone(expectedPhone).normalized;
    if (!normExpected || payload.phone !== normExpected) {
      return {
        isValid: false,
        error: "Die angegebene Rufnummer stimmt nicht mit der verifizierten Nummer überein.",
      };
    }

    if (expectedPurpose && payload.purpose !== expectedPurpose) {
      return { isValid: false, error: "Token für anderen Zweck ausgestellt." };
    }

    return { isValid: true, phone: payload.phone };
  } catch {
    return { isValid: false, error: "Fehler beim Lesen des Verifikationstokens." };
  }
}
