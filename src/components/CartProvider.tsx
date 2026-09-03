"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/lib/products";

type CartLine = { slug: string; qty: number };
type CartContextValue = {
  lines: CartLine[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "somnobalance-cart";

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

  const add = (slug: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, qty }];
    });
  };

  const remove = (slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug));
  const setQty = (slug: string, qty: number) =>
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))
    );
  const clear = () => setLines([]);

  const { count, total } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const line of lines) {
      const product = getProduct(line.slug);
      if (!product) continue;
      count += line.qty;
      total += product.price * line.qty;
    }
    return { count, total };
  }, [lines]);

  return (
    <CartContext.Provider value={{ lines, add, remove, setQty, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
