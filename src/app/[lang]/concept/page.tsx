import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return { title: dict.concept.meta };
}

// Subtle colour progression for the four phase modules (day → night), taken
// from the existing circuit tokens rather than new colours.
const PHASE_BARS = [
  "var(--color-circuit-letgo)",
  "color-mix(in srgb, var(--color-circuit-letgo) 45%, var(--color-circuit-prepare))",
  "var(--color-circuit-prepare)",
  "var(--color-circuit-regenerate)",
];

export default async function ConceptPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const c = dict.concept;
  const l = lang as Locale;

  return (
    <div>
      {/* 1 · Hero / Markenphilosophie */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-[1232px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{c.hero.eyebrow}</p>
          <div className="mt-5 flex flex-col gap-10 md:flex-row md:items-start md:justify-between lg:gap-20">
            <h1 className="font-serif text-4xl leading-[1.1] text-ink md:w-1/2 md:text-5xl lg:text-6xl">
              {c.hero.headline}
            </h1>
            <div className="space-y-5 text-base leading-relaxed text-ink/70 md:w-5/12 md:pt-3 lg:text-lg lg:leading-loose">
              <p>{c.hero.p1}</p>
              <p>{c.hero.p2}</p>
            </div>
          </div>
          <p className="mx-auto mt-16 max-w-3xl text-center font-serif text-2xl italic leading-snug text-ink md:mt-24 md:text-3xl lg:text-4xl">
            {c.hero.leitsatz}
          </p>
        </div>
      </section>

      {/* 2 · Wie SomnoBalance entstand */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-2) 74%, transparent)" }}
      >
        <div className="mx-auto flex max-w-[1232px] flex-col gap-10 md:flex-row md:justify-between lg:gap-20">
          <div className="md:w-5/12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{c.story.eyebrow}</p>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
              {c.story.headline}
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-ink/70 md:w-6/12 lg:text-lg lg:leading-loose">
            {c.story.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Die Menschen hinter SomnoBalance (footer anchor: #menschen) */}
      <section id="menschen" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[1232px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{c.people.eyebrow}</p>
          <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
            {c.people.headline}
          </h2>

          <div className="mt-14 grid max-w-5xl gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
            {c.people.profiles.map((person) => (
              <article key={person.name}>
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Image
                    src={person.image}
                    alt={person.imageAlt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-ink">{person.name}</h3>
                <p className="mt-4 text-base leading-relaxed text-ink/70">{person.body}</p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-3xl text-center font-serif text-xl italic leading-snug text-mauve md:text-2xl">
            {c.people.closing}
          </p>
        </div>
      </section>

      {/* 4 · Das Prinzip in vier Phasen — short text modules, not the homepage colour tiles */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-[1232px]">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between lg:gap-20">
            <div className="md:w-5/12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{c.phases.eyebrow}</p>
              <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
                {c.phases.headline}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-ink/70 md:w-6/12 md:pt-8 lg:text-lg lg:leading-loose">
              {c.phases.intro}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.phases.items.map((phase, i) => (
              <div key={phase.name} className="flex flex-col bg-white shadow-sm">
                <div className="h-1.5" style={{ background: PHASE_BARS[i] }} />
                <div className="p-7 lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{phase.name}</p>
                  <h3 className="mt-3 font-serif text-xl italic leading-snug text-ink">{phase.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70">{phase.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Was SomnoBalance besonders macht */}
      <section className="bg-sand px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{c.blocks.eyebrow}</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
            {c.blocks.headline}
          </h2>
          <p className="mt-8 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">{c.blocks.p1}</p>
          <p className="mt-6 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">{c.blocks.p2}</p>
        </div>
      </section>

      {/* 6 · Abschluss / nächste Schritte */}
      <section
        className="px-4 py-20 text-center sm:px-6 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, var(--color-circuit-prepare) 0%, var(--color-circuit-regenerate) 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl text-white">
          <h2 className="font-serif text-3xl leading-tight md:text-4xl lg:text-5xl">{c.cta.headline}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 lg:text-lg">{c.cta.body}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href={`/${l}/regenerationscheck`}
              className="inline-flex items-center justify-center bg-white px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-offwhite"
            >
              {c.cta.primary}
            </Link>
            <Link
              href={`/${l}/for-me`}
              className="text-sm text-white underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              {c.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
