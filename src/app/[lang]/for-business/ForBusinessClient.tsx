"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { BedSingle, Leaf, Coffee, Sparkles, MessageCircle, Tag, Zap, Package, Building2, PartyPopper, Pencil, FileText, Truck } from "lucide-react";

interface B2BProductOption {
  id: string;
  name: string;
  retailPrice: number;
  icon: React.ReactNode;
  description: string;
}

const B2B_PRODUCTS: B2BProductOption[] = [
  {
    id: "pillow",
    name: "SomnoBalance Ergonomic Rest Pillow",
    retailPrice: 89.0,
    icon: <BedSingle className="size-6" />,
    description: "Adaptive orthopedic memory support for luxury suites & recovery clinics.",
  },
  {
    id: "oil",
    name: "SomnoBalance Botanical Rest Ritual Oil",
    retailPrice: 39.0,
    icon: <Leaf className="size-6" />,
    description: "Lavender & bergamot essential roll-on for guest nightstand rituals.",
  },
  {
    id: "tea",
    name: "SomnoBalance Organic Relaxation Tea",
    retailPrice: 24.0,
    icon: <Coffee className="size-6" />,
    description: "Chamomile, lemon balm & valerian blend for spa amenities and evening turndown.",
  },
  {
    id: "bundle",
    name: "Complete Luxury Hospitality Suite Set",
    retailPrice: 139.0,
    icon: <Sparkles className="size-6" />,
    description: "Pillow + Ritual Oil + Evening Tea bundled in premium linen gift packaging.",
  },
];

