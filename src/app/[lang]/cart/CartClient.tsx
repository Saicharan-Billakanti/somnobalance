"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { getProduct, getVariant, formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function CartClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { lines, setQty, remove, total } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">{dict.cart.emptyTitle}</h1>
        <p className="mt-3 text-ink/60">{dict.cart.emptyCopy}</p>
        <Link
          href={`/${lang}/shop`}
          className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {dict.cart.browseShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">{dict.cart.title}</h1>

      <div className="mt-10 divide-y divide-mauve/10">
        {lines.map((line) => {
          const product = getProduct(line.slug);
          if (!product) return null;
          const unitPrice = product.variants
            ? getVariant(product, line.variant)?.price ?? 0
            : product.price ?? 0;
          return (
            <div key={`${line.slug}:${line.variant ?? ""}`} className="flex items-center gap-4 py-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-ink">{product.name}</div>
                {line.variant && <div className="text-xs text-ink/50">{line.variant}</div>}
                <div className="mt-1 text-sm text-ink/60">{formatPrice(unitPrice)}</div>
              </div>
              <input
                type="number"
                min={1}
                value={line.qty}
                onChange={(e) => setQty(line.slug, Number(e.target.value), line.variant)}
                className="w-16 rounded-lg border border-mauve/20 px-2 py-1 text-center"
              />
              <div className="w-24 text-right font-medium text-ink">
                {formatPrice(unitPrice * line.qty)}
              </div>
              <button
                onClick={() => remove(line.slug, line.variant)}
                className="text-sm text-ink/40 hover:text-ink"
                aria-label={`${dict.cart.remove} ${product.name}`}
              >
                {dict.cart.remove}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-mauve/10 pt-6">
        <div>
          <div className="text-sm text-ink/60">{dict.cart.subtotal}</div>
          <div className="text-2xl font-medium text-mauve-dark">{formatPrice(total)}</div>
        </div>
        <Link
          href={`/${lang}/checkout`}
          className="rounded-full bg-mauve px-8 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {dict.cart.checkout}
        </Link>
      </div>
    </div>
  );
}
