import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct, getProductText, products } from "@/lib/products";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Accordion } from "@/components/Accordion";
import { ProductSpecRow } from "@/components/ProductSpecRow";
import { SoundPanel } from "@/components/SoundPanel";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, isLocale, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const product = getProduct(slug);
  if (!product) notFound();
  const text = getProductText(product, lang);
  const l = lang as Locale;
  const isRollOn = product.slug === "somnobalance-roll-on";

  const [before, after] = dict.shop.withdrawalNote.split("{link}");

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  // The Roll-on ships with a full AI-rendered visual set (placeholder art,
  // not real photography — swap for real product photos once available).
  // Every other product just shows its one real photo, no fake gallery.
  const galleryImages = isRollOn
    ? [
        "/products/pdp-roll-on-main.jpg",
        "/products/pdp-roll-on-flatlay.jpg",
        "/products/pdp-roll-on-hand.jpg",
        "/products/pdp-roll-on-details.jpg",
      ]
    : [product.image];

  return (
    <div className="w-full pb-20">
      <div className="mx-auto max-w-[1100px] px-4 pt-12 pb-16 sm:px-6">
        <div className={`grid gap-12 lg:gap-16 ${isRollOn ? "lg:grid-cols-[1.35fr_1fr_0.6fr]" : "lg:grid-cols-[1.1fr_1fr]"}`}>
          <div>
            <ProductGallery
              images={galleryImages}
              alt={text.name}
              overlay={
                isRollOn ? (
                  <div className="absolute bottom-10 left-8 hidden max-w-[140px] text-ink sm:block">
                    <p className="text-[11px] font-medium uppercase leading-loose tracking-[0.2em]">
                      {dict.shop.rollOnGalleryTagline.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                    <span className="mt-4 block h-px w-9 bg-ink" />
                  </div>
                ) : undefined
              }
            />
          </div>

          <div className="lg:py-8 lg:pl-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
              {dict.shop.categories[product.category]}
              {" — "}
              {dict.shop.phases[product.phase]}
            </div>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">{text.name}</h1>
            <p className="mt-4 max-w-sm text-lg text-ink/70">{text.tagline}</p>

            <ProductPurchasePanel
              product={{ slug: product.slug, price: product.price, variants: product.variants }}
              dict={dict}
            />

            {text.specs && (
              <div className="mb-8 mt-6">
                <ProductSpecRow specs={text.specs} />
              </div>
            )}

            <div className="mb-10 pr-4 text-sm leading-relaxed text-ink/80">
              <p>{text.description}</p>
            </div>

            <div className="mt-10">
              <Accordion
                items={[
                  {
                    title: dict.shop.productInfo,
                    content: (
                      <ul className="space-y-2">
                        {text.details.map((d) => (
                          <li key={d} className="flex gap-2">
                            <span className="text-teal-dark">—</span> {d}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  ...(text.ingredients
                    ? [
                        {
                          title: dict.shop.ingredients,
                          content: <p className="leading-relaxed">{text.ingredients}</p>,
                        },
                      ]
                    : []),
                  {
                    title: dict.shop.shippingReturns,
                    content: (
                      <p className="leading-relaxed">
                        {before}
                        <a href={`/${lang}/legal/withdrawal`} className="underline">
                          {dict.shop.withdrawalLinkLabel}
                        </a>
                        {after}
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {isRollOn && (
            <SoundPanel title={dict.shop.soundTitle} intro={dict.shop.soundIntro} quote={dict.shop.soundQuote} />
          )}
        </div>
      </div>

      {isRollOn && (
        <section className="border-y border-mauve/10 bg-sand/35 py-8">
          <div className="mx-auto grid max-w-[1100px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[280px_1fr_180px]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-ink/60">{dict.shop.howToUseEyebrow}</p>
              <span className="mt-4 block h-px w-8 bg-mauve-dark" />
              <h2 className="mt-8 text-3xl leading-tight text-ink md:text-4xl">
                {dict.shop.howToUseTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </h2>
            </div>
            <div>
              <div className="aspect-[2.15/1] overflow-hidden rounded-sm">
                <Image
                  src="/products/pdp-roll-on-rituals.jpg"
                  alt=""
                  width={1600}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 pt-3 text-[9px] text-ink/80 sm:text-[11px]">
                {dict.shop.howToUseSteps.map((label, i) => (
                  <span key={label}>
                    <b className="mr-2 font-normal underline underline-offset-8">0{i + 1}</b>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <p className="border-l border-mauve/10 pl-8 font-serif text-xl leading-tight text-ink">
              {dict.shop.howToUseNote.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </section>
      )}

      {isRollOn && (
        <section className="mx-auto grid max-w-[1100px] lg:grid-cols-[0.9fr_1.05fr_0.75fr]">
          <div className="relative min-h-[420px]">
            <Image src="/products/pdp-roll-on-details.jpg" alt="" fill className="object-cover" />
          </div>
          <div className="px-7 py-12 md:px-12">
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink/60">{dict.shop.productDetailsEyebrow}</p>
            <span className="mt-4 block h-px w-8 bg-mauve-dark" />
            <ul className="mt-6 space-y-7 text-xs leading-5 text-ink/80">
              {text.details.map((d) => (
                <li key={d} className="flex gap-5">
                  <span className="text-teal-dark">—</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l border-mauve/10 px-7 py-12">
            {text.ingredients && (
              <div className="rounded-md border border-mauve/10 bg-white/60 p-6">
                <p className="text-[9px] uppercase tracking-[0.18em] text-ink">{dict.shop.ingredients}</p>
                <p className="mt-5 text-[10px] leading-5 text-ink/60">{text.ingredients}</p>
              </div>
            )}
            <p className="mt-16 text-[10px] leading-5 text-ink/60">
              {before}
              <a href={`/${lang}/legal/withdrawal`} className="underline">
                {dict.shop.withdrawalLinkLabel}
              </a>
              {after}
            </p>
          </div>
        </section>
      )}

      {isRollOn && (
        <section className="relative flex min-h-[285px] items-center overflow-hidden">
          <Image src="/brand/pdp-bedroom.jpg" alt="" fill className="object-cover" />
          <div className="relative z-10 px-8 text-white md:px-16">
            <h2 className="text-4xl">SomnoBalance</h2>
            <p className="mt-2 text-[11px] uppercase leading-6 tracking-[0.25em]">
              {dict.shop.closingTagline.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <span className="mt-4 block h-px w-9 bg-current" />
          </div>
          <p className="absolute right-[12%] top-1/2 z-10 -translate-y-1/2 rotate-[-10deg] font-serif text-2xl italic text-white/80">
            {dict.shop.closingNote.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </section>
      )}

      {related.length > 0 && (
        <div className="mt-16 w-full rounded-t-3xl border-t border-mauve/10 bg-sand/35 py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
                  {dict.shop.ritualCompanions}
                </p>
                <h2 className="mt-3 font-serif text-3xl tracking-tight text-ink">{dict.shop.youMightAlsoLike}</h2>
              </div>
              <Link
                href={`/${l}/shop`}
                className="inline-flex items-center gap-2 text-sm text-ink/70 transition hover:text-ink"
              >
                {dict.shop.viewAllProducts}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} lang={l} dict={dict} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
