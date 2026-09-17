import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { CycleBar } from "@/components/CycleBar";
import { LotusHero } from "@/components/LotusHero";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.home.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {dict.home.title}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              {dict.home.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/${l}/for-me`}
                className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                {dict.home.ctaForMe}
              </Link>
              <Link
                href={`/${l}/shop`}
                className="rounded-full border border-mauve/40 px-6 py-3 text-sm text-mauve-dark hover:bg-sand"
              >
                {dict.home.ctaShop}
              </Link>
            </div>
            <div className="mt-14 hidden items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink/40 md:flex">
              <span aria-hidden="true">↓</span>
              {dict.home.scrollHint}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <LotusHero />
            <p className="text-center font-serif text-lg italic leading-snug text-ink/80">
              {dict.home.heroBadgeLine1} {dict.home.heroBadgeLine2}
            </p>
            <div className="rounded-2xl bg-white/90 px-4 py-3 text-center shadow-sm">
              <div className="font-serif text-sm text-ink">{dict.home.heroSideTitle}</div>
              <div className="font-serif text-sm text-ink">{dict.home.heroSideSubtitle}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-scroll-1)" }}>
        <CycleBar label={dict.home.cycleLabel} stages={dict.home.cycle} />

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">
                {dict.home.systemEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink">{dict.home.systemTitle}</h2>
              <p className="mt-4 max-w-md text-ink/70">{dict.home.systemSubtitle}</p>
              <Link
                href={`/${l}/shop`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                {dict.home.systemCta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/brand/roomspray-styled-stone.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute right-6 top-6 text-right font-serif text-lg italic leading-snug text-ink/80">
                {dict.home.systemTagline1}
                <br />
                {dict.home.systemTagline2}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.phases.map((phase, i) => {
              // Client spec (email, 2026-09-16): REGULATE/PREPARE (even
              // index) get the mauve tint, LET GO/REGENERATE (odd index)
              // get the sage tint, both as ~9% tinted background fills.
              const accentColor = i % 2 === 0 ? "var(--color-phase-mauve)" : "var(--color-phase-sage)";
              return (
                <div
                  key={phase.name}
                  className="overflow-hidden rounded-2xl"
                  style={{ background: `color-mix(in srgb, ${accentColor} 9%, white)` }}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={phase.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.15em] text-teal-dark">
                        {phase.name}
                      </div>
                      <div className="mt-2 h-[3px] w-8 rounded-full" style={{ background: accentColor }} />
                      <p className="mt-3 text-sm leading-relaxed text-ink/70">{phase.copy}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mauve text-white"
                    >
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{ background: "var(--color-scroll-2)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">
            {dict.home.personaEyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ink">
            {dict.home.personaTitle}
          </h2>
          <p className="mt-4 max-w-lg text-ink/70">{dict.home.personaIntro}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl"
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="relative p-6">
                  <h3 className="font-serif text-lg text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{card.copy}</p>
                  <span className="mt-3 inline-block text-sm text-white group-hover:underline">
                    {dict.home.discover}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{ background: "var(--color-scroll-3)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">{dict.home.shopEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl text-ink">{dict.home.fromShop}</h2>
              <p className="mt-4 max-w-md text-ink/70">{dict.home.shopIntro}</p>
              <Link
                href={`/${l}/shop`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                {dict.home.shopViewAllCta}
              </Link>
            </div>

            <div className="flex flex-col items-end gap-4">
              <p className="max-w-[12rem] text-right font-serif text-lg italic leading-snug text-ink/70">
                {dict.home.shopTagline}
              </p>
              <div className="hidden items-center gap-2 sm:flex" aria-hidden="true">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mauve/30 text-mauve-dark">
                  ←
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mauve/30 text-mauve-dark">
                  →
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} lang={l} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-scroll-3)" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">{dict.home.checkEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">{dict.home.checkTitle}</h2>
            <p className="mt-4 max-w-md text-ink/70">{dict.home.checkIntro}</p>
            <Link
              href={`/${l}/regenerationscheck`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
            >
              {dict.home.checkCta}
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/products/somnobalance-regeneration-tea.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute right-6 top-6 max-w-[9rem] text-right font-serif text-lg italic leading-snug text-white drop-shadow-sm">
              {dict.home.checkTagline.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