export function ForBusinessClient({
  lang,
  dict,
  initialApp,
}: {
  lang: Locale;
  dict: Dictionary;
  initialApp: any;
}) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"overview" | "apply" | "portal">(initialApp ? "portal" : "overview");
  const [app, setApp] = useState<any>(initialApp);

  // Dynamic Wholesale Tier Calculator State
  const [calcProduct, setCalcProduct] = useState<string>("pillow");
  const [calcQuantity, setCalcQuantity] = useState<number>(25);

  // Application form state
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState(
    user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("Boutique Hotel / Luxury Resort");
  const [vatId, setVatId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [estimatedVolume, setEstimatedVolume] = useState("25-50 units / month");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Portal & Edit Mode State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [businessQuantities, setBusinessQuantities] = useState<Record<string, number>>({});
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [addingCatalogProduct, setAddingCatalogProduct] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Messaging state
  const [chatMessage, setChatMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Initial Load: Check localStorage and fetch dynamic application state
  useEffect(() => {
    const storedAppId = typeof window !== "undefined" ? localStorage.getItem("somnobalance_b2b_app_id") : null;
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("somnobalance_b2b_email") : null;

    const queryTarget = user?.email || storedEmail;
    const queryId = storedAppId;

    if (!app && (queryTarget || queryId)) {
      const url = queryId
        ? `/api/business/application?id=${encodeURIComponent(queryId)}`
        : `/api/business/application?email=${encodeURIComponent(queryTarget!)}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.catalog)) {
            setCatalogProducts(data.catalog);
          }
          if (data.application) {
            setApp(data.application);
            if (data.application.id) {
              localStorage.setItem("somnobalance_b2b_app_id", data.application.id);
            }
            if (data.application.email) {
              localStorage.setItem("somnobalance_b2b_email", data.application.email);
            }
            setTab("portal");
          }
        })
        .catch(() => {});
    }
  }, [user, app]);

  useEffect(() => {
    if (!app?.id) return;

    fetch(`/api/business/application?id=${encodeURIComponent(app.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.catalog)) {
          setCatalogProducts(data.catalog);
        }
      })
      .catch(() => {});
  }, [app?.id]);

  // 2. Real-time Live Polling: Auto-refresh application & messages every 4 seconds
  useEffect(() => {
    if (!app?.id && !app?.email) return;

    const interval = setInterval(async () => {
      try {
        const targetId = app.id || localStorage.getItem("somnobalance_b2b_app_id");
        const targetEmail = app.email || localStorage.getItem("somnobalance_b2b_email") || user?.email;
        const query = targetId
          ? `id=${encodeURIComponent(targetId)}`
          : `email=${encodeURIComponent(targetEmail || "")}`;

        const res = await fetch(`/api/business/application?${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data.application) {
            setApp((prev: any) => {
              // Only update if data changed (status, discountRate, or message length/content)
              if (
                !prev ||
                prev.status !== data.application.status ||
                prev.discountRate !== data.application.discountRate ||
                (prev.messages?.length || 0) !== (data.application.messages?.length || 0) ||
                prev.updatedAt !== data.application.updatedAt
              ) {
                return data.application;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // silent catch during polling
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [app?.id, app?.email, user?.email]);

  useEffect(() => {
    if (tab === "portal") {
      scrollToBottom();
    }
  }, [app?.messages, tab]);

  // Calculate Wholesale Pricing
  const selectedProduct = B2B_PRODUCTS.find((p) => p.id === calcProduct) || B2B_PRODUCTS[0];
  let discountRate = 20;
  let tierLabel = lang === "de" ? "Stufe 1: Basis-Partner (20%)" : "Tier 1: Boutique Partner (20% OFF)";
  let tierBadge = "20% Wholesale";

  if (calcQuantity >= 100) {
    discountRate = 40;
    tierLabel =
      lang === "de"
        ? "Stufe 3: Strategischer Großkunde (40%) + Kostenlose Display-Sets"
        : "Tier 3: Strategic Enterprise Partner (40% OFF) + Display Kits";
    tierBadge = "40% Elite Commercial";
  } else if (calcQuantity >= 25) {
    discountRate = 30;
    tierLabel =
      lang === "de"
        ? "Stufe 2: Hospitality Preferred (30%)"
        : "Tier 2: Hospitality Preferred (30% OFF)";
    tierBadge = "30% Preferred Volume";
  }

  const retailUnit = selectedProduct.retailPrice;
  const wholesaleUnit = Math.round(retailUnit * (1 - discountRate / 100) * 100) / 100;
  const totalRetail = Math.round(retailUnit * calcQuantity * 100) / 100;
  const totalWholesale = Math.round(wholesaleUnit * calcQuantity * 100) / 100;
  const totalSavings = Math.round((totalRetail - totalWholesale) * 100) / 100;

  // Transfer calculator configuration into application form
  const handleApplyWithConfig = () => {
    setEstimatedVolume(`${calcQuantity} units / order (${selectedProduct.name})`);
    setNotes(
      `Interested in ordering ~${calcQuantity} units of ${selectedProduct.name} under ${tierLabel}. Estimated batch budget: €${totalWholesale.toFixed(2)}.`
    );
    setTab("apply");
  };

  // Quick 1-click sample kit configuration
  const handleQuickSampleRequest = () => {
    setEstimatedVolume("1 Sample Amenity Kit (Full Evaluation Batch)");
    setNotes("Requesting a SomnoBalance Evaluation Sample Box for property review.");
    setTab("apply");
  };

  // Handle Form Submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    if (!user) {
      setSubmitError("Please log in or sign up before sending a business request so we can keep track of it.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/business/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          phone,
          businessType,
          vatId,
          address,
          city,
          estimatedVolume,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit application");
        return;
      }
      setApp(data.application);
      if (data.application?.id) {
        localStorage.setItem("somnobalance_b2b_app_id", data.application.id);
      }
      if (data.application?.email) {
        localStorage.setItem("somnobalance_b2b_email", data.application.email);
      }
      setSubmitSuccess(true);
      setTab("portal");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Update Facility Details from Portal
  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      const res = await fetch("/api/business/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: app.companyName,
          contactName: app.contactName,
          email: app.email,
          phone: app.phone,
          businessType: app.businessType,
          vatId: app.vatId,
          address: app.address,
          city: app.city,
          estimatedVolume: app.estimatedVolume,
        }),
      });
      const data = await res.json();
      if (res.ok && data.application) {
        setApp(data.application);
        setIsEditingDetails(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingDetails(false);
    }
  };

  // Handle Sending Chat Message
  const handleSendMessage = async (e: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatMessage.trim();
    if (!textToSend || !app) return;

    setSendingMsg(true);

    // Optimistic UI message update
    const tempMsg = {
      id: `temp_${Date.now()}`,
      applicationId: app.id,
      senderRole: "business",
      senderName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : app.contactName || "You",
      message: textToSend,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setApp((prev: any) => ({
      ...prev,
      messages: [...(prev?.messages || []), tempMsg],
    }));
    if (!customText) setChatMessage("");

    try {
      const res = await fetch("/api/business/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.id,
          email: app.email,
          senderName: tempMsg.senderName,
          message: textToSend,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setApp((prev: any) => ({
          ...prev,
          messages: [
            ...(prev?.messages || []).filter((m: any) => m.id !== tempMsg.id),
            data.message,
          ],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleRequestBusinessOrder = () => {
    const lines = (app.products || [])
      .map((product: any) => ({ product, quantity: Number(businessQuantities[product.id] || 0) }))
      .filter(({ quantity }: { quantity: number }) => quantity > 0)
      .map(({ product, quantity }: { product: any; quantity: number }) => {
        const unitPrice = Number(product.retailPrice) * (1 - Number(product.discountRate || 0) / 100);
        return `${product.name}: ${quantity} units at €${unitPrice.toFixed(2)} each`;
      });

    if (!lines.length) return;
    handleSendMessage(null as any, `Business order request:\n${lines.join("\n")}`);
  };

  const handleAddCatalogProduct = async (product: any) => {
    if (!app?.id || app.status !== "approved") return;

    const productKey = product.slug || product.id || product.name;
    setAddingCatalogProduct(productKey);
    setCatalogError(null);

    try {
      const res = await fetch("/api/business/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_catalog_product",
          productSlug: product.slug,
          productId: product.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCatalogError(data.error || "Unable to add this product to your business catalog.");
        return;
      }
      if (data.application) {
        setApp(data.application);
      }
    } catch {
      setCatalogError("Network error. Please try again.");
    } finally {
      setAddingCatalogProduct(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Dynamic Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-dark">
          <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
          {dict.forBusiness?.eyebrow || "SomnoBalance B2B & Hospitality Solutions"}
        </div>
        <h1 className="mt-4 font-serif text-3xl text-ink sm:text-5xl">
          {dict.forBusiness?.title || "Elevate Rest for Your Guests & Practice"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
          {dict.forBusiness?.intro ||
            "Equip premium hotel suites, wellness retreats, clinics, and private practices with ergonomic rest essentials, tiered wholesale pricing, and dedicated commercial support."}
        </p>
      </div>

      {/* Dynamic Tabs Navigation */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-sand/80 p-1.5 text-sm font-medium shadow-inner">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-full px-5 py-2 transition ${
              tab === "overview"
                ? "bg-white text-ink shadow-sm font-semibold"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {lang === "de" ? "Übersicht & Rechner" : "Overview & Wholesale Simulator"}
          </button>
          <button
            onClick={() => setTab("apply")}
            className={`rounded-full px-5 py-2 transition ${
              tab === "apply"
                ? "bg-white text-ink shadow-sm font-semibold"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {lang === "de" ? "B2B-Konto beantragen" : "Apply for Business Terms"}
          </button>
          {app && (
            <button
              onClick={() => setTab("portal")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 transition ${
                tab === "portal"
                  ? "bg-teal text-white shadow-sm font-semibold"
                  : "bg-teal/10 text-teal-dark font-semibold hover:bg-teal/20"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              {lang === "de" ? "Mein B2B-Portal & Live-Desk" : "My B2B Portal & Live Desk"}
              {app.status === "approved" && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">
                  ✓ Active
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & DYNAMIC WHOLESALE CALCULATOR */}
      {/* ========================================================================= */}
      {tab === "overview" && (
        <div className="mt-12 space-y-12">
          {/* Key Advantages Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="group rounded-3xl border border-mauve/15 bg-white p-8 shadow-sm transition hover:border-teal/30 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
                <BedSingle className="size-6" />
              </div>
              <h3 className="mt-5 font-serif text-xl text-ink">
                {dict.forBusiness?.card1Title || "In-Room Guest Rituals"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {dict.forBusiness?.card1Copy ||
                  "Compact nightstand sets — ergonomic neck pillows, ritual roll-on oils, and herbal relaxation teas presented seamlessly as premium room amenities."}
              </p>
            </div>

            <div className="group rounded-3xl border border-mauve/15 bg-white p-8 shadow-sm transition hover:border-teal/30 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
                <Tag className="size-6" />
              </div>
              <h3 className="mt-5 font-serif text-xl text-ink">
                {dict.forBusiness?.card2Title || "Tiered Wholesale Pricing"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {dict.forBusiness?.card2Copy ||
                  "Direct commercial terms (20% to 40% wholesale discount), EU VAT-free invoicing for registered enterprises, and priority DHL replenishment."}
              </p>
            </div>

            <div className="group rounded-3xl border border-mauve/15 bg-white p-8 shadow-sm transition hover:border-teal/30 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
                <MessageCircle className="size-6" />
              </div>
              <h3 className="mt-5 font-serif text-xl text-ink">
                {dict.forBusiness?.card3Title || "Direct Admin Desk & Support"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {dict.forBusiness?.card3Copy ||
                  "Real-time 2-way communication with the SomnoBalance executive desk for custom batches, sample kits, and tailored logistics."}
              </p>
            </div>
          </div>

          {/* DYNAMIC WHOLESALE & VOLUME CALCULATOR */}
          <div className="rounded-3xl border border-mauve/20 bg-gradient-to-br from-white via-sand/30 to-teal/5 p-6 shadow-sm sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mauve/10 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-dark">
                  <Zap className="size-3" /> Interactive Commercial Estimator
                </span>
                <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
                  {lang === "de"
                    ? "Großhandels- & Margenrechner"
                    : "Wholesale Tier & Margin Calculator"}
                </h2>
                <p className="mt-1 text-sm text-ink/70">
                  {lang === "de"
                    ? "Wählen Sie ein Produkt und die gewünschte Stückzahl, um Ihre Rabattstufe und Einsparungen live zu berechnen."
                    : "Select a product and suite volume to preview your dynamic wholesale discount tier, savings, and batch totals."}
                </p>
              </div>

              <button
                onClick={handleQuickSampleRequest}
                className="flex items-center gap-2 rounded-full border border-teal/30 bg-white px-5 py-2.5 text-xs font-semibold text-teal-dark shadow-xs hover:bg-teal hover:text-white transition"
              >
                <Package className="size-4" />
                {lang === "de" ? "Musterpaket anfordern" : "Request Sample Evaluation Kit"}
              </button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              {/* Product & Volume Controls */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/70">
                    1. Select Product or Hospitality Bundle
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {B2B_PRODUCTS.map((prod) => {
                      const isSel = calcProduct === prod.id;
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => setCalcProduct(prod.id)}
                          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                            isSel
                              ? "border-teal bg-teal/5 ring-2 ring-teal/30 shadow-xs"
                              : "border-mauve/15 bg-white hover:border-mauve/30"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full text-teal-dark">
                            {prod.icon}
                            <span className="text-xs font-medium text-ink/50">
                              Retail: €{prod.retailPrice.toFixed(2)}
                            </span>
                          </div>
                          <strong className="mt-2 text-sm font-serif text-ink">{prod.name}</strong>
                          <p className="mt-1 text-[11px] text-ink/60 line-clamp-2">
                            {prod.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Volume Slider */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink/70">
                      2. Volume / Suite Count:{" "}
                      <span className="font-serif text-base font-bold text-teal-dark">
                        {calcQuantity} units
                      </span>
                    </label>
                    <span className="rounded-full bg-sand px-3 py-0.5 text-xs font-semibold text-ink/80">
                      {tierBadge}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-mauve/20 accent-teal"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-ink/50">
                    <span>5 units</span>
                    <span>25 units (Tier 2: 30%)</span>
                    <span>100+ units (Tier 3: 40%)</span>
                    <span>200+ units</span>
                  </div>
                </div>

                {/* Tier Explanation Badge */}
                <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4 text-xs text-teal-dark">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="size-4" /> {tierLabel}
                  </div>
                  <p className="mt-1 text-teal-dark/80 text-[11px]">
                    {calcQuantity < 25
                      ? "Order 25+ units to unlock Tier 2 (30% discount) and complimentary guest instruction cards."
                      : calcQuantity < 100
                      ? "Order 100+ units to unlock Tier 3 (40% discount), free wooden display amenities, and dedicated concierge dispatch."
                      : "Maximum commercial wholesale tier active! Includes complimentary custom embossing & DHL Express freight."}
                  </p>
                </div>
              </div>

              {/* Dynamic Live Quote Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-mauve/20 bg-white p-6 shadow-md lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between border-b border-mauve/10 pb-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-ink/60">
                      Live Wholesale Quote
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      -{discountRate}% APPLIED
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between text-ink/70">
                      <span>Selected Product:</span>
                      <strong className="text-ink truncate max-w-[180px]">{selectedProduct.name}</strong>
                    </div>
                    <div className="flex justify-between text-ink/70">
                      <span>Standard Retail Unit Price:</span>
                      <span>€{retailUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ink/70">
                      <span>Wholesale Rate per Unit:</span>
                      <strong className="text-teal-dark font-serif text-sm">
                        €{wholesaleUnit.toFixed(2)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-ink/70">
                      <span>Total Retail Value ({calcQuantity}x):</span>
                      <span className="line-through text-ink/40">€{totalRetail.toFixed(2)}</span>
                    </div>

                    <div className="my-3 border-t border-mauve/10 pt-3 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-ink">Commercial Total:</span>
                      <div className="text-right">
                        <div className="font-serif text-2xl font-bold text-teal-dark">
                          €{totalWholesale.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-ink/50">
                          excl. VAT / Reverse charge eligible
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-sand/60 p-3 text-center">
                      <span className="text-xs text-ink/70">
                        Estimated Savings & Facility Margin:
                      </span>
                      <div className="font-serif text-lg font-bold text-emerald-700">
                        + €{totalSavings.toFixed(2)} ({discountRate}%)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={handleApplyWithConfig}
                    className="w-full rounded-full bg-mauve py-3 text-xs font-semibold text-white shadow-md hover:bg-mauve-dark transition"
                  >
                    {lang === "de"
                      ? "Mit dieser Konfiguration bewerben →"
                      : "Apply for this Wholesale Tier →"}
                  </button>
                  <p className="text-center text-[10px] text-ink/50">
                    No upfront payment required. Rates validated upon business credential review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hospitality Call to Action */}
          <div className="rounded-3xl border border-mauve/15 bg-gradient-to-br from-sand/60 to-white p-8 sm:p-12 text-center">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">
              {lang === "de"
                ? "Bereit für SomnoBalance in Ihrem Haus?"
                : "Ready to enhance sleep wellness across your property?"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink/70">
              {lang === "de"
                ? "Reichen Sie Ihren Antrag in 2 Minuten ein. Unser Team prüft Ihre Angaben und schaltet Ihren Großhandelsrabatt frei."
                : "Submit your business application in under 2 minutes. Our executive team reviews credentials and unlocks your custom wholesale rates."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setTab("apply")}
                className="rounded-full bg-mauve px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-mauve-dark transition"
              >
                {lang === "de" ? "Jetzt B2B-Konto beantragen →" : "Apply for Business Terms →"}
              </button>
              <button
                onClick={handleQuickSampleRequest}
                className="rounded-full border border-mauve/30 bg-white px-6 py-3.5 text-sm font-semibold text-ink/80 hover:bg-sand transition"
              >
                {lang === "de" ? "Musterbox anfordern" : "Request Amenity Sample Kit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPLICATION FORM */}
      {/* ========================================================================= */}
      {tab === "apply" && (
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-mauve/15 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-center justify-between border-b border-mauve/10 pb-4">
            <div>
              <h2 className="font-serif text-2xl text-ink">
                {lang === "de" ? "Gewerbliche SomnoBalance-Vereinbarung" : "Business Application & Wholesale Access"}
              </h2>
              <p className="mt-1 text-sm text-ink/70">
                {lang === "de"
                  ? "Für Hotels, Spas, Kliniken, Praxen und gewerbliche Partner."
                  : "For boutique hotels, luxury retreats, wellness clinics, physiotherapy practices & retailers."}
              </p>
            </div>
            <Building2 className="size-8 text-ink/40" />
          </div>

          {submitSuccess && (
            <div className="mt-6 rounded-2xl bg-teal/15 p-4 text-sm text-teal-dark animate-fade-in flex items-start gap-2">
              <PartyPopper className="size-5 shrink-0 mt-0.5" />
              <div>
                <strong>Application submitted successfully!</strong> Your request has been queued in our live system and is under review.
              </div>
            </div>
          )}

          {submitError && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmitApplication} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink/70">Company / Facility Name *</label>
                <input
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Grand Wellness Hotel Tegernsee"
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink/70">Contact Person *</label>
                <input
                  required
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="First and last name"
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink/70">Business Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="concierge@luxuryhotel.com"
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink/70">Direct Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 (0) ..."
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink/70">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="input-field mt-1"
                >
                  <option value="Boutique Hotel / Luxury Resort">Boutique Hotel / Luxury Resort</option>
                  <option value="Health Clinic / Medical Rehab">Health Clinic / Medical Rehab</option>
                  <option value="Physiotherapy / Private Practice">Physiotherapy / Private Practice</option>
                  <option value="Wellness & Spa Center">Wellness & Day Spa Center</option>
                  <option value="Retailer / Concept Store">Retailer / Concept Store</option>
                  <option value="Corporate Gifting">Corporate Gifting / Employee Wellness</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink/70">EU VAT ID (USt-IdNr.)</label>
                <input
                  type="text"
                  value={vatId}
                  onChange={(e) => setVatId(e.target.value)}
                  placeholder="e.g. DE318921445"
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink/70">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street and house number"
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink/70">City & Postal Code</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. 80331 Munich, Germany"
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink/70">
                Estimated Monthly Need / Suite Count / Trial Scope
              </label>
              <input
                type="text"
                value={estimatedVolume}
                onChange={(e) => setEstimatedVolume(e.target.value)}
                placeholder="e.g. 35 luxury suites / restock every 2 months"
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink/70">
                Inquiry / Specific Product Requirements / Custom Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Let us know about your property, desired sample delivery date, or custom batch requirements..."
                className="input-field mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-mauve py-3.5 text-sm font-semibold text-white shadow-md hover:bg-mauve-dark disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting Application…
                </>
              ) : (
                "Submit Business Application & Open Portal →"
              )}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DYNAMIC BUSINESS PORTAL & LIVE 2-WAY DESK */}
      {/* ========================================================================= */}
      {tab === "portal" && app && (
        <div className="mt-10 space-y-8">
          {/* Status Banner & Real-time Account Card */}
          <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mauve/10 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl text-ink sm:text-3xl">{app.companyName}</h2>
                  <span
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                      app.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Status: {app.status === "approved" ? "✓ Approved" : app.status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink/60">
                  Contact: <strong className="text-ink">{app.contactName}</strong> ({app.email}) •{" "}
                  VAT ID: {app.vatId || "Not specified"} • Location: {app.city || "Germany"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {app.status === "approved" && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-900 font-semibold">
                      Assigned Wholesale Rate
                    </span>
                    <div className="font-serif text-2xl font-bold text-emerald-800">
                      {app.discountRate || 25}% OFF
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsEditingDetails(!isEditingDetails)}
                  className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-sand transition"
                >
                  {isEditingDetails ? "Close Editor" : <><Pencil className="size-3" /> Edit Details</>}
                </button>
              </div>
            </div>

            {/* Application Progress Timeline */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-ink/70 max-w-lg mx-auto">
                <div className="flex flex-col items-center gap-1 text-emerald-700 font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                  <span>1. Application Queued</span>
                </div>
                <div className="h-0.5 flex-1 bg-emerald-300 mx-2" />
                <div
                  className={`flex flex-col items-center gap-1 ${
                    app.status !== "pending"
                      ? "text-emerald-700 font-semibold"
                      : "text-amber-700 font-semibold"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      app.status !== "pending"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700 animate-pulse"
                    }`}
                  >
                    {app.status !== "pending" ? "✓" : "2"}
                  </span>
                  <span>2. Desk Review</span>
                </div>
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    app.status === "approved" ? "bg-emerald-300" : "bg-mauve/20"
                  }`}
                />
                <div
                  className={`flex flex-col items-center gap-1 ${
                    app.status === "approved"
                      ? "text-emerald-700 font-semibold"
                      : "text-ink/40"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      app.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-sand text-ink/40"
                    }`}
                  >
                    {app.status === "approved" ? "✓" : "3"}
                  </span>
                  <span>3. Wholesale Active</span>
                </div>
              </div>
            </div>

            {/* Approved Celebration Banner & Shop Link */}
            {app.status === "approved" && (
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal/10 to-sand p-4 text-xs text-ink/80 flex flex-wrap items-center justify-between gap-3 border border-emerald-200">
                <div className="flex items-start gap-2">
                  <Sparkles className="size-4 shrink-0 mt-0.5 text-teal-dark" />
                  <div>
                    <strong>Your Wholesale Account is Active!</strong> Your{" "}
                    <strong>{app.discountRate || 25}% commercial rate</strong> is unlocked. You can
                    browse the collection or message our executive desk for custom batches.
                  </div>
                </div>
                <Link
                  href={`/${lang}/shop`}
                  className="rounded-full bg-teal px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-dark transition"
                >
                  Browse Catalog →
                </Link>
              </div>
            )}

            {/* Expandable Inline Details Editor */}
            {isEditingDetails && (
              <form
                onSubmit={handleUpdateDetails}
                className="mt-6 space-y-4 rounded-2xl border border-mauve/20 bg-sand/30 p-5 animate-fade-in"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink/70">
                  Update Facility & Billing Details
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[11px] text-ink/60">Phone</label>
                    <input
                      type="text"
                      value={app.phone || ""}
                      onChange={(e) => setApp({ ...app, phone: e.target.value })}
                      className="input-field mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink/60">EU VAT ID</label>
                    <input
                      type="text"
                      value={app.vatId || ""}
                      onChange={(e) => setApp({ ...app, vatId: e.target.value })}
                      className="input-field mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink/60">Est. Volume</label>
                    <input
                      type="text"
                      value={app.estimatedVolume || ""}
                      onChange={(e) => setApp({ ...app, estimatedVolume: e.target.value })}
                      className="input-field mt-0.5 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingDetails(false)}
                    className="rounded-full px-4 py-1.5 text-xs text-ink/60 hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingDetails}
                    className="rounded-full bg-teal px-5 py-1.5 text-xs font-semibold text-white hover:bg-teal-dark transition"
                  >
                    {savingDetails ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {app.status === "approved" && (
            <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-mauve/10 pb-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-dark">
                  Customer catalog
                </span>
                <h3 className="font-serif text-2xl text-ink">Add products to your business catalog</h3>
                <p className="text-xs text-ink/60">
                  Select any available customer product. Your assigned business discount will be applied.
                </p>
              </div>
              {catalogError && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{catalogError}</p>
              )}
              {catalogProducts.length ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catalogProducts.map((product: any) => {
                    const productKey = product.slug || product.id || product.name;
                    const alreadyAdded = (app.products || []).some(
                      (assigned: any) => assigned.name === product.name
                    );
                    const price = Number(product.price || 0);
                    return (
                      <div key={productKey} className="rounded-2xl border border-mauve/15 bg-sand/20 p-4">
                        <img
                          src={product.image || "/products/somnobalance-roll-on.jpg"}
                          alt=""
                          className="h-32 w-full rounded-xl object-cover"
                        />
                        <h4 className="mt-3 font-semibold text-ink">{product.name}</h4>
                        <p className="mt-1 line-clamp-2 text-xs text-ink/60">
                          {product.description || product.tagline || "SomnoBalance product"}
                        </p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="font-serif text-lg font-bold text-teal-dark">
                            €{price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddCatalogProduct(product)}
                            disabled={alreadyAdded || addingCatalogProduct === productKey}
                            className="rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {alreadyAdded
                              ? "Added"
                              : addingCatalogProduct === productKey
                              ? "Adding..."
                              : "Add product"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-sand/30 p-6 text-center text-sm text-ink/60">
                  No customer products are available yet.
                </p>
              )}
            </div>
          )}

          {/* Business-only catalog with per-account discounts and quantities */}
          <div className="rounded-3xl border border-teal/20 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mauve/10 pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-dark">Your business catalog</span>
                <h3 className="font-serif text-2xl text-ink">Products and quantities</h3>
                <p className="text-xs text-ink/60">Choose the quantities you need. Your assigned account discount is applied per product.</p>
              </div>
              <button type="button" onClick={handleRequestBusinessOrder} className="rounded-full bg-teal px-5 py-2 text-xs font-semibold text-white hover:bg-teal-dark disabled:opacity-50" disabled={!Object.values(businessQuantities).some((quantity) => quantity > 0)}>
                Request business order
              </button>
            </div>
            {app.products?.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {app.products.map((product: any) => {
                  const quantity = Number(businessQuantities[product.id] || 0);
                  const unitPrice = Number(product.retailPrice) * (1 - Number(product.discountRate || 0) / 100);
                  return (
                    <div key={product.id} className="rounded-2xl border border-mauve/15 bg-sand/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-ink">{product.name}</h4>
                          <p className="mt-1 text-xs text-ink/60">{product.description || "Business product"}</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">{product.discountRate}% off</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-ink/50 line-through">€{Number(product.retailPrice).toFixed(2)}</span>
                          <p className="font-serif text-xl font-bold text-teal-dark">€{unitPrice.toFixed(2)} <span className="text-[10px] font-sans font-normal text-ink/50">per unit</span></p>
                        </div>
                        <label className="text-right text-[10px] font-semibold uppercase text-ink/50">
                          Quantity
                          <input type="number" min={0} max={product.maxQuantity || 1000} value={quantity} onChange={(event) => setBusinessQuantities((current) => ({ ...current, [product.id]: Number(event.target.value) }))} className="input-field mt-1 w-24 text-center text-sm" />
                        </label>
                      </div>
                      <p className="mt-2 text-right text-xs font-semibold text-ink">Subtotal: €{(unitPrice * quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-sand/30 p-6 text-center text-sm text-ink/60">Your business products will appear here after the admin assigns them to your account.</p>
            )}
          </div>

          {/* 2-Way Live Desk Chat */}
          <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-mauve/10 pb-4">
              <div>
                <h3 className="font-serif text-xl text-ink">SomnoBalance Executive B2B Desk</h3>
                <p className="text-xs text-ink/60">
                  Direct live line with your dedicated commercial account director
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-700">Live Desk Online</span>
              </div>
            </div>

            {/* Quick Inquiry Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    null as any,
                    "Hello, we would like to request an evaluation sample amenity kit sent to our facility."
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-3.5 py-1.5 text-xs text-ink/80 hover:border-teal hover:bg-teal/10 hover:text-teal-dark transition"
              >
                <Package className="size-3" /> Request Sample Kit
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    null as any,
                    "Could you provide an official EU VAT Reverse-Charge pro-forma invoice quote for our accounting department?"
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-3.5 py-1.5 text-xs text-ink/80 hover:border-teal hover:bg-teal/10 hover:text-teal-dark transition"
              >
                <FileText className="size-3" /> Request Pro-Forma Invoice
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    null as any,
                    "What are the standard delivery lead times for a 100+ unit restock order?"
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-3.5 py-1.5 text-xs text-ink/80 hover:border-teal hover:bg-teal/10 hover:text-teal-dark transition"
              >
                <Truck className="size-3" /> Ask about Delivery Lead Times
              </button>
            </div>

            {/* Message Thread */}
            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-2 rounded-2xl bg-sand/20 p-4 border border-mauve/10">
              {!app.messages || app.messages.length === 0 ? (
                <p className="text-center text-sm text-ink/50 py-10">
                  No messages yet. Send a note below or click one of the quick actions above.
                </p>
              ) : (
                app.messages.map((msg: any) => {
                  const isAdminMsg = msg.senderRole === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdminMsg ? "items-start" : "items-end"} animate-fade-in`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-ink/50 mb-1">
                        <span className="font-semibold text-ink/70">
                          {isAdminMsg ? "SomnoBalance Executive Desk" : msg.senderName || "You"}
                        </span>
                        <span>•</span>
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                      </div>
                      <div
                        className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                          isAdminMsg
                            ? "border border-teal/20 bg-white text-ink"
                            : "bg-mauve text-white"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your inquiry or custom batch requirement..."
                className="input-field flex-1 text-sm"
              />
              <button
                type="submit"
                disabled={sendingMsg || !chatMessage.trim()}
                className="rounded-full bg-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-50 transition shadow-xs flex items-center gap-2"
              >
                {sendingMsg ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
