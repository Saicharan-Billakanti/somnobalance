"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type Kind = "private" | "professional" | "company";

// Public "Partner werden" page for visitors and customers: positioning,
// the three-step referral flow and a short application. Applications go to
// the existing /api/partner/register endpoint (bank details are collected
// later in the partner portal, not at application).
export function PartnerLanding({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.partner.landing;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const kind = String(fd.get("kind") || "private") as Kind;
    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          businessType: t.apply.kindOptions[kind],
          description: String(fd.get("message") || ""),
        }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(t.apply.error);
      }
    } catch {
      setStatus("error");
      setError(t.apply.error);
    }
  };

  const [privacyBefore, privacyAfter] = t.apply.privacy.split("{link}");

  return (
    <div>
      {/* 1 · Hero — no commission figures, no stock imagery */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{t.hero.eyebrow}</p>
          <div className="mt-5 flex flex-col gap-10 md:flex-row md:items-start md:justify-between lg:gap-20">
            <h1 className="font-serif text-4xl leading-[1.1] text-ink md:w-1/2 md:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <div className="md:w-5/12 md:pt-3">
              <div className="space-y-5 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
                <p>{t.hero.p1}</p>
                <p>{t.hero.p2}</p>
              </div>
              <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => scrollTo("bewerbung")}
                  className="inline-flex items-center bg-mauve px-8 py-3.5 text-sm text-white transition-colors hover:bg-mauve-dark"
                >
                  {t.hero.primary}
                </button>
                <a href="#ablauf" className="text-sm text-mauve-dark underline underline-offset-4 hover:opacity-80">
                  {t.hero.secondary}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Partnerschaft */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">{t.about.title}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">{t.about.body}</p>
        </div>
      </section>

      {/* 3 · So funktioniert die Empfehlung — three quiet text cards */}
      <section
        id="ablauf"
        className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-2) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">{t.how.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 lg:text-lg">{t.how.intro}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.how.steps.map((step) => (
              <div key={step.title} className="bg-white p-8 shadow-sm lg:p-10">
                <h3 className="font-serif text-2xl text-ink">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/70 lg:text-base">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Partnerportal */}
      <section className="bg-sand px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">{t.portalInfo.title}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">{t.portalInfo.body}</p>
        </div>
      </section>

      {/* 5 · Abschluss + Bewerbung */}
      <section id="bewerbung" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">{t.close.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70">{t.close.body}</p>

          {status === "sent" ? (
            <div role="status" className="mt-10 bg-teal/15 p-6 text-sm text-teal-dark">
              <p className="font-serif text-xl text-ink">{t.apply.successTitle}</p>
              <p className="mt-2">{t.apply.successCopy}</p>
              <Link
                href={`/${lang}/login`}
                className="mt-5 inline-block bg-mauve px-6 py-2.5 text-sm text-white hover:bg-mauve-dark"
              >
                {t.apply.successLogin}
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-name" className="text-xs font-medium text-ink/70">
                    {t.apply.name} *
                  </label>
                  <input id="p-name" name="name" required autoComplete="name" className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="p-email" className="text-xs font-medium text-ink/70">
                    {t.apply.email} *
                  </label>
                  <input
                    id="p-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="input-field mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="p-kind" className="text-xs font-medium text-ink/70">
                  {t.apply.kind}
                </label>
                <select id="p-kind" name="kind" defaultValue="private" className="input-field mt-1">
                  {(Object.keys(t.apply.kindOptions) as Kind[]).map((k) => (
                    <option key={k} value={k}>
                      {t.apply.kindOptions[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="p-message" className="text-xs font-medium text-ink/70">
                  {t.apply.message}
                </label>
                <textarea id="p-message" name="message" rows={4} className="input-field mt-1" />
              </div>
              <label className="flex items-start gap-3 text-sm text-ink/70">
                <input type="checkbox" required className="mt-1 size-4 accent-mauve" />
                <span>
                  {privacyBefore}
                  <Link href={`/${lang}/legal/privacy`} className="underline underline-offset-2">
                    {t.apply.privacyLink}
                  </Link>
                  {privacyAfter} *
                </span>
              </label>

              {error && (
                <p role="alert" className="bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-mauve px-10 py-3.5 text-sm font-medium text-white transition-colors hover:bg-mauve-dark disabled:opacity-60"
                >
                  {status === "sending" ? t.apply.submitting : t.close.primary}
                </button>
                <Link
                  href={`/${lang}/login`}
                  className="text-sm text-mauve-dark underline underline-offset-4 hover:opacity-80"
                >
                  {t.close.existing}
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
