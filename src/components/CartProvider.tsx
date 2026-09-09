"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { priceOrderItems, computeShipping } from "@/lib/products";

type CartLine = { slug: string; qty: number; variant?: string };
type CartContextValue = {
  lines: CartLine[];
  add: (slug: string, qty?: number, variant?: string) => void;
  remove: (slug: string, variant?: string) => void;
  setQty: (slug: string, qty: number, variant?: string) => void;
  clear: () => void;
  count: number;
  total: number;
  shipping: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "somnobalance-cart";

function sameLine(a: { slug: string; variant?: string }, b: { slug: string; variant?: string }) {
  return a.slug === b.slug && a.variant === b.variant;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines, hydrated]);

  const add = (slug: string, qty = 1, variant?: string) => {
    setLines((prev) => {
      const target = { slug, variant };
      const existing = prev.find((l) => sameLine(l, target));
      if (existing) {
        return prev.map((l) => (sameLine(l, target) ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, qty, variant }];
    });
  };

  const remove = (slug: string, variant?: string) =>
    setLines((prev) => prev.filter((l) => !sameLine(l, { slug, variant })));

  const setQty = (slug: string, qty: number, variant?: string) =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !sameLine(l, { slug, variant }))
        : prev.map((l) => (sameLine(l, { slug, variant }) ? { ...l, qty } : l))
    );

  const clear = () => setLines([]);

  const { count, total, shipping } = useMemo(() => {
    const priced = priceOrderItems(lines);
    if ("error" in priced) {
      // A slug/variant that no longer exists in the catalog (e.g. after a
      // catalog change) — drop it from the totals rather than crash.
      return { count: 0, total: 0, shipping: 0 };
    }
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const total = priced.lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
    const shipping = computeShipping(priced.lines);
    return { count, total, shipping };
  }, [lines]);

  return (
    <CartContext.Provider value={{ lines, add, remove, setQty, clear, count, total, shipping }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
