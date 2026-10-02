"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function LoginClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendingSms, setResendingSms] = useState(false);

  // OTP Verification state if account is pending verification
  const [verificationPending, setVerificationPending] = useState<{
    userId: string;
    email: string;
    phone: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  } | null>(null);

  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  if (verificationPending) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.auth.account}</p>
        <h1 className="mt-3 font-serif text-3xl text-ink">{dict.auth.otpTitle}</h1>
        <p className="mt-3 text-ink/70">{dict.auth.otpSubtitle}</p>

        {notice && <p className="mt-4 text-sm text-teal-dark font-medium">{notice}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setNotice(null);
            setSubmitting(true);

            try {
              const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: verificationPending.userId,
                  emailCode: verificationPending.emailVerified ? undefined : emailCode,
                  phoneCode: verificationPending.phoneVerified ? undefined : phoneCode,
                }),
              });

              const data = await res.json();
              if (!res.ok) {
                setError(data.error || "Ungültiger Bestätigungscode.");
                if (data.emailVerified !== undefined || data.phoneVerified !== undefined) {
                  setVerificationPending((prev) =>
                    prev
                      ? {
                          ...prev,
                          emailVerified: Boolean(data.emailVerified),
                          phoneVerified: Boolean(data.phoneVerified),
                        }
                      : null
                  );
                }
                return;
              }

              if (data.fullyVerified && data.user) {
                setUser(data.user);
                router.push(`/${lang}`);
                router.refresh();
              } else {
                setVerificationPending((prev) =>
                  prev
                    ? {
                        ...prev,
                        emailVerified: Boolean(data.emailVerified),
                        phoneVerified: Boolean(data.phoneVerified),
                      }
                    : null
                );
                setNotice("Teilweise verifiziert. Bitte geben Sie den verbleibenden Code ein.");
              }
            } catch {
              setError(dict.auth.networkError);
            } finally {
              setSubmitting(false);
            }
          }}
          className="mt-8 space-y-5"
        >
          {/* Email OTP Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-ink/70">
                {dict.auth.emailOtpLabel} ({verificationPending.email})
              </label>
              {verificationPending.emailVerified && (
                <span className="text-xs text-teal-dark font-medium">{dict.auth.emailVerified}</span>
              )}
            </div>
            <input
              required={!verificationPending.emailVerified}
              disabled={verificationPending.emailVerified}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationPending.emailVerified ? "✓" : emailCode}
              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="input-field tracking-widest text-center text-lg font-mono disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-ink/50">{dict.auth.emailOtpDesc}</p>
          </div>

          {/* SMS OTP Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-ink/70">
                {dict.auth.mobileOtpLabel} ({verificationPending.phone})
              </label>
              {verificationPending.phoneVerified && (
                <span className="text-xs text-teal-dark font-medium">{dict.auth.mobileVerified}</span>
              )}
            </div>
            <input
              required={!verificationPending.phoneVerified}
              disabled={verificationPending.phoneVerified}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationPending.phoneVerified ? "✓" : phoneCode}
              onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="input-field tracking-widest text-center text-lg font-mono disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-ink/50">{dict.auth.mobileOtpDesc}</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-mauve py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
          >
            {submitting ? dict.auth.verifying : dict.auth.verifyButton}
          </button>
        </form>

        {/* Resend actions */}
        <div className="mt-6 flex flex-col gap-2 text-center text-sm">
          {!verificationPending.emailVerified && (
            <button
              type="button"
              disabled={resendingEmail}
              onClick={async () => {
                setResendingEmail(true);
                setError(null);
                try {
                  const res = await fetch("/api/auth/otp/resend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: verificationPending.userId,
                      channel: "EMAIL",
                      lang,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setError(data.error || "Fehler beim Senden.");
                  } else {
                    setNotice(dict.auth.codeSent);
                  }
                } catch {
                  setError(dict.auth.networkError);
                } finally {
                  setResendingEmail(false);
                }
              }}
              className="text-mauve-dark hover:underline disabled:opacity-50 text-xs"
            >
              {resendingEmail ? "Wird gesendet…" : dict.auth.resendEmail}
            </button>
          )}

          {!verificationPending.phoneVerified && (
            <button
              type="button"
              disabled={resendingSms}
              onClick={async () => {
                setResendingSms(true);
                setError(null);
                try {
                  const res = await fetch("/api/auth/otp/resend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: verificationPending.userId,
                      channel: "SMS",
                      lang,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setError(data.error || "Fehler beim Senden.");
                  } else {
                    setNotice(dict.auth.codeSent);
                  }
                } catch {
                  setError(dict.auth.networkError);
                } finally {
                  setResendingSms(false);
                }
              }}
              className="text-mauve-dark hover:underline disabled:opacity-50 text-xs"
            >
              {resendingSms ? "Wird gesendet…" : dict.auth.resendMobile}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.auth.account}</p>
      <h1 className="mt-3 font-serif text-3xl text-ink">{dict.auth.loginTitle}</h1>
      <p className="mt-3 text-ink/70">{dict.auth.loginWelcome}</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setNotice(null);
          setSubmitting(true);

          const formData = new FormData(e.currentTarget);
          const payload = {
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
          };

          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || dict.auth.loginError);
              return;
            }

            if (data.requiresVerification) {
              setVerificationPending({
                userId: data.userId,
                email: data.email,
                phone: data.phone,
                emailVerified: data.emailVerified,
                phoneVerified: data.phoneVerified,
              });
            } else if (data.user) {
              setUser(data.user);
              router.push(`/${lang}`);
              router.refresh();
            }
          } catch {
            setError(dict.auth.networkError);
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-10 space-y-4"
      >
        <input required type="email" name="email" placeholder={dict.auth.email} className="input-field" />
        <input
          required
          type="password"
          name="password"
          placeholder={dict.auth.password}
          className="input-field"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-mauve py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
        >
          {submitting ? dict.auth.loggingIn : dict.auth.loginButton}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        {dict.auth.newHere}{" "}
        <Link href={`/${lang}/register`} className="text-mauve-dark underline">
          {dict.auth.createAccount}
        </Link>
      </p>
    </div>
  );
}
