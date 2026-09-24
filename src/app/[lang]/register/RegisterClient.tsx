"use client";
import { localizeError } from "@/lib/localizeError";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Locale } from "@/i18n/config";

type VerificationMode = "email" | "phone";

export function RegisterClient({ lang }: { lang: Locale; dict?: unknown }) {
  const router = useRouter();
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [verificationMode, setVerificationMode] = useState<VerificationMode>("email");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const sendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const supabase = await getSupabaseBrowser();
    const metadata = { firstName: form.firstName, lastName: form.lastName, email: form.email.trim().toLowerCase(), phone: form.phone };
    const { error } = verificationMode === "email"
      ? await supabase.auth.signInWithOtp({ email: form.email.trim().toLowerCase(), options: { shouldCreateUser: true, data: metadata } })
      : await supabase.auth.signInWithOtp({ phone: form.phone.trim(), options: { shouldCreateUser: true, data: metadata } });
    setBusy(false);
    if (error) {
      setMessage(localizeError(error.message, lang));
      return;
    }
    setSent(true);
    setMessage(verificationMode === "email" ? tx("Verification code sent. Check your email.", "Bestätigungscode gesendet. Bitte prüfen Sie Ihr E-Mail-Postfach.") : tx("Verification code sent. Check your phone.", "Bestätigungscode gesendet. Bitte prüfen Sie Ihre SMS."));
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    let provisioned = false;
    try {
      const supabase = await getSupabaseBrowser();
      const { error } = verificationMode === "email"
        ? await supabase.auth.verifyOtp({ email: form.email.trim().toLowerCase(), token: code.trim(), type: "email" })
        : await supabase.auth.verifyOtp({ phone: form.phone.trim(), token: code.trim(), type: "sms" });
      if (error) {
        setMessage(localizeError(error.message, lang));
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({ password: form.password });
      if (passwordError) {
        setMessage(localizeError(passwordError.message, lang));
        return;
      }

      const response = await fetch("/api/auth/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(localizeError(data.error || "Could not create your profile.", lang));
        return;
      }
      provisioned = true;
    } catch (error) {
      setMessage(localizeError(error instanceof Error ? error.message : "Supabase Auth is not configured.", lang));
    } finally {
      setBusy(false);
    }
    if (provisioned) {
      router.push(`/${lang}/shop`);
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">{tx("Create account", "Konto erstellen")}</h1>
      <p className="mt-2 text-sm text-ink/70">{tx("Verify your email or phone to create your account, then use your password to sign in.", "Bestätigen Sie Ihre E-Mail-Adresse oder Telefonnummer, um Ihr Konto zu erstellen, und melden Sie sich danach mit Ihrem Passwort an.")}</p>
      <div className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1 text-center text-sm">
        {(["email", "phone"] as VerificationMode[]).map((item) => (
          <button key={item} type="button" onClick={() => { setVerificationMode(item); setSent(false); setMessage(null); }} className={`rounded-full py-2 capitalize ${verificationMode === item ? "bg-white font-semibold text-teal-dark shadow-sm" : "text-ink/60"}`}>
            {item === "email" ? tx("Verify by email", "Per E-Mail bestätigen") : tx("Verify by phone", "Per SMS bestätigen")}
          </button>
        ))}
      </div>
      {!sent ? (
        <form onSubmit={sendCode} className="mt-8 space-y-4">
          <input required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder={tx("First name", "Vorname")} className="input-field" />
          <input required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder={tx("Last name", "Nachname")} className="input-field" />
          <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder={tx("Email address", "E-Mail-Adresse")} className="input-field" />
          <input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder={tx("Phone, e.g. +49 170 0000000", "Telefon, z. B. +49 170 0000000")} className="input-field" />
          <input required type="password" minLength={8} value={form.password} onChange={(event) => update("password", event.target.value)} placeholder={tx("Password (at least 8 characters)", "Passwort (mindestens 8 Zeichen)")} className="input-field" />
          <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? tx("Sending...", "Wird gesendet...") : tx("Send verification code", "Bestätigungscode senden")}</button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-8 space-y-4">
          <input required inputMode="numeric" minLength={6} maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} placeholder={tx("Verification code", "Bestätigungscode")} className="input-field" />
          <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? tx("Verifying...", "Wird geprüft...") : verificationMode === "email" ? tx("Verify email and create account", "E-Mail bestätigen und Konto erstellen") : tx("Verify phone and create account", "Telefonnummer bestätigen und Konto erstellen")}</button>
          <button type="button" onClick={() => setSent(false)} className="w-full text-xs text-mauve-dark underline">{verificationMode === "email" ? tx("Use a different email", "Andere E-Mail-Adresse verwenden") : tx("Use a different phone number", "Andere Telefonnummer verwenden")}</button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
    </div>
  );
}
