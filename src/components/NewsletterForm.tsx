"use client";

// No newsletter backend exists yet — this only confirms the email was
// entered. Wire this up to a real subscribe endpoint once one exists.
import { useState } from "react";
import type { Dictionary } from "@/i18n/getDictionary";

export function NewsletterForm({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <p className="text-sm text-ink/70">{dict.footer.newsletterThanks}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex max-w-sm items-center gap-2"
    >
      <input
        type="email"
        required
        placeholder={dict.footer.newsletterPlaceholder}
        className="w-full rounded-full border border-mauve/20 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-mauve/30"
      />
      <button
        type="submit"
        aria-label={dict.footer.newsletterSubmit}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mauve text-white transition hover:bg-mauve-dark"
      >
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
