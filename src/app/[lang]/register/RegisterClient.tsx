"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Locale } from "@/i18n/config";

type VerificationMode = "email" | "phone";

export function RegisterClient({ lang }: { lang: Locale; dict?: unknown }) {
  const router = useRouter();
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
      setMessage(error.message);
      return;
    }
    setSent(true);
    setMessage("Verification code sent. Check your email.");
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
        setMessage(error.message);
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({ password: form.password });
      if (passwordError) {
        setMessage(passwordError.message);
        return;
      }

      const response = await fetch("/api/auth/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Could not create your profile.");
        return;
      }
      provisioned = true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Supabase Auth is not configured.");
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
      <h1 className="font-serif text-3xl text-ink">Create account</h1>
      <p className="mt-2 text-sm text-ink/70">Verify your email or phone to create your account, then use your password to sign in.</p>
      <div className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1 text-center text-sm">
        {(["email", "phone"] as VerificationMode[]).map((item) => (
          <button key={item} type="button" onClick={() => { setVerificationMode(item); setSent(false); setMessage(null); }} className={`rounded-full py-2 capitalize ${verificationMode === item ? "bg-white font-semibold text-teal-dark shadow-sm" : "text-ink/60"}`}>
            Verify by {item}
          </button>
        ))}
      </div>
      {!sent ? (
        <form onSubmit={sendCode} className="mt-8 space-y-4">
          <input required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="First name" className="input-field" />
          <input required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder="Last name" className="input-field" />
          <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Email address" className="input-field" />
          <input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Phone, e.g. +49 170 0000000" className="input-field" />
          <input required type="password" minLength={8} value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="Password (at least 8 characters)" className="input-field" />
          <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Sending..." : "Send verification code"}</button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-8 space-y-4">
          <input required inputMode="numeric" minLength={6} maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} placeholder="Verification code" className="input-field" />
          <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Verifying..." : "Verify email and create account"}</button>
          <button type="button" onClick={() => setSent(false)} className="w-full text-xs text-mauve-dark underline">Use a different email</button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
    </div>
  );
}
