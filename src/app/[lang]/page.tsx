import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { getProduct, getProductText, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HeroFlipCards, type FlipCardItem } from "@/components/HeroFlipCards";
import { HeroVideo } from "@/components/HeroVideo";
import { JourneyStrip } from "@/components/JourneyStrip";
import { RotatingOrb } from "@/components/RotatingOrb";
import { Reveal } from "@/components/Reveal";
import { RingMotif, Blobs, PageEyebrow, tintClasses } from "@/components/Decor";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

// Drop the real cinematic loop at public/video/hero-loop.mp4 (optionally with
// a public/video/hero-loop-poster.jpg poster frame) and the hero switches
// from the flip-card fallback to the video automatically — no code change
// needed.
const HERO_VIDEO_PATH = "video/hero-loop.mp4";
const HERO_VIDEO_POSTER_PATH = "video/hero-loop-poster.jpg";

function heroVideoAvailable() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", HERO_VIDEO_PATH));
  } catch {
    return false;
  }
}

const PHASE_ICON_PATHS: Record<string, string> = {
  REGULATE: "M3 12h4l2-7 4 14 2-7h6",
  "LET GO": "M4 15c4-6 8 6 12 0M2 9c4-6 8 6 12 0M12 4v16",
  PREPARE: "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z",
  REGENERATE: "M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
};

const PHASE_TINTS = ["mauve", "teal", "ink", "mauve"] as const;

