import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice, getDisplayPrice, getProductText } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

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
      className="group block overflow-hidden rounded-2xl border border-mauve/10 bg-white/60 transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={text.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="text-xs uppercase tracking-wide text-teal-dark">
          {dict.shop.categories[product.category]}
        </div>
        <h3 className="mt-1 font-serif text-lg text-ink group-hover:text-mauve-dark">
          {text.name}
        </h3>
        <p className="mt-1 text-sm text-ink/60">{text.tagline}</p>
        <div className="mt-3 text-sm font-medium text-mauve-dark">
          {fromPrice && <span className="font-normal text-ink/60">{dict.shop.from} </span>}
          {formatPrice(price)} <span className="font-normal text-ink/40">{dict.shop.inclVat}</span>
        </div>
      </div>
    </Link>
  );
}
