/**
 * Phone Number Utilities
 * Handles normalization, validation, and masking for German (+49) and Indian (+91) phone numbers.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string; // E.164 format, e.g. "+491701234567" or "+919876543210"
  country?: "DE" | "IN";
  isMobile?: boolean;
  formatted?: string; // Human-friendly format, e.g. "+49 170 1234567" or "+91 98765 43210"
  masked?: string; // e.g. "+49 170 •••• 4567" or "+91 98••• ••210"
  error?: string;
}

export type GermanPhoneValidationResult = PhoneValidationResult;

/**
 * Normalizes and validates German (+49) and Indian (+91) phone numbers into E.164 format.
 * Handles inputs like:
 * - Germany: "0170 1234567", "+49 170 1234567", "0049 170 1234567", "015112345678"
 * - India: "+91 98765 43210", "9876543210", "09876543210", "0091 9876543210", "919876543210"
 */
export function validateAndNormalizePhone(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return { isValid: false, error: "Telefonnummer ist erforderlich / Phone number is required." };
  }

  // Remove spaces, hyphens, slashes, brackets, and periods
  let cleaned = rawPhone.trim().replace(/[\s\-\/\(\)\.]/g, "");

  // Convert leading 00 to +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  let normalized = "";
  let country: "DE" | "IN" = "DE";

  // Check for Indian number patterns
  if (cleaned.startsWith("+91")) {
    if (cleaned.startsWith("+910")) {
      cleaned = "+91" + cleaned.slice(4);
    }
    normalized = cleaned;
    country = "IN";
  } else if (cleaned.startsWith("91") && cleaned.length === 12 && /^[6-9]/.test(cleaned.slice(2))) {
    normalized = "+" + cleaned;
    country = "IN";
  } else if (/^[6-9]\d{9}$/.test(cleaned)) {
    // 10-digit standard Indian mobile number starting with 6, 7, 8, or 9
    normalized = "+91" + cleaned;
    country = "IN";
  } else if (/^0[6-9]\d{9}$/.test(cleaned)) {
    // 11-digit Indian mobile number with leading 0 e.g. 09876543210
    normalized = "+91" + cleaned.slice(1);
    country = "IN";
  }
  // Check for German number patterns
  else if (cleaned.startsWith("+49")) {
    if (cleaned.startsWith("+490")) {
      cleaned = "+49" + cleaned.slice(4);
    }
    normalized = cleaned;
    country = "DE";
  } else if (cleaned.startsWith("0")) {
    // German national format e.g. 01701234567 -> +491701234567
    normalized = "+49" + cleaned.slice(1);
    country = "DE";
  } else if (cleaned.startsWith("49") && cleaned.length >= 9 && cleaned.length <= 15) {
    normalized = "+" + cleaned;
    country = "DE";
  } else if (/^[1-9]\d{7,13}$/.test(cleaned)) {
    normalized = "+49" + cleaned;
    country = "DE";
  } else {
    return {
      isValid: false,
      error: "Bitte geben Sie eine gültige Telefonnummer ein (Deutschland +49 oder Indien +91) / Please enter a valid German (+49) or Indian (+91) phone number.",
    };
  }

  // Validate according to country
  if (country === "IN") {
    const indianRegex = /^\+91([6-9]\d{9})$/;
    const match = normalized.match(indianRegex);
    if (!match) {
      return {
        isValid: false,
        error: "Ungültige indische Mobilfunknummer (10 Ziffern beginnend mit 6, 7, 8 oder 9) / Invalid Indian mobile number (10 digits starting with 6-9).",
      };
    }

    const nationalNumber = match[1];
    const formatted = `+91 ${nationalNumber.slice(0, 5)} ${nationalNumber.slice(5)}`;
    const masked = `+91 ${nationalNumber.slice(0, 2)}•••• ••${nationalNumber.slice(-3)}`;

    return {
      isValid: true,
      normalized,
      country: "IN",
      isMobile: true,
      formatted,
      masked,
    };
  } else {
    // German format: +49 followed by 7 to 13 digits
    const germanRegex = /^\+49([1-9]\d{6,12})$/;
    const match = normalized.match(germanRegex);
    if (!match) {
      return {
        isValid: false,
        error: "Ungültige deutsche Rufnummernlänge oder ungültiges Format / Invalid German phone number format.",
      };
    }

    const nationalNumber = match[1];
    const isMobile = /^(15\d|16\d|17\d)/.test(nationalNumber);

    let formatted = "";
    if (isMobile) {
      formatted = `+49 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3)}`;
    } else {
      formatted = `+49 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3)}`;
    }

    let masked = "";
    if (nationalNumber.length > 6) {
      const start = nationalNumber.slice(0, 3);
      const end = nationalNumber.slice(-4);
      masked = `+49 ${start} •••• ${end}`;
    } else {
      masked = `+49 ••••• ${nationalNumber.slice(-2)}`;
    }

    return {
      isValid: true,
      normalized,
      country: "DE",
      isMobile,
      formatted,
      masked,
    };
  }
}

/**
 * Backward compatibility alias for validateAndNormalizePhone
 */
export function validateAndNormalizeGermanPhone(rawPhone: string): PhoneValidationResult {
  return validateAndNormalizePhone(rawPhone);
}

