"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function ResetPasswordClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.authPages.resetPassword;
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = await getSupabaseBrowser();
      // The recovery link puts the user in a temporary "password recovery"
      // session — check for that session directly rather than waiting on
      // onAuthStateChange, since the PASSWORD_RECOVERY event can fire
      // before this component mounts.
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setValidLink(Boolean(data.session));
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage(t.passwordMismatch);
      return;
    }
    setBusy(true);
    try {
      const supabase = await getSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(error.message);
        return;
      }
      setSuccess(true);
      window.setTimeout(() => {
        router.push(`/${lang}/shop`);
        router.refresh();
      }, 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Supabase Auth is not configured.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-ink/60 sm:px-6">Loading...</div>;
  }

  if (!validLink) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl text-ink">{t.title}</h1>
        <p className="mt-4 text-sm text-ink/70">{t.invalidLink}</p>
        <Link href={`/${lang}/forgot-password`} className="mt-6 inline-block text-sm text-mauve-dark underline underline-offset-4">
          {t.requestNewLink}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">{t.title}</h1>
      <p className="mt-2 text-sm text-ink/70">{t.subtitle}</p>
      {success ? (
        <p className="mt-6 text-sm text-ink/70">{t.success}</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.passwordPlaceholder}
            className="input-field"
          />
          <input
            required
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t.confirmPasswordPlaceholder}
            className="input-field"
          />
          <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? t.submitting : t.submit}
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
    </div>
  );
}
