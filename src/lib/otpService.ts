import crypto from "crypto";
import { validateAndNormalizePhone } from "./phoneUtils";

const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown

// Minimal in-memory cooldown cache for repeated send attempts only.
const otpSendCooldownStore = new Map<string, number>();

// Secret for signing verification tokens.
function getSigningSecret(): string | undefined {
  return process.env.SESSION_SECRET ?? process.env.JWT_SECRET;
}

function getStoreKey(phone: string, purpose: string): string {
  return `${phone}:${purpose}`;
}

/**
 * SMS is unavailable until a dedicated SMS provider is configured.
 */
async function dispatchSms(to: string): Promise<{ success: boolean; provider: string; error?: string }> {
  return { success: false, provider: "none", error: "SMS provider is not configured." };
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
  const secret = getSigningSecret();
  if (!secret) return { success: false, error: "OTP signing secret is not configured." };

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

  return { success: false, error: "SMS verification is unavailable." };
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

    if (!Number.isFinite(payload.expiresAt) || now > payload.expiresAt) {
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
