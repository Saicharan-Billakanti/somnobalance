"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function LoginClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginWithPayload = async (payload: { email: string; password: string }) => {
    setError(null);
    setSubmitting(true);
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
      setUser(data.user);
      
      // Intelligent role-based redirection
      if (data.user?.isAdmin || data.user?.role === "admin") {
        router.push(redirect || `/${lang}/admin`);
      } else if (redirect) {
        router.push(redirect);
      } else if (data.user?.isBusiness) {
        router.push(`/${lang}/for-business`);
      } else {
        router.push(`/${lang}/shop`);
      }
      router.refresh();
    } catch {
      setError(dict.auth.networkError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.25em] text-teal-dark font-semibold">{dict.auth.account}</p>
      <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{dict.auth.loginTitle}</h1>
      <p className="mt-2 text-sm text-ink/70">{dict.auth.loginWelcome}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginWithPayload({ email, password });
        }}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="text-xs font-medium text-ink/70">{dict.auth.email}</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder={dict.auth.email}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink/70">{dict.auth.password}</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder={dict.auth.password}
            className="input-field mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-mauve py-3.5 text-sm font-semibold text-white hover:bg-mauve-dark disabled:opacity-60 transition shadow-sm"
        >
          {submitting ? dict.auth.loggingIn : dict.auth.loginButton}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/60">
        {dict.auth.newHere}{" "}
        <Link
          href={redirect ? `/${lang}/register?redirect=${encodeURIComponent(redirect)}` : `/${lang}/register`}
          className="text-mauve-dark font-medium underline"
        >
          {dict.auth.createAccount}
        </Link>
      </p>
    </div>
  );
}
