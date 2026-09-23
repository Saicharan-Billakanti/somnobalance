"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type LoginMode = "email" | "phone";

export function LoginClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.authPages.login;
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [mode, setMode] = useState<LoginMode>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const registerHref = `/${lang}/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
  const forgotPasswordHref = `/${lang}/forgot-password${identifier && mode === "email" ? `?email=${encodeURIComponent(identifier.trim())}` : ""}`;

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const value = identifier.trim();
      const supabase = await getSupabaseBrowser();
      const result = mode === "email"
        ? await supabase.auth.signInWithPassword({ email: value.toLowerCase(), password })
        : await supabase.auth.signInWithPassword({ phone: value, password });
      if (result.error) {
        setMessage(result.error.message);
        return;
      }
      router.push(redirect || `/${lang}/shop`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Supabase Auth is not configured.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">{t.title}</h1>
      <p className="mt-2 text-sm text-ink/70">{t.subtitle}</p>
      <div className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1 text-center text-sm">
        {(["email", "phone"] as LoginMode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setMessage(null);
            }}
            className={`rounded-full py-2 ${mode === item ? "bg-white font-semibold text-teal-dark shadow-sm" : "text-ink/60"}`}
          >
            {item === "email" ? t.email : t.phone}
          </button>
        ))}
      </div>
      <form onSubmit={signIn} className="mt-6 space-y-4">
        <input
          required
          type={mode === "email" ? "email" : "tel"}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder={mode === "email" ? t.emailPlaceholder : t.phonePlaceholder}
          className="input-field"
        />
        <div>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.passwordPlaceholder}
            className="input-field"
          />
          {mode === "email" && (
            <Link href={forgotPasswordHref} className="mt-2 inline-block text-xs text-mauve-dark underline underline-offset-4">
              {t.forgotPassword}
            </Link>
          )}
        </div>
        <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? t.submitting : t.submit}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
      <p className="mt-6 text-center text-sm text-ink/60">
        {t.noAccount}{" "}
        <Link href={registerHref} className="text-mauve-dark underline underline-offset-4">
          {t.createAccount}
        </Link>
      </p>
    </div>
  );
}
