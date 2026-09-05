"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { getProduct, getVariant, formatPrice } from "@/lib/products";

type Placed = { orderId: string | null; persisted: boolean };

export default function CheckoutPage() {
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
          {placed.persisted ? "Order received" : "This was a demo checkout"}
        </h1>
        {placed.persisted && placed.orderId && (
          <p className="mt-2 text-sm text-ink/50">Order reference: {placed.orderId}</p>
        )}
        <p className="mt-4 text-ink/70">
          No payment was taken. This flow exists to show how checkout will work once our payment
          gateway is live — real charges will be enabled after that integration is approved.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-block text-mauve-dark underline">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">Checkout</h1>
      <p className="mt-2 text-sm text-ink/50">
        Demo environment — no live payment processing yet.
      </p>

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
              setError(data.error || "Something went wrong placing your order.");
              setSubmitting(false);
              return;
            }

            setPlaced({ orderId: data.id, persisted: data.persisted });
            clear();
          } catch {
            setError("Could not reach the server. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
        className="mt-10 grid gap-12 md:grid-cols-[1.3fr_1fr]"
      >
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-lg text-ink">Contact &amp; shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input required name="firstName" placeholder="First name" className="input-field" />
              <input required name="lastName" placeholder="Last name" className="input-field" />
              <input
                required
                name="email"
                type="email"
                placeholder="Email"
                className="input-field sm:col-span-2"
              />
              <input
                required
                name="street"
                placeholder="Street and house number"
                className="input-field sm:col-span-2"
              />
              <input required name="postalCode" placeholder="Postal code" className="input-field" />
              <input required name="city" placeholder="City" className="input-field" />
              <input
                readOnly
                name="country"
                value="Germany"
                className="input-field cursor-not-allowed bg-sand/40 text-ink/60 sm:col-span-2"
              />
              <p className="text-xs text-ink/50 sm:col-span-2">
                We currently ship within Germany only. See our{" "}
                <Link href="/legal/shipping" className="underline">
                  Shipping &amp; Delivery Policy
                </Link>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-lg text-ink">Payment method</h2>
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
                  {method === "sepa" ? "SEPA Direct Debit" : method === "card" ? "Card" : "PayPal"}
                </button>
              ))}
            </div>

            {payment === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required placeholder="Card number" className="input-field sm:col-span-2" />
                <input required placeholder="MM / YY" className="input-field" />
                <input required placeholder="CVC" className="input-field" />
              </div>
            )}
            {payment === "sepa" && (
              <div className="mt-4">
                <input required placeholder="IBAN" className="input-field w-full" />
                <p className="mt-2 text-xs text-ink/50">
                  By confirming, you authorise SomnoBalance to send instructions to your bank to
                  debit your account via SEPA Direct Debit.
                </p>
              </div>
            )}
            {payment === "paypal" && (
              <p className="mt-4 text-sm text-ink/60">
                You will be redirected to PayPal to complete payment once this integration is live.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h2 className="font-serif text-lg text-ink">Order summary</h2>
          <div className="mt-4 space-y-3">
            {lines.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              const unitPrice = product.variants
                ? getVariant(product, line.variant)?.price ?? 0
                : product.price ?? 0;
              return (
                <div
                  key={`${line.slug}:${line.variant ?? ""}`}
                  className="flex justify-between text-sm text-ink/70"
                >
                  <span>
                    {product.name}
                    {line.variant ? ` (${line.variant})` : ""} × {line.qty}
                  </span>
                  <span>{formatPrice(unitPrice * line.qty)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 border-t border-mauve/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal, incl. VAT</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium text-mauve-dark">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-mauve py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order (demo)"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-ink/40">
            By placing this order you agree to our{" "}
            <Link href="/legal/terms" className="underline">
              Terms &amp; Conditions
            </Link>{" "}
            and confirm you have read our{" "}
            <Link href="/legal/withdrawal" className="underline">
              Right of Withdrawal Policy
            </Link>
            .
          </p>
        </aside>
      </form>
    </div>
  );
}
