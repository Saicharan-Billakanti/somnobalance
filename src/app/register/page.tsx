"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">Account</p>
      <h1 className="mt-3 font-serif text-3xl text-ink">Create an account</h1>
      <p className="mt-3 text-ink/70">
        Save your details for faster checkout and track your orders.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSubmitting(true);

          const formData = new FormData(e.currentTarget);
          const payload = {
            firstName: String(formData.get("firstName") || ""),
            lastName: String(formData.get("lastName") || ""),
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
          };

          try {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Could not create your account.");
              return;
            }
            setUser(data.user);
            router.push("/");
            router.refresh();
          } catch {
            setError("Could not reach the server. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-10 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <input required name="firstName" placeholder="First name" className="input-field" />
          <input required name="lastName" placeholder="Last name" className="input-field" />
        </div>
        <input required type="email" name="email" placeholder="Email" className="input-field" />
        <input
          required
          type="password"
          name="password"
          minLength={8}
          placeholder="Password (min. 8 characters)"
          className="input-field"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-mauve py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="text-mauve-dark underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
