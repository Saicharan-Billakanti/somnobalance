"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getDisplayPrice, getProductText, type Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { Package, SlidersHorizontal, Search, Sparkles, BedSingle, Leaf, Check, X } from "lucide-react";

type ShopClientProps = {
  products: Product[];
  lang: Locale;
  dict: Dictionary;
};

export function ShopClient({ products, lang, dict }: { products: any[]; lang: Locale; dict: Dictionary }) {
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const { add } = useCart();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

  // Per the client's shop-filter spec: the old 3-value "Schlaf / Ritual /
  // Pflege" categories don't fit SomnoBalance's positioning. Products keep
  // their existing internal `category` (Sleep/Ritual/Care — unchanged, so
  // checkout/admin data isn't touched), but the filter UI groups them into
  // the 2 buckets the client asked for: Sleep -> Schlafumgebung, Ritual +
  // Care -> Regenerationsimpulse.
  const productGroup = (p: Product): "Regenerationsimpulse" | "Schlafumgebung" =>
    p.category === "Sleep" ? "Schlafumgebung" : "Regenerationsimpulse";

  // Filter computations
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const text = getProductText(p, lang);
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = text.name.toLowerCase().includes(q);
          const matchTagline = text.tagline.toLowerCase().includes(q);
          const matchDesc = text.description.toLowerCase().includes(q);
          if (!matchName && !matchTagline && !matchDesc) return false;
        }

        // Product group
        if (selectedCategory !== "all" && productGroup(p) !== selectedCategory) {
          return false;
        }

        // Phase
        if (selectedPhase !== "all" && p.phase !== selectedPhase) {
          return false;
        }

        // Price range
        const { price } = getDisplayPrice(p);
        if (priceRange === "under-25" && price >= 25) return false;
        if (priceRange === "25-100" && (price < 25 || price > 100)) return false;
        if (priceRange === "over-100" && price <= 100) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = getDisplayPrice(a).price;
        const priceB = getDisplayPrice(b).price;
        const textA = getProductText(a, lang);
        const textB = getProductText(b, lang);

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "name") return textA.name.localeCompare(textB.name);
        return 0; // featured default
      });
  }, [products, lang, searchQuery, selectedCategory, selectedPhase, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPhase("all");
    setPriceRange("all");
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "all" || selectedPhase !== "all" || priceRange !== "all";

  const categories = [
    { key: "all", label: tx("All Products", "Alle Produkte"), icon: <Sparkles className="size-4" /> },
    { key: "Regenerationsimpulse", label: tx("Regeneration Impulses", "Regenerationsimpulse"), icon: <Leaf className="size-4" /> },
    { key: "Schlafumgebung", label: tx("Sleep Environment", "Schlafumgebung"), icon: <BedSingle className="size-4" /> },
  ];

  // No 01-04 numbering: the four phases are a cycle, not a fixed sequence,
  // and a product can belong to more than one at once (see products.ts'
  // `phase` field — still single-select for now; true multi-phase tagging
  // is a separate, larger data-model change, tracked but deferred).
  const phases = [
    { key: "all", label: tx("All Phases", "Alle Phasen") },
    { key: "REGULATE", label: dict.shop.phases.REGULATE },
    { key: "LET GO", label: dict.shop.phases["LET GO"] },
    { key: "PREPARE", label: dict.shop.phases.PREPARE },
    { key: "REGENERATE", label: dict.shop.phases.REGENERATE },
  ];

  const handleQuickAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      window.location.href = `/${lang}/shop/${product.slug}`;
      return;
    }
    add(product.slug, 1);
    setAddedItemSlug(product.slug);
    setTimeout(() => setAddedItemSlug(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header Banner */}
      <div className="border-b border-mauve/15 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-teal-dark font-semibold">
              {dict.shop?.eyebrow || "SomnoBalance Collection"}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl lg:text-5xl">
              {dict.shop?.title || "Rituals & Sleep Architecture"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink/70 sm:text-base">
              {dict.shop?.intro ||
                "Sensory tools, ergonomic neck support, and ritual compositions designed to transition your nervous system into restorative rest."}
            </p>
          </div>

          {/* Quick Stats or Free Shipping Threshold banner */}
          <div className="flex items-center gap-2 rounded-2xl border border-teal/20 bg-teal/5 px-4 py-3 text-xs text-teal-dark font-medium">
            <Package className="size-4" />
            {lang === "de" ? "Kostenloser DHL-Versand ab 59 €" : "Free DHL Standard Shipping over €59"}
          </div>
        </div>
      </div>

      {/* Main 2-Column E-Commerce Layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* ============================================================ */}
        {/* LEFT COLUMN: E-COMMERCE FILTER SIDEBAR                       */}
        {/* ============================================================ */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="sticky top-24 rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-mauve/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                <SlidersHorizontal className="size-4" /> {tx("Filters", "Filter")}
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-mauve-dark hover:underline"
                >
                  {tx("Reset All", "Alle zurücksetzen")}
                </button>
              )}
            </div>

            {/* 1. Quick phase picker — a calm orientation prompt, not a
                quiz: "what do you need right now?" */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                {tx("What supports you right now?", "Was unterstützt Sie gerade?")}
              </label>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                {phases.slice(1).map((ph, i) => (
                  <button
                    key={ph.key}
                    onClick={() => setSelectedPhase(selectedPhase === ph.key ? "all" : ph.key)}
                    className={`transition ${
                      selectedPhase === ph.key ? "font-semibold text-mauve-dark" : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {i > 0 && <span className="mr-3 text-ink/30">·</span>}
                    {ph.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Regeneration phase — the primary filter, per the
                client's spec: customers orient by current need before
                product type. */}
            <div className="border-t border-mauve/10 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                {tx("Regeneration Phase", "Regenerationsphase")}
              </label>
              <div className="mt-2 space-y-1">
                {phases.map((ph) => {
                  const isSelected = selectedPhase === ph.key;
                  return (
                    <button
                      key={ph.key}
                      onClick={() => setSelectedPhase(ph.key)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                        isSelected
                          ? "bg-mauve/15 text-mauve-dark font-semibold"
                          : "text-ink/70 hover:bg-sand/60 hover:text-ink"
                      }`}
                    >
                      <span>{ph.label}</span>
                      {isSelected && <Check className="size-4 text-mauve-dark" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Product type */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                {tx("Product Type", "Produktart")}
              </label>
              <div className="mt-2 space-y-1">
                {categories.map((cat) => {
                  const count =
                    cat.key === "all" ? products.length : products.filter((p) => productGroup(p) === cat.key).length;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                        isSelected
                          ? "bg-teal/15 text-teal-dark font-semibold"
                          : "text-ink/70 hover:bg-sand/60 hover:text-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                      <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] text-ink/60">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Price */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                {tx("Price", "Preis")}
              </label>
              <div className="mt-2 space-y-1 text-xs">
                {[
                  { key: "all", label: tx("All Prices", "Alle Preise") },
                  { key: "under-25", label: tx("Under €25", "Unter 25 €") },
                  { key: "25-100", label: tx("€25–100", "25–100 €") },
                  { key: "over-100", label: tx("Over €100", "Über 100 €") },
                ].map((pr) => (
                  <button
                    key={pr.key}
                    onClick={() => setPriceRange(pr.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 transition ${
                      priceRange === pr.key
                        ? "bg-sand font-semibold text-ink"
                        : "text-ink/70 hover:bg-sand/40 hover:text-ink"
                    }`}
                  >
                    <span>{pr.label}</span>
                    {priceRange === pr.key && <span>●</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Search — optional, last */}
            <div className="border-t border-mauve/10 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                {tx("Search", "Suche")}
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tx("Search for a product…", "Produkt suchen …")}
                  className="input-field text-xs pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 size-4 text-ink/40" />
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: CATALOG RESULTS & PRODUCT GRID                */}
        {/* ============================================================ */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Results Count, Mobile Filter Trigger & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-mauve/15 bg-white px-5 py-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand px-3 py-1.5 text-xs font-semibold text-ink lg:hidden"
              >
                <SlidersHorizontal className="size-4" /> {tx("Filters", "Filter")}
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-teal" />
                )}
              </button>

              <span className="text-xs text-ink/60">
                {tx("Showing", "Zeige")} <strong className="text-ink">{filteredProducts.length}</strong> {tx("of", "von")} {products.length} {tx("products", "Produkten")}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink/60 font-medium">{tx("Sort By:", "Sortieren nach:")}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-mauve/20 bg-sand/30 px-3 py-1.5 text-xs font-medium text-ink focus:border-teal focus:outline-none"
              >
                <option value="featured">{tx("Featured Collection", "Empfohlene Kollektion")}</option>
                <option value="price-asc">{tx("Price: Low to High", "Preis: aufsteigend")}</option>
                <option value="price-desc">{tx("Price: High to Low", "Preis: absteigend")}</option>
                <option value="name">{tx("Product Name (A-Z)", "Produktname (A–Z)")}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-ink/50">{tx("Active:", "Aktiv:")}</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs text-ink">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="text-ink/50 hover:text-ink"><X className="size-3" /></button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-3 py-1 text-xs text-teal-dark font-medium">
                  {tx("Category", "Kategorie")}: {categories.find((c) => c.key === selectedCategory)?.label ?? selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-teal"><X className="size-3" /></button>
                </span>
              )}
              {selectedPhase !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mauve/15 px-3 py-1 text-xs text-mauve-dark font-medium">
                  {tx("Phase", "Phase")}: {phases.find((ph) => ph.key === selectedPhase)?.label ?? selectedPhase}
                  <button onClick={() => setSelectedPhase("all")} className="hover:text-mauve"><X className="size-3" /></button>
                </span>
              )}
              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs text-ink">
                  {priceRange === "under-25" ? tx("Under €25", "Unter 25 €") : priceRange === "25-100" ? tx("€25 - €100", "25 € - 100 €") : tx("Over €100", "Über 100 €")}
                  <button onClick={() => setPriceRange("all")} className="text-ink/50 hover:text-ink"><X className="size-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-mauve-dark underline hover:opacity-80 ml-2"
              >
                {tx("Clear all", "Alle löschen")}
              </button>
            </div>
          )}

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="rounded-3xl border border-teal/20 bg-white p-6 shadow-md lg:hidden space-y-4">
              <div className="flex items-center justify-between border-b border-mauve/10 pb-3">
                <h3 className="font-serif text-lg text-ink font-bold">{tx("Filter Products", "Produkte filtern")}</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-full bg-sand flex items-center gap-1 p-1 px-2.5 text-xs text-ink"
                >
                  <X className="size-3" /> {tx("Close", "Schließen")}
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-ink/60">
                  {tx("Regeneration Phase", "Regenerationsphase")}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {phases.map((ph) => (
                    <button
                      key={ph.key}
                      onClick={() => setSelectedPhase(ph.key)}
                      className={`rounded-xl p-2 text-xs text-left ${
                        selectedPhase === ph.key ? "bg-mauve text-white font-semibold" : "bg-sand/60 text-ink"
                      }`}
                    >
                      {ph.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-ink/60">
                  {tx("Product Type", "Produktart")}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`rounded-xl p-2 text-xs text-left flex items-center gap-2 ${
                        selectedCategory === cat.key ? "bg-teal text-white font-semibold" : "bg-sand/60 text-ink"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-full bg-teal py-2.5 text-xs font-semibold text-white"
                >
                  {tx("Apply Filters", "Filter anwenden")} ({filteredProducts.length} {tx("results", "Ergebnisse")})
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-mauve/15 bg-white p-12 text-center flex flex-col items-center">
              <Leaf className="size-8 text-ink/40" />
              <h3 className="mt-3 font-serif text-xl text-ink">{tx("No matching products found", "Keine passenden Produkte gefunden")}</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-ink/60">
                {tx("Try adjusting your search query, price ranges, or phase filters.", "Passe deine Suche, Preisspanne oder Phasenfilter an.")}
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-mauve px-6 py-2.5 text-xs font-semibold text-white hover:bg-mauve-dark"
              >
                {tx("Reset All Filters", "Alle Filter zurücksetzen")}
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((p) => {
                const { price, fromPrice } = getDisplayPrice(p);
                const text = getProductText(p, lang);
                const isJustAdded = addedItemSlug === p.slug;

                return (
                  <div
                    key={p.slug || p.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-mauve/15 bg-white shadow-sm transition hover:border-teal/30 hover:shadow-md"
                  >
                    <Link href={`/${lang}/shop/${p.slug}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-sand/20">
                        <Image
                          src={p.image}
                          alt={text.name}
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain p-6 transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-5">
                        <div className="text-[10px] uppercase tracking-wider text-ink/50">
                          {(dict.shop.categories as Record<string, string>)?.[p.category] || p.category}
                          {p.phase && <> · {(dict.shop.phases as Record<string, string>)[p.phase]}</>}
                          {p.shippingIncluded && <> · {dict.shop.freeDelivery}</>}
                        </div>
                        <h3 className="mt-1 font-serif text-lg font-bold text-ink group-hover:text-mauve-dark transition">
                          {text.name}
                        </h3>
                        <p className="mt-1 text-xs line-clamp-2 text-ink/60">{text.tagline}</p>
                      </div>
                    </Link>

                    {/* Card Footer: Price & Quick Action */}
                    <div className="flex items-center justify-between border-t border-mauve/10 px-5 py-3.5 bg-sand/10">
                      <div>
                        <div className="font-serif text-base font-bold text-mauve-dark">
                          {fromPrice && <span className="text-xs font-normal text-ink/50">{tx("From", "Ab")} </span>}
                          {formatPrice(price)}
                        </div>
                        <span className="text-[10px] text-ink/40">{tx("incl. VAT", "inkl. MwSt.")}</span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAddToCart(e, p)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : p.variants && p.variants.length > 0
                            ? "bg-sand text-ink hover:bg-sand-dark"
                            : "bg-teal text-white hover:bg-teal-dark shadow-sm"
                        }`}
                      >
                        {isJustAdded
                          ? `✓ ${tx("Added", "Hinzugefügt")}`
                          : p.variants && p.variants.length > 0
                          ? tx("Select Size →", "Größe wählen →")
                          : `+ ${dict.shop?.addToCart || tx("Add to Cart", "In den Warenkorb")}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
