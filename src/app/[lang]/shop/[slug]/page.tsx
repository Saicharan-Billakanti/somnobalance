import { notFound } from "next/navigation";
import { getProduct, getProductText, products } from "@/lib/products";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductGallery } from "@/components/ProductGallery";
import { Accordion } from "@/components/Accordion";
import { ProductSpecRow } from "@/components/ProductSpecRow";
import { RollOnPdpConnected } from "@/components/lovable/RollOnPdpConnected";
import { ProductSystemPageConnected } from "@/components/lovable/ProductSystemPageConnected";
import { hasProductSystemConfig } from "@/components/lovable/productSystemConfigs";
import { getDictionary } from "@/i18n/getDictionary";
import { locales, isLocale, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    products.map((p) => ({ lang, slug: p.slug })),
  );
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

  if (product.slug === "somnobalance-roll-on") {
    return <RollOnPdpConnected lang={l} dict={dict} slug={product.slug} />;
  }

  if (hasProductSystemConfig(product.slug)) {
    return (
      <ProductSystemPageConnected lang={l} dict={dict} product={product} />
    );
  }

  const [before, after] = dict.shop.withdrawalNote.split("{link}");

  return (
    <div
      className="relative animate-leaf-drift"
      style={{
        backgroundImage: "url('/brand/related-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="relative mx-auto max-w-[1100px] px-4 pt-12 pb-16 sm:px-6"
        style={{
          background:
            "color-mix(in srgb, var(--color-offwhite) 74%, transparent)",
        }}
      >
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="min-w-0">
            <ProductGallery images={[product.image]} alt={text.name} />
          </div>

          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60">
              {dict.shop.categories[product.category]}
              {" — "}
              {dict.shop.phases[product.phase]}
            </div>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">
              {text.name}
            </h1>
            <p className="mt-4 max-w-sm text-lg text-ink/70">{text.tagline}</p>

            <ProductPurchasePanel
              product={{
                slug: product.slug,
                price: product.price,
                variants: product.variants,
                returnPeriodDays: product.returnPeriodDays,
                refundPolicy: product.refundPolicy,
                refundRules: product.refundRules,
                maxRetailQuantity: product.maxRetailQuantity,
              }}
              dict={dict}
              lang={l}
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
                          content: (
                            <p className="leading-relaxed">
                              {text.ingredients}
                            </p>
                          ),
                        },
                      ]
                    : []),
                  {
                    title: dict.shop.shippingReturns,
                    content: (
                      <p className="leading-relaxed">
                        {before}
                        <a
                          href={`/${lang}/legal/withdrawal`}
                          className="underline"
                        >
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
    </div>
  );
}
