"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Locale } from "@/i18n/config";

type LoginMode = "email" | "phone";

export function LoginClient({ lang }: { lang: Locale; dict?: unknown }) {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  const [mode, setMode] = useState<LoginMode>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      <h1 className="font-serif text-3xl text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink/70">Sign in with your email or phone and password.</p>
      <div className="mt-6 grid grid-cols-2 rounded-full bg-sand p-1 text-center text-sm">
        {(["email", "phone"] as LoginMode[]).map((item) => (
          <button key={item} type="button" onClick={() => { setMode(item); setMessage(null); }} className={`rounded-full py-2 capitalize ${mode === item ? "bg-white font-semibold text-teal-dark shadow-sm" : "text-ink/60"}`}>
            {item}
          </button>
        ))}
      </div>
      <form onSubmit={signIn} className="mt-6 space-y-4">
        <input required type={mode === "email" ? "email" : "tel"} value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={mode === "email" ? "Email address" : "+49 170 0000000"} className="input-field" />
        <input required type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="input-field" />
        <button disabled={busy} className="w-full rounded-full bg-mauve py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Signing in..." : "Sign in"}</button>
      </form>
      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
    </div>
  );
}
