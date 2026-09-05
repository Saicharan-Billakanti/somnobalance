"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ slug, variant }: { slug: string; variant?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        add(slug, 1, variant);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className="rounded-full bg-mauve px-8 py-3 text-sm text-white transition hover:bg-mauve-dark"
    >
      {added ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}
