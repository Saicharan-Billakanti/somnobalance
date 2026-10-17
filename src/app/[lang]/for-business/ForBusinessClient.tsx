"use client";
import { localizeError } from "@/lib/localizeError";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { Package, Pencil, FileText, Truck, Sparkles } from "lucide-react";
import { BusinessLanding } from "./BusinessLanding";

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
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const [tab, setTab] = useState<"apply" | "portal">(initialApp ? "portal" : "apply");
  const [app, setApp] = useState<any>(initialApp);

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
        setCatalogError(localizeError(data.error || "Unable to add this product to your business catalog.", lang));
        return;
      }
      if (data.application) {
        setApp(data.application);
      }
    } catch {
      setCatalogError(tx("Network error. Please try again.", "Netzwerkfehler. Bitte versuchen Sie es erneut."));
    } finally {
      setAddingCatalogProduct(null);
    }
  };

  const tabBar = app && (
    <div className="flex justify-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-sand/80 p-1.5 text-sm font-medium shadow-inner">
        <button
          onClick={() => setTab("apply")}
          className={`rounded-full px-5 py-2 transition ${
            tab === "apply" ? "bg-white text-ink shadow-sm font-semibold" : "text-ink/60 hover:text-ink"
          }`}
        >
          {dict.forBusiness.portal.tabEnquiry}
        </button>
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
              ✓ {tx("Active", "Aktiv")}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // Public landing page: first-time visitors (and anyone on the enquiry tab)
  // see the B2B positioning + short enquiry form, with no portal/contract step.
  if (tab === "apply" || !app) {
    return (
      <div>
        {tabBar && <div className="px-4 pt-8 sm:px-6">{tabBar}</div>}
        <BusinessLanding lang={lang} dict={dict} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-dark">
          {dict.forBusiness.portal.eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-3xl text-ink sm:text-5xl">{dict.forBusiness.portal.title}</h1>
      </div>

      <div className="mt-10">{tabBar}</div>

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
                    Status: {app.status === "approved" ? `✓ ${tx("Approved", "Genehmigt")}` : app.status === "pending" ? tx("pending", "in Prüfung") : app.status === "rejected" ? tx("rejected", "abgelehnt") : app.status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink/60">
                  {tx("Contact", "Kontakt")}: <strong className="text-ink">{app.contactName}</strong> ({app.email}) •{" "}
                  {tx("VAT ID", "USt-IdNr.")}: {app.vatId || tx("Not specified", "Nicht angegeben")} • {tx("Location", "Standort")}: {app.city || tx("Germany", "Deutschland")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {app.status === "approved" && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-900 font-semibold">
                      {tx("Assigned Wholesale Rate", "Zugewiesener Großhandelspreis")}
                    </span>
                    <div className="font-serif text-2xl font-bold text-emerald-800">
                      {app.discountRate || 25}% {tx("OFF", "RABATT")}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsEditingDetails(!isEditingDetails)}
                  className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-sand transition"
                >
                  {isEditingDetails ? tx("Close Editor", "Editor schließen") : <><Pencil className="size-3" /> {tx("Edit Details", "Daten bearbeiten")}</>}
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
                  <span>{tx("1. Application Queued", "1. Antrag eingegangen")}</span>
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
                  <span>{tx("2. Desk Review", "2. Prüfung")}</span>
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
                  <span>{tx("3. Wholesale Active", "3. Großhandel aktiv")}</span>
                </div>
              </div>
            </div>

            {/* Approved Celebration Banner & Shop Link */}
            {app.status === "approved" && (
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal/10 to-sand p-4 text-xs text-ink/80 flex flex-wrap items-center justify-between gap-3 border border-emerald-200">
                <div className="flex items-start gap-2">
                  <Sparkles className="size-4 shrink-0 mt-0.5 text-teal-dark" />
                  <div>
                    <strong>{tx("Your Wholesale Account is Active!", "Ihr Großhandelskonto ist aktiv!")}</strong> {tx("Your", "Ihr")}{" "}
                    <strong>{app.discountRate || 25}% {tx("commercial rate", "Gewerbetarif")}</strong> {tx("is unlocked. You can browse the collection or message our executive desk for custom batches.", "ist freigeschaltet. Sie können die Kollektion durchstöbern oder unserem Executive Desk für individuelle Chargen schreiben.")}
                  </div>
                </div>
                <Link
                  href={`/${lang}/shop`}
                  className="rounded-full bg-teal px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-dark transition"
                >
                  {tx("Browse Catalog →", "Katalog ansehen →")}
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
                  {tx("Update Facility & Billing Details", "Einrichtungs- & Rechnungsdaten aktualisieren")}
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[11px] text-ink/60">{tx("Phone", "Telefon")}</label>
                    <input
                      type="text"
                      value={app.phone || ""}
                      onChange={(e) => setApp({ ...app, phone: e.target.value })}
                      className="input-field mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink/60">{tx("EU VAT ID", "EU-USt-IdNr.")}</label>
                    <input
                      type="text"
                      value={app.vatId || ""}
                      onChange={(e) => setApp({ ...app, vatId: e.target.value })}
                      className="input-field mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink/60">{tx("Est. Volume", "Gesch. Menge")}</label>
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
                    {tx("Cancel", "Abbrechen")}
                  </button>
                  <button
                    type="submit"
                    disabled={savingDetails}
                    className="rounded-full bg-teal px-5 py-1.5 text-xs font-semibold text-white hover:bg-teal-dark transition"
                  >
                    {savingDetails ? tx("Saving…", "Wird gespeichert…") : tx("Save Changes", "Änderungen speichern")}
                  </button>
                </div>
              </form>
            )}
          </div>

          {app.status === "approved" && (
            <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-mauve/10 pb-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-dark">
                  {tx("Customer catalog", "Kundenkatalog")}
                </span>
                <h3 className="font-serif text-2xl text-ink">{tx("Add products to your business catalog", "Produkte zu Ihrem Geschäftskatalog hinzufügen")}</h3>
                <p className="text-xs text-ink/60">
                  {tx("Select any available customer product. Your assigned business discount will be applied.", "Wählen Sie ein beliebiges verfügbares Kundenprodukt. Ihr zugewiesener Geschäftsrabatt wird angewendet.")}
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
                          src={product.image || "/products/somnobalance-roll-on.webp"}
                          alt=""
                          className="h-32 w-full rounded-xl object-cover"
                        />
                        <h4 className="mt-3 font-semibold text-ink">{product.name}</h4>
                        <p className="mt-1 line-clamp-2 text-xs text-ink/60">
                          {product.description || product.tagline || tx("SomnoBalance product", "SomnoBalance Produkt")}
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
                              ? tx("Added", "Hinzugefügt")
                              : addingCatalogProduct === productKey
                              ? tx("Adding...", "Wird hinzugefügt...")
                              : tx("Add product", "Produkt hinzufügen")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-sand/30 p-6 text-center text-sm text-ink/60">
                  {tx("No customer products are available yet.", "Noch keine Kundenprodukte verfügbar.")}
                </p>
              )}
            </div>
          )}

          {/* Business-only catalog with per-account discounts and quantities */}
          <div className="rounded-3xl border border-teal/20 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mauve/10 pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-dark">{tx("Your business catalog", "Ihr Geschäftskatalog")}</span>
                <h3 className="font-serif text-2xl text-ink">{tx("Products and quantities", "Produkte und Mengen")}</h3>
                <p className="text-xs text-ink/60">{tx("Choose the quantities you need. Your assigned account discount is applied per product.", "Wählen Sie die benötigten Mengen. Ihr zugewiesener Kontorabatt wird je Produkt angewendet.")}</p>
              </div>
              <button type="button" onClick={handleRequestBusinessOrder} className="rounded-full bg-teal px-5 py-2 text-xs font-semibold text-white hover:bg-teal-dark disabled:opacity-50" disabled={!Object.values(businessQuantities).some((quantity) => quantity > 0)}>
                {tx("Request business order", "Geschäftsbestellung anfragen")}
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
                          <p className="mt-1 text-xs text-ink/60">{product.description || tx("Business product", "Geschäftsprodukt")}</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">{product.discountRate}% {tx("off", "Rabatt")}</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-ink/50 line-through">€{Number(product.retailPrice).toFixed(2)}</span>
                          <p className="font-serif text-xl font-bold text-teal-dark">€{unitPrice.toFixed(2)} <span className="text-[10px] font-sans font-normal text-ink/50">{tx("per unit", "pro Stück")}</span></p>
                        </div>
                        <label className="text-right text-[10px] font-semibold uppercase text-ink/50">
                          {tx("Quantity", "Menge")}
                          <input type="number" min={0} max={product.maxQuantity || 1000} value={quantity} onChange={(event) => setBusinessQuantities((current) => ({ ...current, [product.id]: Number(event.target.value) }))} className="input-field mt-1 w-24 text-center text-sm" />
                        </label>
                      </div>
                      <p className="mt-2 text-right text-xs font-semibold text-ink">{tx("Subtotal", "Zwischensumme")}: €{(unitPrice * quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-sand/30 p-6 text-center text-sm text-ink/60">{tx("Your business products will appear here after the admin assigns them to your account.", "Ihre Geschäftsprodukte erscheinen hier, sobald sie Ihrem Konto vom Admin zugewiesen wurden.")}</p>
            )}
          </div>

          {/* 2-Way Live Desk Chat */}
          <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-mauve/10 pb-4">
              <div>
                <h3 className="font-serif text-xl text-ink">{tx("SomnoBalance Executive B2B Desk", "SomnoBalance Executive B2B Desk")}</h3>
                <p className="text-xs text-ink/60">
                  {tx("Direct live line with your dedicated commercial account director", "Direkter Draht zu Ihrem persönlichen Geschäftskunden-Betreuer")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-700">{tx("Live Desk Online", "Live-Desk online")}</span>
              </div>
            </div>

            {/* Quick Inquiry Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    null as any,
                    tx("Hello, we would like to request an evaluation sample amenity kit sent to our facility.", "Guten Tag, wir möchten ein Evaluations-Musterset für unsere Einrichtung anfordern.")
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-3.5 py-1.5 text-xs text-ink/80 hover:border-teal hover:bg-teal/10 hover:text-teal-dark transition"
              >
                <Package className="size-3" /> {tx("Request Sample Kit", "Musterset anfordern")}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    null as any,
                    tx("Could you provide an official EU VAT Reverse-Charge pro-forma invoice quote for our accounting department?", "Könnten Sie uns ein offizielles Pro-forma-Angebot mit EU-Reverse-Charge für unsere Buchhaltung zusenden?")
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-3.5 py-1.5 text-xs text-ink/80 hover:border-teal hover:bg-teal/10 hover:text-teal-dark transition"
              >
                <FileText className="size-3" /> {tx("Request Pro-Forma Invoice", "Proforma-Rechnung anfordern")}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    null as any,
                    tx("What are the standard delivery lead times for a 100+ unit restock order?", "Wie lang sind die üblichen Lieferzeiten für eine Nachbestellung ab 100 Stück?")
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-mauve/20 bg-sand/40 px-3.5 py-1.5 text-xs text-ink/80 hover:border-teal hover:bg-teal/10 hover:text-teal-dark transition"
              >
                <Truck className="size-3" /> {tx("Ask about Delivery Lead Times", "Lieferzeiten erfragen")}
              </button>
            </div>

            {/* Message Thread */}
            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-2 rounded-2xl bg-sand/20 p-4 border border-mauve/10">
              {!app.messages || app.messages.length === 0 ? (
                <p className="text-center text-sm text-ink/50 py-10">
                  {tx("No messages yet. Send a note below or click one of the quick actions above.", "Noch keine Nachrichten. Schreiben Sie unten eine Nachricht oder nutzen Sie eine der Schnellaktionen oben.")}
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
                          {isAdminMsg ? "SomnoBalance Executive Desk" : msg.senderName || tx("You", "Sie")}
                        </span>
                        <span>•</span>
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString(lang === "de" ? "de-DE" : "en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : tx("Just now", "Gerade eben")}
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
                placeholder={tx("Type your inquiry or custom batch requirement...", "Geben Sie Ihre Anfrage oder individuelle Anforderung ein...")}
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
                    {tx("Sending…", "Wird gesendet…")}
                  </>
                ) : (
                  tx("Send Message", "Nachricht senden")
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
