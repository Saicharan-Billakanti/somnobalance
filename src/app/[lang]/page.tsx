import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { HeroVideo } from "@/components/HeroVideo";
import { RegenerationCircuit } from "@/components/RegenerationCircuit";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  return (
    <div>
      <section className="relative flex min-h-[620px] w-full items-center overflow-hidden lg:aspect-video lg:min-h-0">
        <HeroVideo className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-white/10 to-transparent" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-end justify-between px-4 pb-16 pt-32 sm:px-6 md:px-12 md:pb-24 lg:items-center lg:py-32">
          
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/60 md:text-sm">
              {dict.home.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-[3.5rem]">
              {dict.home.titlePrefix}
              <br className="hidden lg:block" />
              <em className="italic text-[#725e80]">{dict.home.titleAccent}</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
              {dict.home.subtitle}
            </p>
            <div className="mt-8 flex">
              <Link
                href={`/${l}/regenerationscheck`}
                className="inline-flex items-center gap-2 rounded-sm bg-[#786786] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#625270]"
              >
                {dict.home.ctaForMe} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden max-w-[9rem] pb-12 pr-4 lg:block xl:pr-12">
            <p className="font-serif text-lg italic leading-snug text-ink/70">
              {dict.home.heroSideTitle}
              <br />
              {dict.home.heroSideSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section
        id="unser-ansatz"
        className="px-4 py-24 sm:px-6 sm:py-32"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between lg:gap-24">
          <div className="md:w-5/12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
              {dict.homeSections.concept.eyebrow}
            </p>
            <h2 className="mt-5 max-w-xs font-serif text-4xl leading-[1.1] text-ink md:text-5xl lg:max-w-sm lg:text-6xl">
              {dict.homeSections.concept.headline}
            </h2>
          </div>
          <div className="md:w-7/12 md:pt-10">
            <p className="max-w-xl text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
              {dict.homeSections.concept.body}
            </p>
          </div>
        </div>
        
        <blockquote className="mx-auto mt-20 max-w-3xl text-center font-serif text-2xl italic leading-snug text-ink md:mt-32 md:text-3xl lg:text-4xl">
          {dict.homeSections.concept.statement}
        </blockquote>
        
        <div className="mx-auto mt-20 flex w-full max-w-6xl items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-ink/60 md:mt-32">
          {dict.homeSections.concept.phaseStrip.map((name, i, arr) => (
            <React.Fragment key={name}>
              <span className="shrink-0">{name}</span>
              {i < arr.length - 1 && (
                <i aria-hidden="true" className="mx-2 h-px flex-1 bg-ink/20 sm:mx-4 md:mx-8" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Section 3 — "Der SomnoBalance Regenerationskreislauf": its own
          component since it owns a scroll-driven background color shift
          through the four-tone scale, independent of the page's normal
          --color-scroll-* dramaturgy. */}
      <RegenerationCircuit
        eyebrow={dict.homeSections.circuit.eyebrow}
        headline={dict.homeSections.circuit.headline}
        intro={dict.homeSections.circuit.intro}
        phases={dict.homeSections.circuit.phases}
        closing={dict.homeSections.circuit.closing}
        closingSub={dict.homeSections.circuit.closingSub}
      />

      {/* Section 4 — "Was brauchen Sie gerade?": four self-recognition
          statements, then a single centered Regenerationscheck CTA.
          Background lightens again after Section 3's dark close. */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "color-mix(in srgb, var(--color-scroll-2) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between lg:gap-24">
            <div className="md:w-1/2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                {dict.homeSections.moment.eyebrow}
              </p>
              <h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                {dict.homeSections.moment.headline}
              </h2>
            </div>
            <div className="md:w-5/12 md:pt-10">
              <p className="max-w-xl text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
                {dict.homeSections.moment.intro}
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.homeSections.moment.situations.map((situation) => (
              <div key={situation.quote} className="flex flex-col bg-white p-8 shadow-sm lg:p-10">
                <p className="font-serif text-xl italic leading-snug text-ink">
                  &ldquo;{situation.quote}&rdquo;
                </p>
                <p className="mt-6 text-sm leading-relaxed text-ink/70 lg:text-base lg:leading-relaxed">{situation.reflection}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link
              href={`/${l}/regenerationscheck`}
              className="inline-flex items-center justify-center rounded-sm bg-[#786786] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#625270]"
            >
              {dict.homeSections.moment.checkCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5 — "SomnoBalance für Sie": 2x2 grid of curated products */}
      <section
        className="py-24 sm:py-32"
        style={{ background: "color-mix(in srgb, var(--color-scroll-3) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
              {dict.homeSections.forYou.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
              {dict.homeSections.forYou.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">
              {dict.homeSections.forYou.intro}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-10">
            {/* Card 1: Cards */}
            <div className="flex flex-col overflow-hidden rounded-sm bg-white shadow-sm">
              <Link href={`/${l}/shop/somnobalance-regeneration-cards`} className="group relative block aspect-[16/10] overflow-hidden">
                <Image
                  src="/mockup/cards-hands.webp"
                  alt="SomnoBalance Regenerationskarten"
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {l === "de" ? "SomnoBalance Regenerationskarten" : "SomnoBalance Regeneration Cards"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {l === "de" ? "Impulse, die Sie durch den Tag begleiten." : "Impulses that accompany you through the day."}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[0]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[1]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[2]}</span>
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[3]}</span>
                </div>
                <Link
                  href={`/${l}/shop/somnobalance-regeneration-cards`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-70"
                >
                  {l === "de" ? "Mehr erfahren →" : "Learn more →"}
                </Link>
              </div>
            </div>

            {/* Card 2: Ritual Trio */}
            <div className="flex flex-col overflow-hidden rounded-sm bg-white shadow-sm">
              <Link href={`/${l}/shop/somnobalance-roll-on`} className="group relative block aspect-[16/10] overflow-hidden">
                <Image
                  src="/mockup/ritual-trio.webp"
                  alt="Roll-on, Öl-Mischung & Raum Spray"
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {l === "de" ? "Roll-on, Öl-Mischung & Raum Spray" : "Roll-on, Oil Blend & Room Spray"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {l === "de" ? "Natürliche Düfte für bewusste Momente." : "Natural scents for conscious moments."}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[0]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[1]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[2]}</span>
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[3]}</span>
                </div>
                <Link
                  href={`/${l}/shop/somnobalance-roll-on`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-70"
                >
                  {l === "de" ? "Mehr erfahren →" : "Learn more →"}
                </Link>
              </div>
            </div>

            {/* Card 3: Tea & Starter Set */}
            <div className="flex flex-col overflow-hidden rounded-sm bg-white shadow-sm">
              <Link href={`/${l}/shop/somnobalance-regeneration-tea`} className="group relative block aspect-[16/10] overflow-hidden">
                <Image
                  src="/mockup/tea-starter.webp"
                  alt="Regenerationstee & Starter Set"
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {l === "de" ? "Regenerationstee & Starter Set" : "Regeneration Tea & Starter Set"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {l === "de" ? "Wohltuende Begleiter für den Abend." : "Soothing companions for the evening."}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[0]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[1]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[2]}</span>
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[3]}</span>
                </div>
                <Link
                  href={`/${l}/shop/somnobalance-regeneration-tea`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-70"
                >
                  {l === "de" ? "Mehr erfahren →" : "Learn more →"}
                </Link>
              </div>
            </div>

            {/* Card 4: Neck pillow & mattress */}
            <div className="flex flex-col overflow-hidden rounded-sm bg-white shadow-sm">
              <Link href={`/${l}/shop/somnobalance-neck-pillow`} className="group relative block aspect-[16/10] overflow-hidden">
                <Image
                  src="/mockup/pillow-bed.webp"
                  alt="Nackenstützkissen & Matratze"
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {l === "de" ? "Nackenstützkissen & Matratze" : "Neck Support Pillow & Mattress"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {l === "de" ? "Ergonomische Unterstützung für erholsamen Schlaf." : "Ergonomic support for restful sleep."}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[0]}</span>
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[1]}</span>
                  <span className="text-ink/30">{dict.homeSections.forYou.phaseLabels[2]}</span>
                  <span className="text-ink">{dict.homeSections.forYou.phaseLabels[3]}</span>
                </div>
                <Link
                  href={`/${l}/shop/somnobalance-neck-pillow`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-70"
                >
                  {l === "de" ? "Mehr erfahren →" : "Learn more →"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col items-center">
            <div className="flex w-full max-w-2xl items-center gap-4">
              <div className="h-px flex-1 bg-ink/20"></div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                SOMNOBALANCE ENTDECKEN
              </p>
              <div className="h-px flex-1 bg-ink/20"></div>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/${l}/shop`}
                className="inline-flex items-center justify-center rounded-sm bg-[#786786] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#625270] shadow-sm"
              >
                {l === "de" ? "Alle Produkte entdecken →" : "Discover all products →"}
              </Link>
              <Link
                href={`/${l}/regenerationscheck`}
                className="inline-flex items-center justify-center rounded-sm border border-ink/20 bg-white px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-sand"
              >
                {l === "de" ? "Regenerationscheck starten" : "Start Regeneration Check"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                href: `/${l}/for-me`,
                title: dict.home.forMeTitle,
                copy: dict.home.forMeCopy,
                image: dict.home.forMeImage,
              },
              {
                href: `/${l}/for-business`,
                title: dict.home.forBusinessTitle,
                copy: dict.home.forBusinessCopy,
                image: dict.home.forBusinessImage,
              },
              {
                href: `/${l}/partner`,
                title: dict.home.partnerTitle,
                copy: dict.home.partnerCopy,
                image: dict.home.partnerImage,
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-sm"
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="relative p-6 sm:p-8">
                  <h3 className="font-serif text-2xl font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/90">{card.copy}</p>
                  <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-white transition-opacity group-hover:opacity-80">
                    {l === "de" ? "Mehr erfahren →" : "Learn more →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
