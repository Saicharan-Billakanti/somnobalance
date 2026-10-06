"use client";

// Footer newsletter signup, per the client's latest homepage mockup. There
// is no dedicated newsletter-subscription endpoint/table in this project —
// only the regeneration-check quiz has a newsletterConsent field tucked
// into its own flow. Rather than build a new backend endpoint unasked, or
// fake a form that goes nowhere, this reuses the existing /api/contact
// route (topic: "general") so a submission actually reaches the inbox the
// contact form already notifies. Flagged in the KT: if the client wants a
// real mailing-list integration (Mailchimp/Resend audiences/etc.), that's
// a small, separate follow-up, not a silent assumption made here.
import { useState } from "react";
import type { Locale } from "@/i18n/config";

export function FooterNewsletterForm({ lang }: { lang: Locale }) {
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tx("Newsletter signup", "Newsletter-Anmeldung"),
          email,
          topic: "general",
          message: tx(
            "Please add this address to the SomnoBalance newsletter.",
            "Bitte diese Adresse für den SomnoBalance-Newsletter eintragen."
          ),
        }),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-[11px] text-lovable-primary-foreground/80">
        {tx("Thank you — we'll be in touch.", "Danke — wir melden uns bei Ihnen.")}
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="relative">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={tx("Email address", "E-Mail-Adresse")}
          className="w-full min-w-0 border-b border-lovable-primary-foreground/25 bg-transparent py-2 pr-8 text-[11px] text-lovable-primary-foreground placeholder:text-lovable-primary-foreground/50 focus:border-lovable-primary-foreground/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          aria-label={tx("Subscribe", "Anmelden")}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-lovable-primary-foreground/70 transition hover:text-lovable-primary-foreground disabled:opacity-50"
        >
          →
        </button>
      </div>
      <p className="mt-2 text-[9px] leading-4 text-lovable-primary-foreground/40">
        {tx(
          "By subscribing you agree to receive emails from SomnoBalance. You can unsubscribe at any time.",
          "Mit der Anmeldung stimmen Sie dem Erhalt von E-Mails von SomnoBalance zu. Sie können sich jederzeit wieder abmelden.",
        )}
      </p>
    </form>
  );
}
