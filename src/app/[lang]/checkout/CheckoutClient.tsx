"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { getProduct, getProductText, getVariant, formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type Placed = { orderId: string | null; persisted: boolean };

export function CheckoutClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { lines, total, shipping, clear } = useCart();
  const [payment, setPayment] = useState<"card" | "sepa" | "paypal">("card");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grandTotal = total + shipping;

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">
          {placed.persisted ? dict.checkout.orderReceived : dict.checkout.demoCheckout}
        </h1>
        {placed.persisted && placed.orderId && (
          <p className="mt-2 text-sm text-ink/50">
            {dict.checkout.orderReference.replace("{id}", placed.orderId)}
          </p>
        )}
        <p className="mt-4 text-ink/70">{dict.checkout.demoNotice}</p>
        <Link
          href={`/${lang}/shop`}
          className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {dict.checkout.backToShop}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">{dict.checkout.emptyTitle}</h1>
        <Link href={`/${lang}/shop`} className="mt-6 inline-block text-mauve-dark underline">
          {dict.checkout.browseShop}
        </Link>
      </div>
    );
  }

  const [germanyBefore, germanyAfter] = dict.checkout.germanyOnlyNote.split("{link}");
  const [agreeBefore, agreeMid, agreeAfter] = dict.checkout.agreementNote.split(/\{termsLink\}|\{withdrawalLink\}/);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">{dict.checkout.title}</h1>
      <p className="mt-2 text-sm text-ink/50">{dict.checkout.demoEnv}</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSubmitting(true);

          const formData = new FormData(e.currentTarget);
          const payload = {
            firstName: String(formData.get("firstName") || ""),
            lastName: String(formData.get("lastName") || ""),
            email: String(formData.get("email") || ""),
            street: String(formData.get("street") || ""),
            postalCode: String(formData.get("postalCode") || ""),
            city: String(formData.get("city") || ""),
            country: String(formData.get("country") || ""),
            paymentMethod: payment.toUpperCase() as "CARD" | "SEPA" | "PAYPAL",
            items: lines.map((line) => ({
              slug: line.slug,
              qty: line.qty,
              variant: line.variant,
            })),
          };

          try {
            const res = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
              setError(data.error || dict.checkout.genericError);
              setSubmitting(false);
              return;
            }

            setPlaced({ orderId: data.id, persisted: data.persisted });
            clear();
          } catch {
            setError(dict.checkout.networkError);
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-10 grid gap-12 md:grid-cols-[1.3fr_1fr]"
      >
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-lg text-ink">{dict.checkout.contactShipping}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input required name="firstName" placeholder={dict.checkout.firstName} className="input-field" />
              <input required name="lastName" placeholder={dict.checkout.lastName} className="input-field" />
              <input
                required
                name="email"
                type="email"
                placeholder={dict.checkout.email}
                className="input-field sm:col-span-2"
              />
              <input
                required
                name="street"
                placeholder={dict.checkout.street}
                className="input-field sm:col-span-2"
              />
              <input required name="postalCode" placeholder={dict.checkout.postalCode} className="input-field" />
              <input required name="city" placeholder={dict.checkout.city} className="input-field" />
              <input
                readOnly
                name="country"
                value="Germany"
                className="input-field cursor-not-allowed bg-sand/40 text-ink/60 sm:col-span-2"
              />
              <p className="text-xs text-ink/50 sm:col-span-2">
                {germanyBefore}
                <Link href={`/${lang}/legal/shipping`} className="underline">
                  {dict.checkout.shippingPolicyLabel}
                </Link>
                {germanyAfter}
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-lg text-ink">{dict.checkout.paymentMethod}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(["card", "sepa", "paypal"] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPayment(method)}
                  className={`rounded-xl border px-4 py-3 text-sm capitalize ${
                    payment === method
                      ? "border-mauve bg-mauve/10 text-mauve-dark"
                      : "border-mauve/20 text-ink/70 hover:bg-sand"
                  }`}
                >
                  {method === "sepa" ? dict.checkout.sepa : method === "card" ? dict.checkout.card : dict.checkout.paypal}
                </button>
              ))}
            </div>

            {payment === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required placeholder={dict.checkout.cardNumber} className="input-field sm:col-span-2" />
                <input required placeholder={dict.checkout.cardExpiry} className="input-field" />
                <input required placeholder={dict.checkout.cardCvc} className="input-field" />
              </div>
            )}
            {payment === "sepa" && (
              <div className="mt-4">
                <input required placeholder={dict.checkout.iban} className="input-field w-full" />
                <p className="mt-2 text-xs text-ink/50">{dict.checkout.sepaNote}</p>
              </div>
            )}
            {payment === "paypal" && (
              <p className="mt-4 text-sm text-ink/60">{dict.checkout.paypalNote}</p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h2 className="font-serif text-lg text-ink">{dict.checkout.orderSummary}</h2>
          <div className="mt-4 space-y-3">
            {lines.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              const text = getProductText(product, lang);
              const unitPrice = product.variants
                ? getVariant(product, line.variant)?.price ?? 0
                : product.price ?? 0;
              return (
                <div
                  key={`${line.slug}:${line.variant ?? ""}`}
                  className="flex justify-between text-sm text-ink/70"
                >
                  <span>
                    {text.name}
                    {line.variant ? ` (${line.variant})` : ""} × {line.qty}
                  </span>
                  <span>{formatPrice(unitPrice * line.qty)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 border-t border-mauve/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>{dict.checkout.subtotal}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>{dict.checkout.shipping}</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium text-mauve-dark">
              <span>{dict.checkout.total}</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-mauve py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
          >
            {submitting ? dict.checkout.placingOrder : dict.checkout.placeOrder}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-ink/40">
            {agreeBefore}
            <Link href={`/${lang}/legal/terms`} className="underline">
              {dict.checkout.termsLabel}
            </Link>
            {agreeMid}
            <Link href={`/${lang}/legal/withdrawal`} className="underline">
              {dict.checkout.withdrawalLabel}
            </Link>
            {agreeAfter}
          </p>
        </aside>
      </form>
    </div>
  );
}
