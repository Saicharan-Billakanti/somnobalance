import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct, getProductText, products } from "@/lib/products";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { CyclePosition } from "@/components/CyclePosition";
import { Accordion } from "@/components/Accordion";
import { ProductSpecRow } from "@/components/ProductSpecRow";
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

  const [before, after] = dict.shop.withdrawalNote.split("{link}");

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
          <Image
            src={product.image}
            alt={text.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-teal-dark">
            {dict.shop.categories[product.category]}
            {" — "}
            {dict.shop.phases[product.phase]}
          </div>
          <div className="mt-2">
            <CyclePosition phase={product.phase} stages={dict.home.cycle} />
          </div>
          <h1 className="mt-3 font-serif text-3xl text-ink">{text.name}</h1>
          <p className="mt-3 text-lg text-ink/70">{text.tagline}</p>

          <ProductPurchasePanel
            product={{ slug: product.slug, price: product.price, variants: product.variants }}
            dict={dict}
          />

          {text.specs && (
            <div className="mt-6">
              <ProductSpecRow specs={text.specs} />
            </div>
          )}

          <div className="mt-10">
            <Accordion
              items={[
                {
                  title: dict.shop.productInfo,
                  content: (
                    <div>
                      <p className="leading-relaxed">{text.description}</p>
                      <ul className="mt-4 space-y-2">
                        {text.details.map((d) => (
                          <li key={d} className="flex gap-2">
                            <span className="text-teal-dark">—</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
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
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">{dict.shop.ritualCompanions}</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{dict.shop.youMightAlsoLike}</h2>
            </div>
            <Link
              href={`/${l}/shop`}
              className="inline-flex items-center gap-2 text-sm text-mauve-dark hover:underline"
            >
              {dict.shop.viewAllProducts}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} lang={l} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
