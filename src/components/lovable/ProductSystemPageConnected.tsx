"use client";

import { useCart } from "@/components/CartProvider";
import { ProductSystemPage } from "@/components/lovable/ProductSystemPage";
import { productSystemConfigs } from "@/components/lovable/productSystemConfigs";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/products";

// Looks up the config client-side (rather than receiving it as a prop from
// the server component) because ProductSystemConfig holds lucide-react icon
// components — functions can't cross the server/client boundary as props.
export function ProductSystemPageConnected({
  lang,
  dict,
  product,
}: {
  lang: Locale;
  dict: Dictionary;
  product: Product;
}) {
  const { add } = useCart();
  const config = productSystemConfigs[product.slug];
  if (!config) return null;

  return (
    <ProductSystemPage
      lang={lang}
      dict={dict}
      product={product}
      config={config}
      onAddToCart={(quantity, variant) => add(product.slug, quantity, variant)}
    />
  );
}
