"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function AdminLoginClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
      <h1 className="font-serif text-2xl text-ink">{dict.admin.loginTitle}</h1>
      <p className="mt-2 text-sm text-ink/60">{dict.admin.loginSubtitle}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError(null);
          try {
            const res = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
            if (res.ok) {
              router.push(`/${lang}/admin`);
              router.refresh();
              return;
            }
            const data = await res.json().catch(() => ({}));
            setError(data.error || dict.admin.loginFailed);
          } catch {
            setError(dict.admin.networkError);
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-8 space-y-4"
      >
        <input
          required
          type="password"
          placeholder={dict.admin.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-mauve py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
        >
          {submitting ? dict.admin.checking : dict.admin.loginButton}
        </button>
      </form>
    </div>
  );
}
