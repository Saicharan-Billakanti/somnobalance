"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function ForgotPasswordClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.authPages.forgotPassword;
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const supabase = await getSupabaseBrowser();
      const redirectTo = `${window.location.origin}/${lang}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
      if (error) {
        setMessage(error.message);
        return;
      }
      setSent(true);
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
      {sent ? (
        <p className="mt-6 text-sm text-ink/70">{t.success}</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.emailPlaceholder}
            className="input-field"
          />
          <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? t.submitting : t.submit}
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
      <p className="mt-6 text-center text-sm text-ink/60">
        <Link href={`/${lang}/login`} className="text-mauve-dark underline underline-offset-4">
          {t.backToLogin}
        </Link>
      </p>
    </div>
  );
}