function PhaseIcon({ name }: { name: string }) {
  const d = PHASE_ICON_PATHS[name];
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  const paths = [
    { href: `/${l}/for-me`, title: dict.home.forMeTitle, copy: dict.home.forMeCopy, tint: "mauve" as const },
    {
      href: `/${l}/for-business`,
      title: dict.home.forBusinessTitle,
      copy: dict.home.forBusinessCopy,
      tint: "teal" as const,
    },
    { href: `/${l}/partner`, title: dict.home.partnerTitle, copy: dict.home.partnerCopy, tint: "ink" as const },
  ];

  const heroSlugs = [
    "somnobalance-mattress",
    "somnobalance-oil-blend",
    "somnobalance-regeneration-cards",
    "somnobalance-neck-pillow",
  ];
  const heroCards: FlipCardItem[] = heroSlugs
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      src: p.image,
      name: getProductText(p, l).name,
      phaseLabel: dict.shop.phases[p.phase],
    }));

  const hasHeroVideo = heroVideoAvailable();
  const hasHeroPoster = fs.existsSync(path.join(process.cwd(), "public", HERO_VIDEO_POSTER_PATH));

  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Blobs />
        <RingMotif className="-right-24 top-10 opacity-90 md:-right-16" tone="teal" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 py-20 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-28">
          <div className="animate-fade-up">
            <PageEyebrow>{dict.home.eyebrow}</PageEyebrow>
            <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.05] text-ink sm:text-6xl md:text-[3.75rem]">
              {dict.home.title.split(" ").map((word, i, arr) =>
                i === arr.length - 2 || i === arr.length - 1 ? (
                  <span key={i} className="italic text-mauve-dark">
                    {word}{" "}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/70">{dict.home.subtitle}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={`/${l}/for-me`}
                className="group inline-flex items-center gap-2 rounded-full bg-mauve px-7 py-3.5 text-sm text-white shadow-[0_8px_24px_-8px_rgba(111,87,132,0.55)] transition hover:bg-mauve-dark hover:shadow-[0_10px_30px_-6px_rgba(111,87,132,0.6)]"
              >
                {dict.home.ctaForMe}
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href={`/${l}/shop`}
                className="rounded-full border border-mauve/30 px-7 py-3.5 text-sm text-mauve-dark transition hover:border-mauve/50 hover:bg-white"
              >
                {dict.home.ctaShop}
              </Link>
            </div>
            <JourneyStrip steps={dict.home.journey} />
          </div>

          <div className="relative mx-auto max-w-xs animate-fade-up pl-5 pt-5 [animation-delay:150ms] sm:pl-7 sm:pt-7 md:mx-0 md:max-w-none">
            {hasHeroVideo ? (
              <HeroVideo
                src={`/${HERO_VIDEO_PATH}`}
                poster={hasHeroPoster ? `/${HERO_VIDEO_POSTER_PATH}` : undefined}
                caption={dict.home.title}
                journeyLabel={dict.home.journey.join(" · ")}
              />
            ) : (
              <HeroFlipCards items={heroCards} caption={dict.home.systemTitle} />
            )}
            <div className="absolute -bottom-5 left-0 rotate-2 rounded-2xl border border-mauve/10 bg-white px-4 py-3 shadow-[0_20px_45px_-15px_rgba(43,37,48,0.35)] sm:-bottom-7 sm:px-5 sm:py-4">
              <div className="font-serif text-2xl text-mauve-dark sm:text-3xl">4</div>
              <div className="max-w-[6rem] text-[9px] uppercase leading-tight tracking-[0.15em] text-ink/50 sm:max-w-[7rem] sm:text-[10px]">
                {dict.home.systemTitle}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase marquee */}
      <div className="relative overflow-hidden bg-teal-dark py-3">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-xs uppercase tracking-[0.35em] text-white/85">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-10">
              {dict.home.phases.map((phase) => (
                <span key={`${i}-${phase.name}`} className="flex items-center gap-3">
                  {phase.name}
                  <span className="text-white/40">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* System / phases */}
      <section className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.home.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{dict.home.systemTitle}</h2>
          <p className="mt-4 text-ink/70">{dict.home.systemSubtitle}</p>
        </div>

        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-mauve/30 via-teal/30 to-mauve/30 lg:block" />
          {dict.home.phases.map((phase, i) => {
            const t = tintClasses(PHASE_TINTS[i]);
            return (
              <Reveal key={phase.name} from={i % 2 === 0 ? "left" : "right"} delay={i * 90}>
                <div
                  className={`group relative overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1.5 ${t.border} ${t.bg}`}
                >
                  <div className={`absolute left-0 top-0 h-1 w-full ${t.bar}`} />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl text-ink/20 transition group-hover:text-ink/40">
                      0{i + 1}
                    </span>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full transition ${t.icon}`}>
                      <PhaseIcon name={phase.name} />
                    </span>
                  </div>
                  <div className="mt-5 text-xs font-semibold tracking-[0.15em] text-teal-dark">
                    {phase.name}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{phase.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Editorial pull-quote */}
      <section className="relative overflow-hidden bg-sand/50 py-14 sm:py-20 lg:py-24">
        <RingMotif className="-left-56 top-1/2 -translate-y-1/2 opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="font-serif text-6xl leading-none text-mauve/30">&ldquo;</span>
            <p className="-mt-6 font-serif text-2xl leading-snug text-ink md:text-3xl">
              {dict.about.p2}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-10 bg-mauve/40" />
              <Link
                href={`/${l}/about`}
                className="text-sm uppercase tracking-[0.15em] text-mauve-dark hover:underline"
              >
                {dict.about.heading}
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-xs">
            <div className="absolute inset-0 rounded-full border border-teal/20" />
            <div className="absolute inset-6">
              <RotatingOrb src="/products/somnobalance-oil-blend.jpg" alt="SomnoBalance Oil Blend" />
            </div>
          </div>
        </div>
      </section>

      {/* Shop preview */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl text-ink">{dict.home.fromShop}</h2>
            <div className="mt-3 h-1 w-14 rounded-full bg-teal/60" />
          </div>
          <Link
            href={`/${l}/shop`}
            className="text-sm text-mauve-dark transition hover:underline"
          >
            {dict.home.viewAll} →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} from={i % 2 === 0 ? "left" : "right"} delay={i * 90}>
              <ProductCard product={p} lang={l} dict={dict} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Three paths */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {paths.map((path, i) => {
            const t = tintClasses(path.tint);
            return (
              <Reveal key={path.href} from={i % 2 === 0 ? "left" : "right"} delay={i * 90}>
                <Link
                  href={path.href}
                  className={`group relative block overflow-hidden rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 ${t.border} ${t.bg}`}
                >
                  <div className={`absolute left-0 top-0 h-1 w-full ${t.bar}`} />
                  <h3 className="font-serif text-xl text-mauve-dark">{path.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{path.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-teal-dark">
                    {dict.home.discover.replace(" →", "")}
                    <span className="transition group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
