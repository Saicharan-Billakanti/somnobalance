"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { getProduct, getProductText, getVariant, formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type Placed = { orderId: string | null; persisted: boolean };

export function CheckoutClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get("coupon") || searchParams.get("ref") || "";

  const { lines, total, shipping, clear } = useCart();
  const { user } = useAuth();
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    postalCode: "",
    city: "",
  });

  const [couponInput, setCouponInput] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountRate: number;
    discountAmount: number;
    finalSubtotal: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || "",
        lastName: prev.lastName || user.lastName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const applyCouponCode = async (codeToApply: string) => {
    const code = codeToApply.trim();
    if (!code) return;
    setCouponError(null);
    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: code,
          subtotal: total,
          email: formData.email || user?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon code");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: data.couponCode,
          discountRate: data.discountRate,
          discountAmount: data.discountAmount,
          finalSubtotal: data.finalSubtotal,
        });
        setCouponInput(data.couponCode);
      }
    } catch {
      setCouponError("Could not validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  useEffect(() => {
    const code = initialCoupon || (typeof window !== "undefined" ? localStorage.getItem("sb_coupon") || "" : "");
    if (code && total > 0) {
      applyCouponCode(code);
    }
  }, [initialCoupon, total]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sb_coupon");
    }
  };

  const finalSubtotal = appliedCoupon ? appliedCoupon.finalSubtotal : total;
  const grandTotal = finalSubtotal + shipping;

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl text-ink">{dict.checkout.title}</h1>
        {user ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-mauve/20 bg-sand/50 px-4 py-1.5 text-xs text-ink/80">
            <span className="h-2 w-2 rounded-full bg-teal"></span>
            <span>
              {(dict.checkout.loggedInAs || "Signed in as {name} ({email})")
                .replace("{name}", `${user.firstName} ${user.lastName}`.trim() || user.firstName)
                .replace("{email}", user.email)}
            </span>
          </div>
        ) : (
          <Link
            href={`/${lang}/login?redirect=/${lang}/checkout`}
            className="text-xs text-mauve-dark underline hover:text-mauve"
          >
            {dict.auth.alreadyHaveAccount} {dict.auth.loginButton}
          </Link>
        )}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSubmitting(true);

          const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            street: formData.street,
            postalCode: formData.postalCode,
            city: formData.city,
            country: "Germany",
            lang,
            couponCode: appliedCoupon?.code || null,
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

            if (data.checkoutUrl) {
              clear();
              window.location.href = data.checkoutUrl;
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
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder={dict.checkout.firstName}
                className="input-field"
              />
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder={dict.checkout.lastName}
                className="input-field"
              />
              <input
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={dict.checkout.email}
                className="input-field sm:col-span-2"
              />
              <input
                required
                name="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder={dict.checkout.street}
                className="input-field sm:col-span-2"
              />
              <input
                required
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder={dict.checkout.postalCode}
                className="input-field"
              />
              <input
                required
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={dict.checkout.city}
                className="input-field"
              />
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
            <p className="mt-4 text-sm text-ink/60">{dict.checkout.stripeNote}</p>
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

          {/* Coupon input in checkout */}
          <div className="mt-4 border-t border-mauve/10 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder={dict.checkout.promoCode || "Promo / Partner Code"}
                disabled={Boolean(appliedCoupon)}
                className="flex-1 uppercase rounded-lg border border-mauve/20 bg-white px-3 py-1.5 text-xs uppercase text-ink placeholder:normal-case placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-mauve"
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="rounded-lg border border-mauve/30 px-3 py-1.5 text-xs text-mauve-dark hover:bg-sand"
                >
                  {dict.checkout.removeCode || "Remove"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => applyCouponCode(couponInput)}
                  disabled={validatingCoupon || !couponInput.trim()}
                  className="rounded-lg bg-mauve px-3 py-1.5 text-xs text-white hover:bg-mauve-dark disabled:opacity-60"
                >
                  {validatingCoupon ? "…" : dict.checkout.applyCode || "Apply"}
                </button>
              )}
            </div>
            {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="mt-1 text-xs font-medium text-teal-dark">
                ✓ {(dict.checkout.codeApplied || "Coupon {code} applied (-{rate}%)")
                  .replace("{code}", appliedCoupon.code)
                  .replace("{rate}", String(appliedCoupon.discountRate))}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-mauve/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>{dict.checkout.subtotal}</span>
              <span>{formatPrice(total)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-teal-dark font-medium">
                <span>{dict.checkout.discount || "Discount"} (-{appliedCoupon.discountRate}%)</span>
                <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}
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
            {submitting ? dict.checkout.placingOrder : dict.checkout.continueToPayment}
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
