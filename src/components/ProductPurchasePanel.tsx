"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

type PurchaseInfo = Pick<
  Product,
  "slug" | "price" | "variants" | "returnPeriodDays" | "refundPolicy" | "refundRules" | "maxRetailQuantity"
>;

export function ProductPurchasePanel({
  product,
  dict,
  lang = "en",
}: {
  product: PurchaseInfo;
  dict: Dictionary;
  lang?: Locale | string;
}) {
  const [selected, setSelected] = useState<string | undefined>(product.variants?.[0]?.label);
  const [qty, setQty] = useState<number>(1);

  const variant = product.variants
    ? (product.variants.find((v) => v.label === selected) ?? product.variants[0])
    : null;
  const price = variant ? variant.price : (product.price ?? 0);
  const variantNotes: Record<string, string> = dict.shop.variantNotes;

  const maxRetailLimit = product.maxRetailQuantity || 10;
  const isVolumeOrder = qty >= maxRetailLimit;

  return (
    <div className="space-y-6">
      {product.variants && (
        <div className="mt-2">
          <div className="text-sm font-medium text-ink">{dict.shop.size}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setSelected(v.label)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  selected === v.label
                    ? "border-mauve bg-mauve/10 font-medium text-mauve-dark"
                    : "border-mauve/20 text-ink/70 hover:bg-sand"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          {variant?.priceNote && (
            <p className="mt-2 text-xs text-teal-dark">{variantNotes[variant.priceNote] ?? variant.priceNote}</p>
          )}
        </div>
      )}

      {/* Price & Quantity Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div>
          <div className="font-serif text-2xl font-bold text-mauve-dark">
            {formatPrice(price * qty)}
            <span className="ml-2 text-xs font-normal text-ink/40">{dict.shop.inclVatShipping}</span>
          </div>
          {qty > 1 && (
            <div className="mt-0.5 text-xs text-ink/50">
              {qty} × {formatPrice(price)}
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center rounded-full border border-mauve/20 bg-sand/30 p-1">
          <button
            type="button"
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="shadow-xs flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-ink/70 transition hover:bg-sand"
            aria-label="Decrease quantity"
          >
            –
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 bg-transparent text-center text-sm font-bold text-ink focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQty((prev) => prev + 1)}
            className="shadow-xs flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-ink/70 transition hover:bg-sand"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* B2B / Business Volume Discount Prompt */}
      {isVolumeOrder && (
        <div className="animate-fade-in rounded-2xl border border-amber-300 bg-amber-50/70 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="space-y-1 text-xs">
              <div className="font-bold text-amber-950">Ordering in bulk ({qty} units)? Get Business Discounts!</div>
              <p className="leading-relaxed text-amber-900/80">
                Hotels, clinics, yoga studios, and corporate practices unlock <strong>15% to 30% OFF</strong> and
                custom tax invoicing via our B2B program.
              </p>
              <div className="pt-1.5">
                <Link
                  href={`/${lang}/for-business`}
                  className="inline-flex items-center gap-1 font-bold text-teal-dark hover:underline"
                >
                  Switch to Business Portal & Unlock Wholesale Pricing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add To Cart */}
      <div>
        <AddToCartButton slug={product.slug} variant={selected} qty={qty} dict={dict} />
      </div>

      {/* Return Policy & Seal Breakage Rule Guarantee Box */}
      <div className="space-y-2 rounded-2xl border border-mauve/15 bg-sand/30 p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-teal-dark">
            {product.refundPolicy || `${product.returnPeriodDays || 30}-Day Money-Back Guarantee`}
          </span>
          <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal-dark">
            {product.returnPeriodDays || 30} Days Return
          </span>
        </div>

        <div className="border-t border-mauve/10 pt-1 text-[11px] leading-relaxed text-ink/70">
          <strong className="font-semibold text-ink">Return & Refund Condition:</strong>{" "}
          {product.refundRules || "Hygienic seal must be intact upon return; items must be in original unsoiled packaging."}
        </div>
      </div>
    </div>
  );
}
