"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Dictionary } from "@/i18n/getDictionary";

export function AddToCartButton({
  slug,
  variant,
  qty = 1,
  dict,
}: {
  slug: string;
  variant?: string;
  qty?: number;
  dict: Dictionary;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        add(slug, qty, variant);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className="rounded-full bg-mauve px-8 py-3 text-sm text-white transition hover:bg-mauve-dark"
    >
      {added ? dict.shop.addedToCart : dict.shop.addToCart}
    </button>
  );
}
