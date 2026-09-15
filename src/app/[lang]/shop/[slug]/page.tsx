import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getProductText, products } from "@/lib/products";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
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

  // Only the Roll-on has real, distinct additional angles today — every
  // other product shows just its one real photo rather than faking a
  // gallery by repeating the same image as if it were different angles.
  const galleryImages =
    product.slug === "somnobalance-roll-on"
      ? [product.image, "/products/lavender_flowers.png", "/products/grapefruit_herbs.png"]
      : [product.image];

  return (
    <div className="w-full pb-20">
      <div className="mx-auto max-w-[1100px] px-4 pt-12 pb-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <ProductGallery
            images={galleryImages}
            alt={text.name}
            overlay={
              product.slug === "somnobalance-roll-on" ? (
                <div className="absolute left-8 top-1/2 hidden max-w-[140px] -translate-y-1/2 text-ink sm:block">
                  <p className="text-[11px] font-medium uppercase leading-loose tracking-[0.2em]">
                    {dict.shop.rollOnGalleryTagline}
                  </p>
                  <div className="mt-4 h-[1px] w-8 bg-ink" />
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
          <h1 className="mt-4 font-serif text-4xl text-ink tracking-tight">{text.name}</h1>
          <p className="mt-4 text-lg text-ink/70 max-w-sm">{text.tagline}</p>

          <ProductPurchasePanel
            product={{ slug: product.slug, price: product.price, variants: product.variants }}
            dict={dict}
          />

        {text.specs && (
            <div className="mt-6 mb-8">
              <ProductSpecRow specs={text.specs} />
            </div>
          )}

          <div className="text-sm leading-relaxed text-ink/80 pr-4 mb-10">
            <p>{text.description}</p>
          </div>

          <div className="mt-10">
            <Accordion
              items={[
                {
                  title: dict.shop.productInfo,
                  content: (
                    <div>
                      <ul className="space-y-2">
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
    </div>

      {related.length > 0 && (
        <div 
          className="mt-16 w-full py-20 rounded-t-3xl border-t border-[#e8dfcf]"
          style={{ backgroundImage: 'url(/brand/related-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">{dict.shop.ritualCompanions}</p>
                <h2 className="mt-3 font-serif text-3xl text-ink tracking-tight">{dict.shop.youMightAlsoLike}</h2>
              </div>
              <Link
                href={`/${l}/shop`}
                className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink transition"
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
