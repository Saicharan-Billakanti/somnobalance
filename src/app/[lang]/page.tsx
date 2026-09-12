import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { CycleStrip } from "@/components/CycleStrip";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 text-center sm:px-6 sm:pt-28">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.home.eyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight text-ink md:text-5xl">
            {dict.home.title}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            {dict.home.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
        </div>

        <CycleStrip label={dict.home.cycleLabel} stages={dict.home.cycle} />
      </section>

      <section
        className="py-16"
        style={{ background: "var(--color-scroll-1)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-ink">{dict.home.systemTitle}</h2>
          <p className="mt-3 max-w-2xl text-ink/70">{dict.home.systemSubtitle}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.phases.map((phase) => (
              <div key={phase.name} className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
                <div className="text-xs font-semibold tracking-[0.15em] text-teal-dark">
                  {phase.name}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{phase.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{ background: "var(--color-scroll-2)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-ink">{dict.home.fromShop}</h2>
            <Link href={`/${l}/shop`} className="text-sm text-mauve-dark hover:underline">
              {dict.home.viewAll}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} lang={l} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{ background: "var(--color-scroll-3)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 rounded-3xl bg-white/50 p-10 md:grid-cols-3">
            <Link href={`/${l}/for-me`} className="group">
              <h3 className="font-serif text-lg text-mauve-dark">{dict.home.forMeTitle}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.home.forMeCopy}</p>
              <span className="mt-3 inline-block text-sm text-teal-dark group-hover:underline">
                {dict.home.discover}
              </span>
            </Link>
            <Link href={`/${l}/for-business`} className="group">
              <h3 className="font-serif text-lg text-mauve-dark">{dict.home.forBusinessTitle}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.home.forBusinessCopy}</p>
              <span className="mt-3 inline-block text-sm text-teal-dark group-hover:underline">
                {dict.home.discover}
              </span>
            </Link>
            <Link href={`/${l}/partner`} className="group">
              <h3 className="font-serif text-lg text-mauve-dark">{dict.home.partnerTitle}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.home.partnerCopy}</p>
              <span className="mt-3 inline-block text-sm text-teal-dark group-hover:underline">
                {dict.home.discover}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
