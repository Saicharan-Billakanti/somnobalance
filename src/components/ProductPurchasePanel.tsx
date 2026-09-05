"use client";

import { useState } from "react";
import { Product, formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

// Only the fields this client component actually needs — not the full
// Product. Passing the whole object would serialize internal-only fields
// (legalNote, etc.) into the page's hydration payload even though nothing
// renders them, so we trim it at the boundary instead.
type PurchaseInfo = Pick<Product, "slug" | "price" | "variants">;

export function ProductPurchasePanel({ product }: { product: PurchaseInfo }) {
  const [selected, setSelected] = useState<string | undefined>(product.variants?.[0]?.label);
  const variant = product.variants
    ? product.variants.find((v) => v.label === selected) ?? product.variants[0]
    : null;
  const price = variant ? variant.price : product.price ?? 0;

  return (
    <div>
      {product.variants && (
        <div className="mt-2">
          <div className="text-sm font-medium text-ink">Size</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setSelected(v.label)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  selected === v.label
                    ? "border-mauve bg-mauve/10 text-mauve-dark"
                    : "border-mauve/20 text-ink/70 hover:bg-sand"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          {variant?.priceNote && (
            <p className="mt-2 text-xs text-teal-dark">{variant.priceNote}</p>
          )}
        </div>
      )}

      <div className="mt-6 text-2xl font-medium text-mauve-dark">
        {formatPrice(price)}
        <span className="ml-2 text-sm font-normal text-ink/40">incl. VAT, plus shipping</span>
      </div>

      <div className="mt-8">
        <AddToCartButton slug={product.slug} variant={selected} />
      </div>
    </div>
  );
}
