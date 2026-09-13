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
    <Link href={`/${lang}/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/50">
        <Image
          src={product.image}
          alt={text.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="pt-4">
        <div className="text-[0.7rem] uppercase tracking-[0.15em] text-teal-dark/80">
          {dict.shop.categories[product.category]}
        </div>
        <h3 className="mt-1.5 font-serif text-lg text-ink group-hover:text-mauve-dark">
          {text.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">{text.tagline}</p>
        <div className="mt-2.5 text-sm text-ink/50">
          {fromPrice && <span>{dict.shop.from} </span>}
          {formatPrice(price)} <span className="text-ink/35">{dict.shop.inclVat}</span>
        </div>
      </div>
    </Link>
  );
}
