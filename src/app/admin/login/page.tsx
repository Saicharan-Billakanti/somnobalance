"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
      <h1 className="font-serif text-2xl text-ink">Admin</h1>
      <p className="mt-2 text-sm text-ink/60">Internal use only.</p>
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
              router.push("/admin");
              router.refresh();
              return;
            }
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Login failed");
          } catch {
            setError("Could not reach the server.");
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-8 space-y-4"
      >
        <input
          required
          type="password"
          placeholder="Admin password"
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
          {submitting ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
