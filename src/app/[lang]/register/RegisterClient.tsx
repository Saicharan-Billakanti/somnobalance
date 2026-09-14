"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function RegisterClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { setUser } = useAuth();

  // Registration Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [adminCode, setAdminCode] = useState("");

  // Step State: 1 = Form Input, 2 = SMS OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Error & Status Messages
  const [error, setError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Step 1: Send SMS OTP to German (+49) or Indian (+91) Number
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOtpSuccess(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setError(dict.auth.validPhoneRequired || "Please enter a valid German (+49) or Indian (+91) phone number.");
      return;
    }

    if (password.length < 8) {
      setError(dict.auth.passwordMinLength || "The password must be at least 8 characters long.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, purpose: "register" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "SMS code could not be sent.");
        if (data.cooldownSeconds) setCooldown(data.cooldownSeconds);
        setSendingOtp(false);
        return;
      }

      setMaskedPhone(data.masked || cleanPhone);
      setCooldown(data.cooldownSeconds || 60);
      setOtpSuccess(
        dict.auth.otpSentNotice?.replace("{phone}", data.masked || cleanPhone) ||
          `6-digit verification code sent to ${data.masked || cleanPhone}.`
      );
      setStep(2); // Transition directly to OTP verification step
    } catch {
      setError(dict.auth.networkError || "Could not reach the server. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and Immediately Finalize Account Creation
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = otpCode.trim();
    if (cleanCode.length < 6) {
      setError(dict.auth.fullCodeRequired || "Please enter the complete 6-digit SMS code.");
      return;
    }

    setVerifyingOtp(true);

    try {
      // 1. Verify SMS OTP Code
      const verifyRes = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: cleanCode,
          purpose: "register",
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verificationToken) {
        setError(verifyData.error || "Invalid verification code. Please try again.");
        setVerifyingOtp(false);
        return;
      }

      // 2. Submit Verified Registration with optional adminCode
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          phoneVerificationToken: verifyData.verificationToken,
          adminCode: adminCode.trim() || undefined,
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        setError(regData.error || dict.auth.registerError);
        setVerifyingOtp(false);
        return;
      }

      // 3. Log user in and navigate
      setUser(regData.user);
      if (regData.user?.isAdmin || regData.user?.role === "admin") {
        router.push(redirect || `/${lang}/admin`);
      } else {
        router.push(redirect || `/${lang}/shop`);
      }
      router.refresh();
    } catch {
      setError(dict.auth.networkError);
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark font-semibold">
        {dict.auth.account}
      </p>
      <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
        {step === 1 ? dict.auth.registerTitle : (dict.auth.verificationTitle || "SMS Verification")}
      </h1>
      <p className="mt-3 text-sm text-ink/70">
        {step === 1
          ? dict.auth.registerWelcome
          : (dict.auth.enterCodePrompt?.replace("{phone}", maskedPhone) ||
             `Enter the 6-digit verification code sent via SMS to ${maskedPhone}:`)}
      </p>

      {/* STEP 1: REGISTRATION FORM */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ink/70">{dict.auth.firstName} *</label>
              <input
                required
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={dict.auth.firstName}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/70">{dict.auth.lastName} *</label>
              <input
                required
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={dict.auth.lastName}
                className="input-field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/70">{dict.auth.email} *</label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.auth.email}
              className="input-field mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <span>📱</span> {dict.auth.phone || "Mobile Number"} *
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    if (!phone.startsWith("+49")) {
                      const cleanNum = phone.replace(/^\+91|\+49/, "").trim();
                      setPhone(cleanNum ? `+49 ${cleanNum}` : "+49 ");
                    }
                  }}
                  className={`px-2 py-0.5 rounded-full border transition-all ${
                    phone.startsWith("+49") || (!phone.startsWith("+91") && !phone.startsWith("91"))
                      ? "bg-teal/10 border-teal text-teal-dark font-bold shadow-2xs"
                      : "bg-surface-alt border-sand-light text-ink/60 hover:text-ink"
                  }`}
                >
                  🇩🇪 Germany (+49)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!phone.startsWith("+91")) {
                      const cleanNum = phone.replace(/^\+49|\+91/, "").trim();
                      setPhone(cleanNum ? `+91 ${cleanNum}` : "+91 ");
                    }
                  }}
                  className={`px-2 py-0.5 rounded-full border transition-all ${
                    phone.startsWith("+91") || phone.startsWith("91")
                      ? "bg-teal/10 border-teal text-teal-dark font-bold shadow-2xs"
                      : "bg-surface-alt border-sand-light text-ink/60 hover:text-ink"
                  }`}
                >
                  🇮🇳 India (+91)
                </button>
              </div>
            </div>
            <input
              required
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={
                phone.startsWith("+91")
                  ? "+91 98765 43210"
                  : phone.startsWith("+49")
                  ? "+49 170 1234567"
                  : "+49 170 1234567 or +91 98765 43210"
              }
              className="input-field"
            />
            <p className="text-[11px] text-ink/60 mt-1 flex items-center justify-between">
              <span>{dict.auth.phoneNotice || "You will receive a 6-digit SMS verification code in the next step."}</span>
              <span className="font-mono text-[10px] text-teal-dark">🇩🇪 +49 / 🇮🇳 +91</span>
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/70">{dict.auth.passwordMin} *</label>
            <input
              required
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              placeholder={dict.auth.passwordMin}
              className="input-field mt-1"
            />
          </div>

          {/* Admin Registration Code (Optional) */}
          <div className="rounded-2xl border border-mauve/25 bg-mauve/5 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <span>🛡️</span> {dict.auth.adminCodeLabel || "Admin Registration Code (Optional)"}
              </label>
              <button
                type="button"
                onClick={() => setAdminCode("ADMIN_2K26")}
                className="text-[10px] uppercase font-bold tracking-wider text-mauve-dark bg-white hover:bg-mauve hover:text-white px-2.5 py-0.5 rounded-full border border-mauve/30 shadow-xs transition"
                title="Click to fill ADMIN_2K26"
              >
                + Fill ADMIN_2K26
              </button>
            </div>
            <input
              type="text"
              name="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value.toUpperCase())}
              placeholder={dict.auth.adminCodePlaceholder || "e.g. ADMIN_2K26"}
              className="input-field uppercase font-mono tracking-wider text-xs bg-white border-mauve/30 focus:border-mauve"
            />
            <p className="text-[11px] text-ink/70 leading-relaxed">
              {dict.auth.adminCodeNotice || "Enter an admin code like ADMIN_2K26 to create an account with Administrator privileges."}
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={sendingOtp}
            className="w-full rounded-full bg-mauve py-3.5 text-sm font-semibold text-white hover:bg-mauve-dark disabled:opacity-60 transition shadow-sm mt-4"
          >
            {sendingOtp
              ? (dict.auth.sendingOtp || "Sending SMS code…")
              : (dict.auth.requestOtpAndContinue || "Request SMS Code & Continue →")}
          </button>
        </form>
      )}

      {/* STEP 2: 6-DIGIT OTP VERIFICATION & INSTANT ACCOUNT CREATION */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtpAndRegister} className="mt-8 space-y-6 animate-fade-in">
          <div className="rounded-3xl border border-teal/25 bg-teal/5 p-6 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-white text-xl shadow-sm">
              💬
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-ink">
                {dict.auth.enter6DigitCode || "Enter 6-Digit Code"}
              </h3>
              <p className="text-xs text-ink/70 mt-1 font-mono">
                {dict.auth.sentTo || "Sent to"}: <strong className="text-ink">{maskedPhone}</strong>
              </p>
            </div>

            <div className="max-w-[240px] mx-auto">
              <input
                autoFocus
                required
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="input-field text-center font-mono text-2xl font-bold tracking-[0.35em] py-3 bg-white"
              />
            </div>

            {otpSuccess && (
              <p className="text-xs text-emerald-700 font-medium">
                {otpSuccess}
              </p>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium text-left">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-teal/15">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                  setError(null);
                }}
                className="text-ink/60 hover:text-ink underline"
              >
                {dict.auth.changePhone || "← Change phone number"}
              </button>

              <button
                type="button"
                disabled={sendingOtp || cooldown > 0}
                onClick={() => handleRequestOtp({ preventDefault: () => {} } as any)}
                className="text-teal-dark font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {cooldown > 0
                  ? (dict.auth.resendWait?.replace("{seconds}", String(cooldown)) || `Resend code (${cooldown}s)`)
                  : (dict.auth.resendOtp || "Resend Code")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={verifyingOtp || otpCode.trim().length < 6}
            className="w-full rounded-full bg-teal py-3.5 text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-60 transition shadow-sm"
          >
            {verifyingOtp
              ? (dict.auth.verifyingAndCreating || "Verifying & creating account…")
              : (dict.auth.verifyAndCreate || "Verify Code & Create Account ✓")}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink/60">
        {dict.auth.alreadyHaveAccount}{" "}
        <Link
          href={redirect ? `/${lang}/login?redirect=${encodeURIComponent(redirect)}` : `/${lang}/login`}
          className="text-mauve-dark underline font-medium"
        >
          {dict.auth.loginButton}
        </Link>
      </p>
    </div>
  );
}
