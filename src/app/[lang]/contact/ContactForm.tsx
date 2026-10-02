"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/getDictionary";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="mt-14 rounded-2xl border border-teal/20 bg-teal/5 p-6 text-ink/70">
        {dict.contact.form.thanks}
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
            setError(data.error || dict.contact.form.genericError);
            return;
          }
          setSent(true);
        } catch {
          setError(dict.contact.form.networkError);
        } finally {
          setSubmitting(false);
        }
      }}
      className="mt-14 grid gap-4 sm:grid-cols-2"
    >
      <input required name="name" placeholder={dict.contact.form.name} className="input-field" />
      <input required name="email" type="email" placeholder={dict.contact.form.email} className="input-field" />
      <select name="topic" className="input-field sm:col-span-2" defaultValue="general">
        <option value="general">{dict.contact.form.topicGeneral}</option>
        <option value="business">{dict.contact.form.topicBusiness}</option>
        <option value="partner">{dict.contact.form.topicPartner}</option>
        <option value="order">{dict.contact.form.topicOrder}</option>
      </select>
      <textarea
        required
        name="message"
        placeholder={dict.contact.form.message}
        rows={5}
        className="input-field sm:col-span-2"
      />
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="sm:col-span-2 w-fit rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
      >
        {submitting ? dict.contact.form.sending : dict.contact.form.send}
      </button>
    </form>
  );
}
