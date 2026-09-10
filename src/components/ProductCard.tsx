import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice, getDisplayPrice, getProductText } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

const PHASE_BADGE: Record<Product["phase"], string> = {
  REGULATE: "bg-teal/90 text-white",
  "LET GO": "bg-mauve/90 text-white",
  PREPARE: "bg-ink/80 text-white",
  REGENERATE: "bg-teal-dark/90 text-white",
};

const CATEGORY_DOT: Record<Product["category"], string> = {
  Sleep: "bg-ink/50",
  Ritual: "bg-mauve",
  Care: "bg-teal",
};

export function ProductCard({
  product,
  lang,
  dict,
}: {
  product: Product;
  lang: Locale;
  dict: Dictionary;
}) {
  const { price, fromPrice } = getDisplayPrice(product);
  const text = getProductText(product, lang);

  return (
    <Link
      href={`/${lang}/shop/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-mauve/10 bg-white/60 transition duration-300 hover:-translate-y-1 hover:border-mauve/25 hover:shadow-[0_20px_40px_-20px_rgba(111,87,132,0.4)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={text.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur ${PHASE_BADGE[product.phase]}`}
        >
          {dict.shop.phases[product.phase]}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink/50">
          <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[product.category]}`} />
          {dict.shop.categories[product.category]}
        </div>
        <h3 className="mt-1 font-serif text-lg text-ink group-hover:text-mauve-dark">
          {text.name}
        </h3>
        <p className="mt-1 text-sm text-ink/60">{text.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-medium text-mauve-dark">
            {fromPrice && <span className="font-normal text-ink/60">{dict.shop.from} </span>}
            {formatPrice(price)} <span className="font-normal text-ink/40">{dict.shop.inclVat}</span>
          </div>
          <span className="text-teal-dark opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
