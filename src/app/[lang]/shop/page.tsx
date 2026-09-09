import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Shop — SomnoBalance" };

export default async function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.shop.eyebrow}</p>
      <h1 className="mt-3 font-serif text-3xl text-ink">{dict.shop.title}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{dict.shop.intro}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} lang={l} dict={dict} />
        ))}
      </div>
    </div>
  );
}
