"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Dictionary } from "@/i18n/getDictionary";

export function AddToCartButton({
  slug,
  variant,
  quantity = 1,
  dict,
}: {
  slug: string;
  variant?: string;
  quantity?: number;
  dict: Dictionary;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        add(slug, quantity, variant);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-mauve-dark px-5 py-3.5 text-sm text-white transition hover:bg-ink"
    >
      {added ? dict.shop.addedToCart : dict.shop.addToCart}
      {!added && <span aria-hidden="true">→</span>}
    </button>
  );
}
