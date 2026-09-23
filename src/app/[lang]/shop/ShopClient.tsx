"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getDisplayPrice, getProductText, type Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { Package, SlidersHorizontal, Search, Sparkles, BedSingle, Leaf, Flower2, Star, Check, X, ArrowRight } from "lucide-react";

type ShopClientProps = {
  products: Product[];
  lang: Locale;
  dict: Dictionary;
};

export function ShopClient({ products, lang, dict }: { products: any[]; lang: Locale; dict: Dictionary }) {
  const { add } = useCart();
  const { user } = useAuth();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

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

        // Category
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Phase
        if (selectedPhase !== "all" && p.phase !== selectedPhase) {
          return false;
        }

        // Free Shipping
        if (onlyFreeShipping && !p.shippingIncluded) {
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
  }, [products, lang, searchQuery, selectedCategory, selectedPhase, priceRange, onlyFreeShipping, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPhase("all");
    setPriceRange("all");
    setOnlyFreeShipping(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedPhase !== "all" ||
    priceRange !== "all" ||
    onlyFreeShipping;

  const categories = [
    { key: "all", label: lang === "de" ? "Alle Produkte" : "All Products", icon: <Sparkles className="size-4" /> },
    { key: "Sleep", label: dict.shop?.categories?.Sleep || "Sleep", icon: <BedSingle className="size-4" /> },
    { key: "Ritual", label: dict.shop?.categories?.Ritual || "Ritual", icon: <Leaf className="size-4" /> },
    { key: "Care", label: dict.shop?.categories?.Care || "Care", icon: <Flower2 className="size-4" /> },
  ];

  const phases = [
    { key: "all", label: lang === "de" ? "Alle Phasen" : "All Phases" },
    { key: "REGULATE", label: `01 · ${dict.shop.phases.REGULATE}` },
    { key: "LET GO", label: `02 · ${dict.shop.phases["LET GO"]}` },
    { key: "PREPARE", label: `03 · ${dict.shop.phases.PREPARE}` },
    { key: "REGENERATE", label: `04 · ${dict.shop.phases.REGENERATE}` },
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

  const isDualRole = Boolean(user?.isAffiliate);

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
                <SlidersHorizontal className="size-4" /> Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-mauve-dark hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* 1. Search Bar */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                Search Catalog
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Pillow, Roll-on, Tea..."
                  className="input-field text-xs pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 size-4 text-ink/40" />
              </div>
            </div>

            {/* 2. Categories */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                Categories
              </label>
              <div className="mt-2 space-y-1">
                {categories.map((cat) => {
                  const count =
                    cat.key === "all"
                      ? products.length
                      : products.filter((p) => p.category === cat.key).length;
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

            {/* 3. System Phase */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                SomnoBalance Phase
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

            {/* 4. Price Ranges */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                Price Range
              </label>
              <div className="mt-2 space-y-1 text-xs">
                {[
                  { key: "all", label: "All Prices" },
                  { key: "under-25", label: "Under €25.00" },
                  { key: "25-100", label: "€25.00 — €100.00" },
                  { key: "over-100", label: "Over €100.00" },
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

            {/* 5. Free Shipping Toggle */}
            <div className="border-t border-mauve/10 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyFreeShipping}
                  onChange={(e) => setOnlyFreeShipping(e.target.checked)}
                  className="rounded border-mauve/30 text-teal focus:ring-teal"
                />
                <span className="text-xs text-ink/80 font-medium">Free Shipping Included Items</span>
              </label>
            </div>

            {/* 6. Partner Perks Box in Sidebar */}
            {isDualRole ? (
              <div className="rounded-2xl border border-teal/20 bg-teal/5 p-3.5 text-xs text-ink/80">
                <div className="font-semibold text-teal-dark flex items-center gap-1.5">
                  <Star className="size-4" /> {dict.shop.partnerMemberTitle}
                </div>
                <p className="mt-1 text-[11px] text-ink/60">
                  {dict.shop.partnerMemberCopy}
                </p>
                <Link
                  href={`/${lang}/partner`}
                  className="mt-2 block text-center rounded-lg bg-teal py-1.5 text-[11px] font-semibold text-white hover:bg-teal-dark"
                >
                  {dict.shop.partnerMemberCta}
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-mauve/15 bg-sand/40 p-3.5 text-xs text-ink/80">
                <div className="font-semibold text-ink flex items-center gap-1.5">
                  <Sparkles className="size-4" /> {dict.shop.partnerTeaserTitle}
                </div>
                <p className="mt-1 text-[11px] text-ink/60">
                  {dict.shop.partnerTeaserCopy}
                </p>
                <Link
                  href={`/${lang}/partner`}
                  className="mt-2 block text-center rounded-lg bg-mauve py-1.5 text-[11px] font-semibold text-white hover:bg-mauve-dark"
                >
                  {dict.shop.partnerTeaserCta}
                </Link>
              </div>
            )}
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
                <SlidersHorizontal className="size-4" /> Filters
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-teal" />
                )}
              </button>

              <span className="text-xs text-ink/60">
                Showing <strong className="text-ink">{filteredProducts.length}</strong> of {products.length} products
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink/60 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-mauve/20 bg-sand/30 px-3 py-1.5 text-xs font-medium text-ink focus:border-teal focus:outline-none"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-ink/50">Active:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs text-ink">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="text-ink/50 hover:text-ink"><X className="size-3" /></button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-3 py-1 text-xs text-teal-dark font-medium">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-teal"><X className="size-3" /></button>
                </span>
              )}
              {selectedPhase !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mauve/15 px-3 py-1 text-xs text-mauve-dark font-medium">
                  Phase: {selectedPhase}
                  <button onClick={() => setSelectedPhase("all")} className="hover:text-mauve"><X className="size-3" /></button>
                </span>
              )}
              {priceRange !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs text-ink">
                  {priceRange === "under-25" ? "Under €25" : priceRange === "25-100" ? "€25 - €100" : "Over €100"}
                  <button onClick={() => setPriceRange("all")} className="text-ink/50 hover:text-ink"><X className="size-3" /></button>
                </span>
              )}
              {onlyFreeShipping && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-3 py-1 text-xs text-teal-dark">
                  Free Shipping
                  <button onClick={() => setOnlyFreeShipping(false)}><X className="size-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-mauve-dark underline hover:opacity-80 ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="rounded-3xl border border-teal/20 bg-white p-6 shadow-md lg:hidden space-y-4">
              <div className="flex items-center justify-between border-b border-mauve/10 pb-3">
                <h3 className="font-serif text-lg text-ink font-bold">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-full bg-sand flex items-center gap-1 p-1 px-2.5 text-xs text-ink"
                >
                  <X className="size-3" /> Close
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-ink/60">Category</label>
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

              <div>
                <label className="text-xs font-semibold uppercase text-ink/60">Phase</label>
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

              <div className="pt-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-full bg-teal py-2.5 text-xs font-semibold text-white"
                >
                  Apply Filters ({filteredProducts.length} results)
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-mauve/15 bg-white p-12 text-center flex flex-col items-center">
              <Leaf className="size-8 text-ink/40" />
              <h3 className="mt-3 font-serif text-xl text-ink">No matching products found</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-ink/60">
                Try adjusting your search query, price ranges, or phase filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-mauve px-6 py-2.5 text-xs font-semibold text-white hover:bg-mauve-dark"
              >
                Reset All Filters
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
                          className="object-cover transition duration-300 group-hover:scale-105"
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
                          {fromPrice && <span className="text-xs font-normal text-ink/50">From </span>}
                          {formatPrice(price)}
                        </div>
                        <span className="text-[10px] text-ink/40">incl. VAT</span>
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
                          ? "✓ Added"
                          : p.variants && p.variants.length > 0
                          ? "Select Size →"
                          : "+ Add to Cart"}
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
