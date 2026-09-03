"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="mt-14 rounded-2xl border border-teal/20 bg-teal/5 p-6 text-ink/70">
        Thank you — we&apos;ve received your message and will get back to you soon.
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const payload = {
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          topic: String(formData.get("topic") || "general"),
          message: String(formData.get("message") || ""),
        };

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Something went wrong sending your message.");
            return;
          }
          setSent(true);
        } catch {
          setError("Could not reach the server. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
      className="mt-14 grid gap-4 sm:grid-cols-2"
    >
      <input required name="name" placeholder="Name" className="input-field" />
      <input required name="email" type="email" placeholder="Email" className="input-field" />
      <select name="topic" className="input-field sm:col-span-2" defaultValue="general">
        <option value="general">General enquiry</option>
        <option value="business">For my business</option>
        <option value="partner">Become a partner</option>
        <option value="order">An existing order</option>
      </select>
      <textarea
        required
        name="message"
        placeholder="Message"
        rows={5}
        className="input-field sm:col-span-2"
      />
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="sm:col-span-2 w-fit rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
