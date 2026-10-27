"use client";

import { useEffect, useState } from "react";
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
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const confirmPayment = async () => {
      if (!orderId) {
        setCheckingPayment(false);
        return;
      }

      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
          const order = await response.json();
          if (response.ok && order.status === "PAID") {
            if (!cancelled) {
              clear();
              setPaymentConfirmed(true);
              setCheckingPayment(false);
            }
            return;
          }
        } catch {
          // Check briefly again in case Stripe or the webhook is still settling.
        }

        if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (!cancelled) setCheckingPayment(false);
    };

    void confirmPayment();
    return () => {
      cancelled = true;
    };
    // Clear the cart only once after the server confirms payment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-serif text-2xl text-ink">
        {checkingPayment
          ? (lang === "de" ? "Zahlung wird bestätigt…" : "Confirming your payment…")
          : paymentConfirmed
            ? dict.checkout.orderReceived
            : (lang === "de" ? "Zahlung noch nicht bestätigt" : "Payment not confirmed yet")}
      </h1>
      {paymentConfirmed && orderId && (
        <p className="mt-2 text-sm text-ink/50">{dict.checkout.orderReference.replace("{id}", orderId)}</p>
      )}
      <p className="mt-4 text-ink/70">
        {checkingPayment
          ? (lang === "de" ? "Bitte warten Sie, während wir den Zahlungsstatus prüfen." : "Please wait while we check the payment status.")
          : paymentConfirmed
            ? dict.checkout.paymentSuccessNotice
            : (lang === "de"
                ? "Wir konnten Ihre Zahlung noch nicht bestätigen. Ihr Warenkorb wurde nicht geleert. Bitte prüfen Sie Ihre Bestellung später oder versuchen Sie es erneut."
                : "We could not confirm your payment yet. Your cart has been kept. Check your order later or try again.")}
      </p>
      <Link
        href={paymentConfirmed ? `/${lang}/shop` : `/${lang}/checkout`}
        className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
      >
        {paymentConfirmed ? dict.checkout.backToShop : dict.checkout.backToCheckout}
      </Link>
    </div>
  );
}
