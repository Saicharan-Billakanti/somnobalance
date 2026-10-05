"use client";

import { useCart } from "@/components/CartProvider";
import { RollOnPdp } from "@/components/lovable/RollOnPdp";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export function RollOnPdpConnected({
  lang,
  dict,
  slug,
}: {
  lang: Locale;
  dict: Dictionary;
  slug: string;
}) {
  const { add } = useCart();
  return <RollOnPdp lang={lang} dict={dict} onAddToCart={(quantity) => add(slug, quantity)} />;
}
