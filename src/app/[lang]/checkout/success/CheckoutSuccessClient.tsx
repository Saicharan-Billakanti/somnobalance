"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function CheckoutSuccessClient({
  lang,
  dict,
  orderId,
}: {
  lang: Locale;
  dict: Dictionary;
  orderId: string | null;
}) {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-serif text-2xl text-ink">{dict.checkout.orderReceived}</h1>
      {orderId && (
        <p className="mt-2 text-sm text-ink/50">{dict.checkout.orderReference.replace("{id}", orderId)}</p>
      )}
      <p className="mt-4 text-ink/70">{dict.checkout.paymentSuccessNotice}</p>
      <Link
        href={`/${lang}/shop`}
        className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
      >
        {dict.checkout.backToShop}
      </Link>
    </div>
  );
}
