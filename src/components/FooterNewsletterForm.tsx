"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

export function FooterNewsletterForm({ lang }: { lang: Locale }) {
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
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
      <p role="status" className="text-[11px] text-lovable-primary-foreground/80">
        {tx("Request received. Check your inbox and confirm your subscription using the email link. Please check your spam folder too.", "Anfrage erhalten. Bitte prüfen Sie Ihren Posteingang und bestätigen Sie die Anmeldung über den Link in der E-Mail. Prüfen Sie auch Ihren Spam-Ordner.")}
      </p>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={status === "sending"}>
      <div className="relative">
        <input
          aria-label={tx("Email address", "E-Mail-Adresse")}
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
          {status === "sending" ? "…" : "→"}
        </button>
      </div>
      {status === "sending" && <p role="status" className="mt-2 text-[11px]">{tx("Submitting…", "Anmeldung wird übermittelt…")}</p>}
      {status === "error" && <p role="alert" className="mt-2 text-[11px]">{tx("Signup failed. Please try again later.", "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.")}</p>}
      <p className="mt-2 text-[9px] leading-4 text-lovable-primary-foreground/40">
        {tx(
          "By subscribing you agree to receive emails from SomnoBalance. You can unsubscribe at any time.",
          "Mit der Anmeldung stimmen Sie dem Erhalt von E-Mails von SomnoBalance zu. Sie können sich jederzeit wieder abmelden.",
        )}
      </p>
      <label className="mt-3 flex items-start gap-2 text-[9px] leading-4 text-lovable-primary-foreground/60">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-current" />
        <span>
          {tx("I agree to receive the SomnoBalance newsletter and can unsubscribe at any time. See our ", "Ich möchte den SomnoBalance-Newsletter erhalten und kann mich jederzeit abmelden. Weitere Informationen finden Sie in unserer ")}
          <a href={`/${lang}/legal/privacy`} className="underline underline-offset-2">{tx("privacy notice", "Datenschutzerklärung")}</a>.
        </span>
      </label>
    </form>
  );
}
