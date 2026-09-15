"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice, getDisplayPrice, getProductText } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
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
  const { add } = useCart();
  const href = `/${lang}/shop/${product.slug}`;

  return (
    <div className="group">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-white/50">
        <Image
          src={product.image}
          alt={text.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.1em] text-ink/70">
          {dict.shop.categories[product.category]}
        </span>
      </Link>

      <div className="pt-4">
        <Link href={href}>
          <h3 className="font-serif text-lg text-ink group-hover:text-mauve-dark">{text.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/60">{text.tagline}</p>
        </Link>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="text-sm text-ink/50">
            {fromPrice && <span>{dict.shop.from} </span>}
            {formatPrice(price)} <span className="text-ink/35">{dict.shop.inclVat}</span>
          </div>
          {product.variants ? (
            <Link
              href={href}
              aria-label={text.name}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mauve-dark text-white transition hover:bg-ink"
            >
              <ArrowIcon />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => add(product.slug, 1)}
              aria-label={dict.shop.addToCart}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mauve-dark text-white transition hover:bg-ink"
            >
              <CartIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
