"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type InterestKey = "hotel" | "company" | "practice" | "other";

// Public B2B landing page: positioning, three use cases and a short,
// non-binding enquiry form. No contract/portal registration for first-time
// visitors — enquiries go through the existing contact endpoint (topic
// "business"), so they reach the same inbox / admin message list.
export function BusinessLanding({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const fb = dict.forBusiness;
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<InterestKey>("hotel");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const focusForm = (key?: InterestKey) => {
    if (key) setInterest(key);
    document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Spam trap: bots fill the hidden field; pretend success and drop it.
    if (honeypot) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    const lines = [
      `${fb.form.company}: ${company}`,
      `${fb.form.interest}: ${fb.form.interestOptions[interest]}`,
      phone ? `${fb.form.phone.replace(/\s*\(.*\)$/, "")}: ${phone}` : "",
      message ? `\n${message}` : "",
    ].filter(Boolean);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contact, email, topic: "business", message: lines.join("\n") }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const [privacyBefore, privacyAfter] = fb.form.privacy.split("{link}");

  return (
    <div>
      {/* 1 · Hero */}
      <section
        className="px-4 py-16 sm:px-6 sm:py-24"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{fb.hero.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-ink md:text-5xl lg:text-6xl">{fb.hero.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
              {fb.hero.intro}
            </p>
            <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => focusForm()}
                className="inline-flex items-center gap-2 bg-mauve px-8 py-3.5 text-sm text-white transition-colors hover:bg-mauve-dark"
              >
                {fb.hero.ctaPrimary} <span aria-hidden="true">→</span>
              </button>
              <a
                href="#einsatzmoeglichkeiten"
                className="text-sm text-mauve-dark underline underline-offset-4 hover:opacity-80"
              >
                {fb.hero.ctaSecondary} →
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-sand">
            <Image
              src="/business/hotel-room.webp"
              alt={fb.hero.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2 · Drei Einsatzbereiche */}
      <section id="einsatzmoeglichkeiten" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{fb.areas.eyebrow}</p>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:justify-between lg:gap-20">
            <h2 className="font-serif text-3xl leading-tight text-ink md:w-1/2 md:text-4xl lg:text-5xl">
              {fb.areas.title}
            </h2>
            <p className="text-base leading-relaxed text-ink/70 md:w-5/12 md:pt-3 lg:text-lg">{fb.areas.intro}</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 md:grid-rows-[auto_auto_1fr_auto] md:gap-y-0">
            {fb.areas.items.map((item) => (
              <article key={item.name} className="flex flex-col bg-offwhite p-7 md:row-span-4 md:grid md:grid-rows-subgrid lg:p-9">
                <h3 className="font-serif text-2xl leading-snug text-ink">{item.name}</h3>
                <p className="mt-4 font-serif text-lg italic leading-snug text-mauve">{item.headline}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{item.body}</p>
                <button
                  type="button"
                  onClick={() => focusForm(item.interest as InterestKey)}
                  className="mt-6 self-end justify-self-start text-left text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-70"
                >
                  {item.link}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Individuelle Lösungen */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-2) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{fb.solutions.eyebrow}</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
            {fb.solutions.title}
          </h2>
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
            {fb.solutions.body}
          </p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
            {fb.solutions.blocksLabel}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {fb.solutions.blocks.map((block) => (
              <li key={block} className="bg-white px-5 py-4 text-sm text-ink/80 shadow-sm">
                {block}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 · Persönliche Zusammenarbeit */}
      <section className="bg-sand px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{fb.collab.eyebrow}</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">{fb.collab.title}</h2>
          <p className="mt-8 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">{fb.collab.body}</p>
          <button
            type="button"
            onClick={() => focusForm()}
            className="mt-10 inline-flex items-center justify-center bg-mauve px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-mauve-dark"
          >
            {fb.collab.cta}
          </button>
        </div>
      </section>

      {/* 5 · Kontaktformular */}
      <section id="anfrage" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">{fb.form.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70">{fb.form.intro}</p>

          {status === "sent" ? (
            <p role="status" className="mt-10 bg-teal/15 p-6 text-sm text-teal-dark">
              {fb.form.success}
            </p>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-company" className="text-xs font-medium text-ink/70">
                    {fb.form.company} *
                  </label>
                  <input
                    id="b-company"
                    required
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="b-contact" className="text-xs font-medium text-ink/70">
                    {fb.form.contact} *
                  </label>
                  <input
                    id="b-contact"
                    required
                    type="text"
                    autoComplete="name"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="input-field mt-1"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-email" className="text-xs font-medium text-ink/70">
                    {fb.form.email} *
                  </label>
                  <input
                    id="b-email"
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="b-phone" className="text-xs font-medium text-ink/70">
                    {fb.form.phone}
                  </label>
                  <input
                    id="b-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="b-interest" className="text-xs font-medium text-ink/70">
                  {fb.form.interest}
                </label>
                <select
                  id="b-interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as InterestKey)}
                  className="input-field mt-1"
                >
                  {(Object.keys(fb.form.interestOptions) as InterestKey[]).map((key) => (
                    <option key={key} value={key}>
                      {fb.form.interestOptions[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="b-message" className="text-xs font-medium text-ink/70">
                  {fb.form.message}
                </label>
                <textarea
                  id="b-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              {/* Honeypot — hidden from people, tempting for bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              {status === "error" && (
                <p role="alert" className="bg-red-50 p-4 text-sm text-red-600">
                  {fb.form.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-mauve py-3.5 text-sm font-medium text-white transition-colors hover:bg-mauve-dark disabled:opacity-60 sm:w-auto sm:px-10"
              >
                {status === "sending" ? fb.form.submitting : fb.form.submit}
              </button>

              <p className="text-xs leading-relaxed text-ink/60">
                {privacyBefore}
                <Link href={`/${lang}/legal/privacy`} className="underline underline-offset-2">
                  {fb.form.privacyLink}
                </Link>
                {privacyAfter}
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
