import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return { title: dict.forMe.meta };
}

export default async function ForMePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;
  const f = dict.forMe;

  return (
    <div>
      {/* 1 · Hero — light editorial start, no shop banner */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-1) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{f.hero.eyebrow}</p>
          <div className="mt-5 flex flex-col gap-10 md:flex-row md:items-start md:justify-between lg:gap-20">
            <h1 className="font-serif text-4xl leading-[1.1] text-ink md:w-1/2 md:text-5xl lg:text-6xl">
              {f.hero.headline}
            </h1>
            <div className="md:w-5/12 md:pt-3">
              <div className="space-y-5 text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
                <p>{f.hero.p1}</p>
                <p>{f.hero.p2}</p>
              </div>
              <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Link
                  href={`/${l}/regenerationscheck`}
                  className="inline-flex items-center bg-mauve px-8 py-3.5 text-sm text-white transition-colors hover:bg-mauve-dark"
                >
                  {f.hero.primary}
                </Link>
                <Link
                  href={`/${l}/concept`}
                  className="text-sm text-mauve-dark underline underline-offset-4 hover:opacity-80"
                >
                  {f.hero.secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Wiedererkennen — calm text tiles, no symptom lists */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-2) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{f.recognition.eyebrow}</p>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:justify-between lg:gap-20">
            <h2 className="font-serif text-3xl leading-tight text-ink md:w-1/2 md:text-4xl lg:text-5xl">
              {f.recognition.headline}
            </h2>
            <p className="text-base leading-relaxed text-ink/70 md:w-5/12 md:pt-3 lg:text-lg lg:leading-loose">
              {f.recognition.intro}
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {f.recognition.items.map((item) => (
              <div key={item.quote} className="flex flex-col bg-white p-8 shadow-sm lg:p-10">
                <p className="font-serif text-xl italic leading-snug text-ink">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-6 text-sm leading-relaxed text-ink/70 lg:text-base">{item.reflection}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Die vier Phasen im Alltag — situation → action, not the Konzept explainer */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{f.phases.eyebrow}</p>
          <h2 className="mt-5 max-w-3xl font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
            {f.phases.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 lg:text-lg">{f.phases.intro}</p>

          <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
            {f.phases.items.map((phase) => (
              <article key={phase.name} className="grid gap-4 py-9 md:grid-cols-[14rem_1fr] md:gap-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mauve">{phase.name}</p>
                <div>
                  <h3 className="font-serif text-2xl italic leading-snug text-ink">{phase.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/70">{phase.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Persönliche Regenerationsroutine — four quiet stations, day light → evening */}
      <section
        className="px-4 py-20 sm:px-6 sm:py-28"
        style={{
          background:
            "linear-gradient(180deg, var(--color-circuit-regulate) 0%, var(--color-circuit-letgo) 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{f.routine.eyebrow}</p>
          <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
            {f.routine.headline}
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {f.routine.stations.map((station) => (
              <div key={station.label} className="border-t border-ink/25 pt-5">
                <h3 className="font-serif text-xl text-ink">{station.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{station.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Passende Begleiter — max. four groups, original product photos only */}
      <section className="bg-offwhite px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{f.companions.eyebrow}</p>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:justify-between lg:gap-20">
            <h2 className="font-serif text-3xl leading-tight text-ink md:w-1/2 md:text-4xl lg:text-5xl">
              {f.companions.headline}
            </h2>
            <p className="text-base leading-relaxed text-ink/70 md:w-5/12 md:pt-3 lg:text-lg">{f.companions.body}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dict.homeSections.forYou.tiles.map((tile) => (
              <Link
                key={tile.slug}
                href={`/${l}/shop/${tile.slug}`}
                className="group flex flex-col bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                {/* whole product visible, contained on white */}
                <div className="relative aspect-[4/3] w-full border-b border-ink/5 bg-white">
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="p-5 font-serif text-xl font-normal leading-snug text-ink">{tile.title}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href={`/${l}/shop`}
              className="inline-flex items-center bg-mauve px-8 py-3.5 text-sm text-white transition-colors hover:bg-mauve-dark"
            >
              {f.companions.button}
            </Link>
          </div>
        </div>
      </section>

      {/* 6 · Abschluss — calm close, no extra product wall */}
      <section
        className="px-4 py-20 text-center sm:px-6 sm:py-28"
        style={{ background: "color-mix(in srgb, var(--color-scroll-3) 74%, transparent)" }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{f.next.eyebrow}</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">{f.next.headline}</h2>
          <p className="mt-6 text-base leading-relaxed text-ink/70 lg:text-lg">{f.next.body}</p>
          <Link
            href={`/${l}/regenerationscheck`}
            className="mt-10 inline-flex items-center bg-mauve px-8 py-3.5 text-sm text-white transition-colors hover:bg-mauve-dark"
          >
            {f.next.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
