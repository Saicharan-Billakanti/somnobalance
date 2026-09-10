import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Blobs, PageEyebrow, RingMotif } from "@/components/Decor";

export const metadata = { title: "Shop — SomnoBalance" };

export default async function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const l = lang as Locale;

  return (
    <div className="relative overflow-hidden">
      <Blobs />
      <RingMotif className="-right-40 top-0 opacity-50" tone="teal" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <PageEyebrow>{dict.shop.eyebrow}</PageEyebrow>
        <h1 className="mt-5 font-serif text-3xl text-ink md:text-4xl">{dict.shop.title}</h1>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-teal to-mauve" />
        <p className="mt-6 max-w-2xl text-ink/70">{dict.shop.intro}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} lang={l} dict={dict} />
          ))}
        </div>
      </div>
    </div>
  );
}
