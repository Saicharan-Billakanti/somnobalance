"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { getProduct, getProductText, getVariant, formatPrice } from "@/lib/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function CartClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const { lines, setQty, remove, total } = useCart();
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">{dict.cart.emptyTitle}</h1>
        <p className="mt-3 text-ink/60">{dict.cart.emptyCopy}</p>
        <Link
          href={`/${lang}/shop`}
          className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {dict.cart.browseShop}
        </Link>
      </div>
    );
  }

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountRate: number;
    discountAmount: number;
    finalSubtotal: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Check URL or localStorage for ref / coupon code on load
  const applyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) return;
    setCouponError(null);
    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: code, subtotal: total, email: user?.email }),
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
        if (typeof window !== "undefined") {
          localStorage.setItem("sb_coupon", data.couponCode);
        }
      }
    } catch {
      setCouponError("Could not validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sb_coupon");
    }
  };

  const finalSubtotal = appliedCoupon ? appliedCoupon.finalSubtotal : total;

  const handleCheckoutClick = () => {
    const checkoutUrl = appliedCoupon
      ? `/${lang}/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
      : `/${lang}/checkout`;
    if (user) {
      router.push(checkoutUrl);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">{dict.cart.title}</h1>

      <div className="mt-10 divide-y divide-mauve/10">
        {lines.map((line) => {
          const product = getProduct(line.slug);
          if (!product) return null;
          const text = getProductText(product, lang);
          const unitPrice = product.variants
            ? getVariant(product, line.variant)?.price ?? 0
            : product.price ?? 0;
          const maxLimit = product.maxRetailQuantity || 10;
          const isHighQty = line.qty >= maxLimit;

          return (
            <div key={`${line.slug}:${line.variant ?? ""}`} className="py-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image
                    src={product.image}
                    alt={text.name}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink">{text.name}</div>
                  {line.variant && <div className="text-xs text-ink/50">{line.variant}</div>}
                  <div className="mt-1 text-sm text-ink/60">{formatPrice(unitPrice)}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    value={line.qty}
                    onChange={(e) => setQty(line.slug, Math.max(1, Number(e.target.value) || 1), line.variant)}
                    className="w-16 rounded-lg border border-mauve/20 px-2 py-1 text-center font-bold text-ink"
                  />
                </div>
                <div className="w-24 text-right font-serif font-bold text-ink">
                  {formatPrice(unitPrice * line.qty)}
                </div>
                <button
                  onClick={() => remove(line.slug, line.variant)}
                  className="text-sm text-ink/40 hover:text-ink transition"
                  aria-label={`${dict.cart.remove} ${text.name}`}
                >
                  {dict.cart.remove}
                </button>
              </div>

              {/* B2B Wholesale Upsell Alert when quantity is high */}
              {isHighQty && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💼</span>
                    <div>
                      <strong className="text-amber-950">High Volume Order ({line.qty} units):</strong>{" "}
                      <span className="text-amber-900/80">
                        Ordering for a clinic, hotel, or wellness center? Get <strong>15% - 30% OFF</strong> with a Business Account.
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/${lang}/for-business`}
                    className="rounded-full bg-amber-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-800 transition whitespace-nowrap shadow-xs"
                  >
                    Switch to Business Discounts →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Coupon / Promo Code Section */}
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-mauve/10 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label className="text-xs font-medium text-ink/70">
            {dict.cart.promoCode || "Promo or Partner Referral Code"}
          </label>
          <div className="mt-1 flex max-w-sm gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="e.g. SOMNO10"
              disabled={Boolean(appliedCoupon)}
              className="flex-1 uppercase rounded-lg border border-mauve/20 bg-white px-3 py-1.5 text-sm uppercase text-ink placeholder:normal-case placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-mauve"
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={removeCoupon}
                className="rounded-lg border border-mauve/30 px-3 py-1.5 text-xs font-medium text-mauve-dark hover:bg-sand"
              >
                {dict.cart.removeCode || "Remove"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => applyCoupon()}
                disabled={validatingCoupon || !couponInput.trim()}
                className="rounded-lg bg-mauve px-4 py-1.5 text-xs font-medium text-white hover:bg-mauve-dark disabled:opacity-60"
              >
                {validatingCoupon ? "…" : dict.cart.applyCode || "Apply"}
              </button>
            )}
          </div>
          {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
          {appliedCoupon && (
            <p className="mt-1 text-xs font-medium text-teal-dark">
              ✓ {(dict.cart.codeApplied || "Coupon {code} applied (-{rate}%)")
                .replace("{code}", appliedCoupon.code)
                .replace("{rate}", String(appliedCoupon.discountRate))}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-mauve/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink/60">{dict.cart.subtotal}</span>
            {appliedCoupon && (
              <span className="rounded bg-teal/10 px-2 py-0.5 text-xs font-medium text-teal-dark">
                -{formatPrice(appliedCoupon.discountAmount)} {dict.cart.discount || "Discount"}
              </span>
            )}
          </div>
          <div className="text-2xl font-medium text-mauve-dark">{formatPrice(finalSubtotal)}</div>
        </div>
        <button
          onClick={handleCheckoutClick}
          disabled={loading}
          className="rounded-full bg-mauve px-8 py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
        >
          {dict.cart.checkout}
        </button>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 text-ink/40 hover:text-ink"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-dark">SomnoBalance</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">
              {dict.cart.loginPromptTitle || "Sign in to complete your purchase"}
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              {dict.cart.loginPromptSubtitle || "Log in to your account or register in seconds to continue to checkout."}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={`/${lang}/login?redirect=${encodeURIComponent(
                  appliedCoupon
                    ? `/${lang}/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
                    : `/${lang}/checkout`
                )}`}
                className="flex w-full items-center justify-center rounded-full bg-mauve py-3 text-sm font-medium text-white transition hover:bg-mauve-dark"
              >
                {dict.cart.loginAndCheckout || "Log in & Checkout"}
              </Link>
              <Link
                href={`/${lang}/register?redirect=${encodeURIComponent(
                  appliedCoupon
                    ? `/${lang}/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
                    : `/${lang}/checkout`
                )}`}
                className="flex w-full items-center justify-center rounded-full border border-mauve/30 py-3 text-sm font-medium text-mauve-dark transition hover:bg-sand"
              >
                {dict.cart.registerAndCheckout || "Create account & Checkout"}
              </Link>
              <Link
                href={
                  appliedCoupon
                    ? `/${lang}/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
                    : `/${lang}/checkout`
                }
                className="mt-2 text-center text-xs text-ink/50 underline hover:text-ink"
              >
                {dict.cart.continueAsGuest || "Continue as guest"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
