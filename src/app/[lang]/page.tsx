import Link from "next/link";
import Image from "next/image";
import { getProduct, getProductText } from "@/lib/products";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { RegenerationCircuit } from "@/components/RegenerationCircuit";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  return (
    <div>
      <section
        className="relative overflow-hidden"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.home.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {dict.home.titlePrefix}
              <em className="text-mauve italic">{dict.home.titleAccent}</em>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              {dict.home.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={`/${l}/regenerationscheck`}
                className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                {dict.home.ctaForMe}
              </Link>
              <Link href={`/${l}/shop`} className="text-sm text-mauve-dark underline underline-offset-4">
                {dict.home.ctaShop}
              </Link>
            </div>
            <div className="mt-14 hidden items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink/40 md:flex">
              <span aria-hidden="true">↓</span>
              {dict.home.scrollHint}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px] md:mx-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src="/brand/rollon-styled-stone.webp"
                alt=""
                fill
                sizes="(min-width: 768px) 360px, 80vw"
                priority
                className="object-cover"
              />
            </div>
            <p className="absolute -right-4 bottom-6 hidden max-w-[9rem] -rotate-3 rounded-2xl bg-offwhite p-4 text-right font-serif text-base italic leading-snug text-mauve shadow-lg md:block">
              {dict.home.heroSideTitle}
              <br />
              {dict.home.heroSideSubtitle}
            </p>
            <p className="mt-4 text-center font-serif text-lg italic leading-snug text-mauve md:hidden">
              {dict.home.heroSideTitle} {dict.home.heroSideSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section id="unser-ansatz" style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}>
        {/* Section 2 — "Der SomnoBalance Gedanke": pure typography, no
            cards, no photo, no CTA. Per the brief this is deliberately
            quiet after the hero — the visitor is in "understand", not
            "buy". A light divider line stands in for the four-phase
            system without yet explaining it (that's Section 3). */}
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-xs uppercase tracking-[0.2em] text-mauve">
            {dict.homeSections.concept.eyebrow}
          </p>
          <h2 className="mt-6 font-serif text-3xl leading-tight text-ink md:text-4xl">
            {dict.homeSections.concept.headline}
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-ink/70">
            {dict.homeSections.concept.body}
          </p>
          <p className="mt-16 font-serif text-2xl italic leading-snug text-ink md:text-3xl">
            {dict.homeSections.concept.statement}
          </p>
          <p className="mt-10 text-sm text-ink-meta">{dict.homeSections.concept.transition}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.15em] text-ink-meta">
            {dict.homeSections.concept.phaseStrip.map((name, i) => (
              <span key={name} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true">—</span>}
                {name}
              </span>
            ))}
          </div>
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
          statements (no product links yet), then the Regenerationscheck
          CTA. Background lightens again after Section 3's dark close. */}
      <section
        className="py-20 sm:py-24"
        style={{ background: "color-mix(in srgb, var(--color-scroll-2) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">
            {dict.homeSections.moment.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ink md:text-4xl">
            {dict.homeSections.moment.headline}
          </h2>
          <p className="mt-5 max-w-lg text-ink/70">{dict.homeSections.moment.intro}</p>
          <p className="mt-3 max-w-lg text-ink/70">{dict.homeSections.moment.sub}</p>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.homeSections.moment.situations.map((situation) => (
              <div
                key={situation.quote}
                className="rounded-2xl border border-mauve/15 bg-offwhite/60 p-6"
              >
                <p className="font-serif text-base italic leading-snug text-ink">
                  &ldquo;{situation.quote}&rdquo;
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{situation.reflection}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid items-center gap-10 border-t border-mauve/15 pt-14 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-mauve">
                {dict.homeSections.moment.checkEyebrow}
              </p>
              <h3 className="mt-4 max-w-xl font-serif text-2xl leading-snug text-ink md:text-3xl">
                {dict.homeSections.moment.checkHeadline}
              </h3>
              <p className="mt-4 max-w-lg text-ink/70">{dict.homeSections.moment.checkBody}</p>
              <Link
                href={`/${l}/regenerationscheck`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-mauve px-7 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                {dict.homeSections.moment.checkCta}
              </Link>
              <p className="mt-3 text-xs text-ink-meta">{dict.homeSections.moment.checkNote}</p>
            </div>

            {/* "Card peeking out" visual — the check framed like a printed
                insert the visitor pulls out, not a quiz-app button. */}
            <Link
              href={`/${l}/regenerationscheck`}
              className="hidden w-44 shrink-0 rotate-3 rounded-2xl border border-mauve/20 bg-offwhite p-6 text-center shadow-xl transition hover:rotate-1 hover:shadow-2xl md:block"
            >
              <p className="font-serif text-sm italic leading-snug text-mauve">
                {dict.homeSections.moment.checkCardLabel}
              </p>
              <span
                aria-hidden="true"
                className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-mauve text-white"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5 — "SomnoBalance für Sie": editorial product dramaturgy,
          not a flat product-card wall. Each product keeps the same
          REGULIEREN—LOSLASSEN—VORBEREITEN—REGENERIEREN phase strip with
          its relevant phases highlighted, per the brief's "products are
          flexible companions, not locked to one phase" rule. */}
      <section
        className="py-20 sm:py-24"
        style={{ background: "color-mix(in srgb, var(--color-scroll-3) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">
            {dict.homeSections.forYou.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ink md:text-4xl">
            {dict.homeSections.forYou.headline}
          </h2>
          <p className="mt-5 max-w-lg text-ink/70">{dict.homeSections.forYou.intro}</p>

          <div className="mt-8 max-w-md border-t border-mauve/15 pt-8">
            <p className="font-serif text-xl italic leading-snug text-mauve">
              {dict.homeSections.forYou.rhythmHeadline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {dict.homeSections.forYou.rhythmBody}
            </p>
          </div>

          {(() => {
            // Editorial dramaturgy per the brief, not a repeating product
            // wall: Regeneration Cards large and alone -> Roll-on/Oil
            // Blend/Room Spray as one grouped "ritual world" -> Tea paired
            // with the Starter Set -> Neck Pillow/Mattress large and
            // generous as the night-facing close. Reads from the same
            // flat `products` array (ordered to match this grouping) so
            // the copy/pricing/phase data stays single-sourced.
            const products = dict.homeSections.forYou.products;
            const byslug = (slug: string) => products.find((p) => p.slug === slug);
            const cards = byslug("somnobalance-regeneration-cards");
            const ritualTrio = ["somnobalance-roll-on", "somnobalance-oil-blend", "somnobalance-room-spray"]
              .map(byslug)
              .filter((p): p is NonNullable<typeof p> => Boolean(p));
            const teaPair = ["somnobalance-regeneration-tea", "somnobalance-starter-set"]
              .map(byslug)
              .filter((p): p is NonNullable<typeof p> => Boolean(p));
            const nightPair = ["somnobalance-neck-pillow", "somnobalance-mattress"]
              .map(byslug)
              .filter((p): p is NonNullable<typeof p> => Boolean(p));

            const PhaseStrip = ({ activePhases }: { activePhases: boolean[] }) => (
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-xs uppercase tracking-[0.12em]">
                {dict.homeSections.forYou.phaseLabels.map((label, i) => (
                  <span key={label} className={activePhases[i] ? "font-semibold text-mauve-dark" : "text-ink-meta"}>
                    {label}
                  </span>
                ))}
              </div>
            );

            // Each of the 4 tiles in the 2x2 grid below represents one of
            // the brief's thematic groups (cards alone / ritual trio / tea
            // + starter-set / pillow + mattress) rather than one product —
            // still editorial grouping, not a flat 9-up product wall, just
            // laid out as an even grid per the client's latest mockup
            // instead of varied-size stacked rows.
            const GroupTile = ({
              title,
              subheadline,
              href,
              image,
              activePhases,
              cta,
              extraImages,
            }: {
              title: string;
              subheadline: string;
              href: string;
              image: string;
              activePhases: boolean[];
              cta: string;
              extraImages?: string[];
            }) => (
              <div className="flex flex-col overflow-hidden rounded-3xl border border-mauve/10 bg-offwhite">
                <Link href={href} className="group relative block aspect-[4/3] overflow-hidden bg-sand/40">
                  {extraImages && extraImages.length > 0 ? (
                    <div className="grid h-full grid-cols-3 gap-px bg-mauve/10">
                      {[image, ...extraImages].slice(0, 3).map((src) => (
                        <div key={src} className="relative overflow-hidden bg-sand/40">
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 15vw, 30vw"
                            className="object-contain p-3 transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-contain p-10 transition duration-500 group-hover:scale-105"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl text-ink">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{subheadline}</p>
                  <PhaseStrip activePhases={activePhases} />
                  <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-mauve-dark underline underline-offset-4 hover:text-ink"
                  >
                    {cta}
                  </Link>
                </div>
              </div>
            );

            return (
              <div className="mt-16 grid gap-6 md:grid-cols-2">
                {cards && (
                  <GroupTile
                    title={getProductText(getProduct(cards.slug)!, l).name}
                    subheadline={cards.subheadline}
                    href={`/${l}/shop/${cards.slug}`}
                    image={cards.image}
                    activePhases={cards.activePhases}
                    cta={cards.cta}
                  />
                )}

                {ritualTrio.length > 0 && (
                  <GroupTile
                    title={dict.homeSections.forYou.ritualGroupLabel}
                    subheadline={ritualTrio.map((p) => getProductText(getProduct(p.slug)!, l).name).join(" · ")}
                    href={`/${l}/shop/${ritualTrio[0].slug}`}
                    image={ritualTrio[0].image}
                    extraImages={ritualTrio.slice(1).map((p) => p.image)}
                    activePhases={ritualTrio[0].activePhases}
                    cta={ritualTrio[0].cta}
                  />
                )}

                {teaPair.length > 0 && (
                  <GroupTile
                    title={teaPair.map((p) => getProductText(getProduct(p.slug)!, l).name).join(" & ")}
                    subheadline={teaPair[0].subheadline}
                    href={`/${l}/shop/${teaPair[0].slug}`}
                    image={teaPair[0].image}
                    extraImages={teaPair.slice(1).map((p) => p.image)}
                    activePhases={teaPair[0].activePhases}
                    cta={teaPair[0].cta}
                  />
                )}

                {nightPair.length > 0 && (
                  <GroupTile
                    title={nightPair.map((p) => getProductText(getProduct(p.slug)!, l).name).join(" & ")}
                    subheadline={nightPair[0].subheadline}
                    href={`/${l}/shop/${nightPair[0].slug}`}
                    image={nightPair[0].image}
                    extraImages={nightPair.slice(1).map((p) => p.image)}
                    activePhases={nightPair[0].activePhases}
                    cta={nightPair[0].cta}
                  />
                )}
              </div>
            );
          })()}

          <div className="mt-20 border-t border-mauve/15 pt-14 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">
              {dict.homeSections.forYou.closingEyebrow}
            </p>
            <h3 className="mx-auto mt-4 max-w-xl font-serif text-2xl leading-snug text-ink md:text-3xl">
              {dict.homeSections.forYou.closingHeadline}
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-ink/70">{dict.homeSections.forYou.closingBody}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href={`/${l}/shop`}
                className="inline-flex items-center gap-2 rounded-full bg-mauve px-7 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                {dict.homeSections.forYou.closingCtaPrimary}
              </Link>
              <Link
                href={`/${l}/regenerationscheck`}
                className="text-sm text-mauve-dark underline underline-offset-4"
              >
                {dict.homeSections.forYou.closingCtaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{ background: "color-mix(in srgb, var(--color-scroll-3) 74%, transparent)" }}
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
    </div>
  );
}
