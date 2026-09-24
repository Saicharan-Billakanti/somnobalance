"use client";
import { localizeError } from "@/lib/localizeError";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type AccountClientProps = {
  lang: Locale;
  dict: Dictionary;
  initialProfile: any;
  initialOrders: any[];
};

export function AccountClient({
  lang,
  dict,
  initialProfile,
  initialOrders,
}: AccountClientProps) {
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const localizePolicy = (p: string) =>
    lang === "de"
      ? p
          .replace(/^(\d+)-Day Money-Back Guarantee$/, "$1 Tage Geld-zurück-Garantie")
          .replace("30-Night Sleep Trial & Full Refund Guarantee", "30 Nächte Probeschlafen & volle Rückerstattung")
          .replace("100-Night Risk-Free Sleep Trial & Free Return Pickup", "100 Nächte risikofreies Probeschlafen & kostenlose Rückholung")
      : p;
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  // Orders & Return State
  const [orders, setOrders] = useState(initialOrders || []);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any>(null);
  const [returnReason, setReturnReason] = useState("Unsatisfied with comfort");
  const [returnNote, setReturnNote] = useState("");
  const [sealConfirmed, setSealConfirmed] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Profile Edit State
  const initialPhone = initialProfile?.phone || (user as any)?.phone || "";
  const [firstName, setFirstName] = useState(initialProfile?.firstName || user?.firstName || "");
  const [lastName, setLastName] = useState(initialProfile?.lastName || user?.lastName || "");
  const [phone, setPhone] = useState(initialPhone);
  const [street, setStreet] = useState(initialProfile?.street || "");
  const [postalCode, setPostalCode] = useState(initialProfile?.postalCode || "");
  const [city, setCity] = useState(initialProfile?.city || "");
  const [country, setCountry] = useState(initialProfile?.country || "Germany");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Phone OTP Verification State
  const isPhoneChanged = phone.trim() !== initialPhone.trim() && phone.trim().length > 0;
  const [phoneVerified, setPhoneVerified] = useState(!isPhoneChanged);
  const [verificationToken, setVerificationToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  const handleSendPhoneOtp = async () => {
    if (!phone.trim()) {
      setOtpError("Bitte geben Sie eine deutsche Rufnummer ein.");
      return;
    }
    setSendingOtp(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), purpose: "profile_update" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ? localizeError(data.error, lang) : "SMS-Code konnte nicht gesendet werden.");
        if (data.cooldownSeconds) setCooldown(data.cooldownSeconds);
        return;
      }
      setOtpSent(true);
      setMaskedPhone(data.masked || phone);
      setCooldown(data.cooldownSeconds || 60);
      setOtpSuccess(data.message || `Code an ${data.masked || phone} gesendet.`);
    } catch {
      setOtpError("Server nicht erreichbar.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setOtpError("Bitte geben Sie den 6-stelligen SMS-Code ein.");
      return;
    }
    setVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: otpCode.trim(),
          purpose: "profile_update",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ? localizeError(data.error, lang) : "Ungültiger Code.");
        return;
      }
      setVerificationToken(data.verificationToken);
      setPhoneVerified(true);
      setOtpSuccess("✓ Neue Telefonnummer verifiziert!");
    } catch {
      setOtpError("Server nicht erreichbar.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);
    setProfileError(null);

    if (isPhoneChanged && !phoneVerified) {
      setProfileError("Bitte verifizieren Sie Ihre geänderte Telefonnummer per SMS-Code.");
      setSavingProfile(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          phoneVerificationToken: verificationToken || undefined,
          street,
          postalCode,
          city,
          country,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(localizeError(data.error || "Failed to update profile", lang));
        return;
      }
      setUser(data.profile);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch {
      setProfileError(tx("Network error. Please try again.", "Netzwerkfehler. Bitte versuchen Sie es erneut."));
    } finally {
      setSavingProfile(false);
    }
  };

  const isDualRole = Boolean(user?.isAffiliate);
  const isBusiness = Boolean(user?.isBusiness);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal/15 px-3 py-0.5 text-xs font-semibold text-teal-dark uppercase tracking-wider">
                {tx("Customer Account & Orders", "Kundenkonto & Bestellungen")}
              </span>
              {isDualRole && (
                <span className="rounded-full bg-mauve/15 px-3 py-0.5 text-xs font-semibold text-mauve-dark">
                  ⭐ {tx("Partner", "Partner")}
                </span>
              )}
              {isBusiness && (
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                  🏢 {tx("B2B Member", "B2B-Mitglied")}
                </span>
              )}
            </div>
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
              {tx("Hello", "Hallo")}, {firstName || user?.firstName || tx("Customer", "Kunde")} {lastName || user?.lastName || ""}
            </h1>
            <p className="text-xs text-ink/60 mt-0.5">
              {initialProfile?.email || user?.email} • {tx("Member since 2026", "Mitglied seit 2026")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${lang}/shop`}
              className="rounded-full bg-teal px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-dark transition shadow-sm"
            >
              🛒 {tx("Continue Shopping", "Weiter einkaufen")}
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-mauve/15 pb-4">
        <button
          onClick={() => setTab("orders")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition ${
            tab === "orders"
              ? "bg-teal text-white shadow-sm"
              : "border border-mauve/20 bg-white text-ink/70 hover:bg-sand"
          }`}
        >
          <span>📦</span> {tx("My Orders & Tracking", "Meine Bestellungen & Sendungsverfolgung")} ({orders.length})
        </button>

        <button
          onClick={() => setTab("profile")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition ${
            tab === "profile"
              ? "bg-teal text-white shadow-sm"
              : "border border-mauve/20 bg-white text-ink/70 hover:bg-sand"
          }`}
        >
          <span>👤</span> {tx("Profile & Shipping Address", "Profil & Lieferadresse")}
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {tab === "orders" && (
        <div className="mt-8 space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-mauve/15 bg-white p-12 text-center">
              <span className="text-3xl">📦</span>
              <h3 className="mt-3 font-serif text-xl text-ink">{tx("No orders found yet", "Noch keine Bestellungen gefunden")}</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-ink/60">
                {tx("You haven't placed any orders yet. Explore our sleep and ritual collection to begin.", "Sie haben noch keine Bestellungen aufgegeben. Entdecken Sie unsere Schlaf- und Ritualkollektion.")}
              </p>
              <Link
                href={`/${lang}/shop`}
                className="mt-6 inline-block rounded-full bg-mauve px-6 py-2.5 text-xs font-semibold text-white hover:bg-mauve-dark"
              >
                {tx("Browse Shop →", "Zum Shop →")}
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isDelivered = order.deliveryStatus === "DELIVERED";
              const isInTransit = order.deliveryStatus === "IN_TRANSIT" || order.status === "PAID";

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm transition hover:border-teal/30 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mauve/10 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-ink">
                          {tx("Order", "Bestellung")} #{order.id.slice(0, 12)}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-teal/15 text-teal-dark"
                          }`}
                        >
                          ● {isDelivered ? tx("Delivered", "Zugestellt") : tx("In Transit", "Unterwegs")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink/50">
                        {tx("Placed on", "Bestellt am")} {new Date(order.createdAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { day: "2-digit", month: "short", year: "numeric" })} • {tx("Payment", "Zahlung")}: {order.paymentMethod || tx("Card / PayPal", "Karte / PayPal")}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-ink/50">{tx("Total Amount", "Gesamtbetrag")}</span>
                      <div className="font-serif text-xl font-bold text-teal-dark">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* Return & Refund Policy Window Card (Driven by Admin Settings) */}
                  {(() => {
                    const orderDate = new Date(order.createdAt || Date.now());
                    const returnDays = order.returnPeriodDays ?? 30;
                    const refundPolicy = order.refundPolicy || `${returnDays}-Day Money-Back Guarantee`;
                    const deadline = new Date(orderDate.getTime() + returnDays * 24 * 60 * 60 * 1000);
                    const now = new Date();
                    const diffTime = deadline.getTime() - now.getTime();
                    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isRefunded = order.status === "REFUNDED" || order.returnStatus === "REFUNDED";
                    const isReturnActive = diffTime > 0 && order.status !== "CANCELLED" && !isRefunded;
                    const isReturnRequested = order.returnStatus === "REQUESTED" || order.returnStatus === "APPROVED";

                    return (
                      <div
                        className={`mt-5 rounded-2xl border p-4 sm:p-5 ${
                          isRefunded
                            ? "border-emerald-200 bg-emerald-50/70"
                            : "border-teal/20 bg-teal/5"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-lg shadow-sm ${
                                isRefunded ? "bg-emerald-600" : "bg-teal"
                              }`}
                            >
                              {isRefunded ? "✓" : "🛡️"}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-sm font-bold text-ink">
                                  {isRefunded ? tx("Refund Processed via Stripe", "Erstattung über Stripe verarbeitet") : localizePolicy(refundPolicy)}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                    isRefunded
                                      ? "bg-emerald-200/80 text-emerald-900"
                                      : "bg-teal/15 text-teal-dark"
                                  }`}
                                >
                                  {isRefunded ? tx("Payment Reimbursed", "Zahlung erstattet") : `${returnDays} ${tx("Days Return Window", "Tage Rückgabefrist")}`}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-ink/70">
                                {isRefunded ? (
                                  <span className="font-medium text-emerald-800">
                                    {tx("Full refund of", "Vollständige Erstattung von")} <strong>{formatPrice(order.total)}</strong> {tx("credited back via Stripe to your original payment method.", "wurde über Stripe auf Ihre ursprüngliche Zahlungsmethode zurückgebucht.")} {order.refundTransactionId ? `(${tx("Ref", "Ref.")}: ${order.refundTransactionId})` : ""}
                                  </span>
                                ) : isReturnRequested ? (
                                  <span className="font-semibold text-amber-700">
                                    🔄 {tx("Return request received — DHL GoGreen prepaid return QR code generated.", "Rücksendeanfrage erhalten — vorfrankierter DHL-GoGreen-Rücksende-QR-Code wurde erstellt.")}
                                  </span>
                                ) : isReturnActive ? (
                                  <>
                                    <span className="font-semibold text-teal-dark">
                                      {lang === "de" ? `Noch ${daysRemaining} ${daysRemaining === 1 ? "Tag" : "Tage"}` : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`}
                                    </span>{" "}
                                    {tx("to trial & request full refund (Eligible until", "zum Testen & für die volle Erstattung (Möglich bis")}{" "}
                                    <strong className="text-ink">
                                      {deadline.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                                    </strong>
                                    )
                                  </>
                                ) : (
                                  <span className="text-ink/50">
                                    {tx("Return window expired on", "Rückgabefrist abgelaufen am")}{" "}
                                    {deadline.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div>
                            {isRefunded ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-800">
                                ✓ {tx("Refund Completed", "Erstattung abgeschlossen")}
                              </span>
                            ) : isReturnRequested ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-800">
                                ⏳ {tx("Return In Review", "Rücksendung in Prüfung")}
                              </span>
                            ) : isReturnActive ? (
                              <button
                                onClick={() => {
                                  setSelectedReturnOrder(order);
                                  setReturnReason("comfort_expectation");
                                  setReturnNote("");
                                  setReturnSubmitted(false);
                                }}
                                className="rounded-full bg-white border border-teal/30 px-4 py-2 text-xs font-semibold text-teal-dark hover:bg-teal hover:text-white transition shadow-sm"
                              >
                                🔄 {tx("Request Return / Refund", "Rückgabe / Erstattung anfragen")}
                              </button>
                            ) : (
                              <span className="text-[11px] text-ink/40 font-medium italic">
                                {tx("Window Closed", "Frist abgelaufen")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* DHL Live Tracking Timeline */}
                  <div className="mt-6 rounded-2xl bg-sand/40 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-mauve/10">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-ink">{tx("Courier:", "Versanddienstleister:")}</span>
                        <span className="rounded bg-white px-2 py-0.5 text-xs text-teal-dark font-semibold">
                          {order.carrier || "DHL GoGreen"}
                        </span>
                        <span className="font-bold text-ink ml-2">{tx("Tracking No:", "Sendungsnummer:")}</span>
                        <span className="font-mono text-xs text-ink/80 bg-white px-2 py-0.5 rounded">
                          {order.trackingNumber || "DHL-DE-8921471094"}
                        </span>
                      </div>

                      <span className="text-[11px] text-ink/60 font-medium">
                        {isDelivered ? tx("Delivered to recipient", "An Empfänger zugestellt") : tx("Estimated Arrival: 1-2 Business Days", "Voraussichtliche Ankunft: 1–2 Werktage")}
                      </span>
                    </div>

                    {/* Timeline visual */}
                    <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <span className="mt-2 font-semibold text-ink">{tx("Order Paid", "Bestellung bezahlt")}</span>
                        <span className="text-[10px] text-ink/50">{tx("Verified", "Bestätigt")}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <span className="mt-2 font-semibold text-ink">{tx("Packed", "Verpackt")}</span>
                        <span className="text-[10px] text-ink/50">{tx("Logistics Hub", "Logistikzentrum")}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                            isInTransit ? "bg-teal text-white animate-pulse" : "bg-teal text-white"
                          }`}
                        >
                          🚚
                        </div>
                        <span className="mt-2 font-semibold text-teal-dark">{tx("In Transit", "Unterwegs")}</span>
                        <span className="text-[10px] text-ink/50">{tx("DHL Hub", "DHL-Hub")}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            isDelivered ? "bg-teal text-white" : "bg-sand-dark text-ink/40"
                          }`}
                        >
                          {isDelivered ? "✓" : "🏠"}
                        </div>
                        <span className={`mt-2 font-semibold ${isDelivered ? "text-ink" : "text-ink/40"}`}>
                          {tx("Delivery", "Zustellung")}
                        </span>
                        <span className="text-[10px] text-ink/40">{tx("Recipient", "Empfänger")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-ink">
                        {tx("Items in this Parcel", "Artikel in diesem Paket")} ({(order.items || []).length})
                      </h4>
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="text-xs text-teal-dark font-medium hover:underline"
                      >
                        {isExpanded ? tx("Hide Details ▲", "Details ausblenden ▲") : tx("Show Full Details ▼", "Alle Details anzeigen ▼")}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-2">
                        {(order.items || []).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl border border-mauve/10 bg-white p-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="rounded bg-sand px-2 py-1 text-[11px] font-bold text-ink/70">
                                {item.qty}x
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-ink">{item.name}</span>
                                  {item.refundPolicy && (
                                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[9px] font-semibold text-teal-dark">
                                      🛡️ {localizePolicy(item.refundPolicy)}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-ink/50 font-mono">
                                  {item.slug} • {tx("Return period", "Rückgabefrist")}: {item.returnPeriodDays ?? order.returnPeriodDays ?? 30} {tx("days", "Tage")}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold text-ink">
                              {formatPrice(item.price * item.qty)}
                            </div>
                          </div>
                        ))}

                        {/* Delivery Address Details */}
                        <div className="mt-4 rounded-xl bg-sand/30 p-4 text-xs text-ink/70">
                          <strong className="text-ink">{tx("Delivery Destination:", "Lieferadresse:")}</strong>
                          <div className="mt-1">
                            {order.firstName} {order.lastName} • {order.street}, {order.postalCode} {order.city}, {order.country}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: EDIT PROFILE & SHIPPING ADDRESS */}
      {tab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="mt-8 max-w-3xl rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-10 space-y-6"
        >
          <div>
            <h2 className="font-serif text-2xl text-ink">{tx("Profile Details & Delivery Address", "Profildaten & Lieferadresse")}</h2>
            <p className="text-xs text-ink/60 mt-1">
              {tx("Update your contact information, phone number, and primary shipping address for fast checkout.", "Aktualisieren Sie Ihre Kontaktdaten, Telefonnummer und Hauptlieferadresse für eine schnellere Kasse.")}
            </p>
          </div>

          {profileSuccess && (
            <div className="rounded-2xl bg-teal/15 p-4 text-xs font-semibold text-teal-dark">
              ✓ {tx("Profile information updated successfully!", "Profildaten erfolgreich aktualisiert!")}
            </div>
          )}

          {profileError && (
            <div className="rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-600">
              {profileError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ink/70">{tx("First Name *", "Vorname *")}</label>
              <input
                required
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/70">{tx("Last Name *", "Nachname *")}</label>
              <input
                required
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-field mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ink/70">{tx("Email Address (Account ID)", "E-Mail-Adresse (Konto-ID)")}</label>
              <input
                disabled
                type="email"
                value={initialProfile?.email || user?.email || ""}
                className="input-field mt-1 opacity-70 bg-sand/40 cursor-not-allowed"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-ink/70">Mobilfunknummer (Deutschland +49)</label>
                {phoneVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                    ✓ Verifiziert
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    const changed = e.target.value.trim() !== initialPhone.trim() && e.target.value.trim().length > 0;
                    setPhoneVerified(!changed);
                    setOtpSent(false);
                    setVerificationToken("");
                    setOtpError(null);
                    setOtpSuccess(null);
                  }}
                  placeholder="+49 170 1234567 oder 0170..."
                  className="input-field flex-1 text-xs"
                />
                {isPhoneChanged && !phoneVerified && (
                  <button
                    type="button"
                    disabled={sendingOtp || cooldown > 0 || !phone.trim()}
                    onClick={handleSendPhoneOtp}
                    className="shrink-0 rounded-xl bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal-dark disabled:opacity-50 transition shadow-sm"
                  >
                    {sendingOtp
                      ? "Senden…"
                      : cooldown > 0
                      ? `${cooldown}s`
                      : otpSent
                      ? "Erneut senden"
                      : "SMS anfordern"}
                  </button>
                )}
              </div>

              {/* OTP Confirmation Form */}
              {isPhoneChanged && otpSent && !phoneVerified && (
                <div className="mt-2 rounded-xl bg-sand/40 p-3 space-y-2 border border-mauve/15">
                  <p className="text-[11px] text-ink/80">
                    SMS-Code an {maskedPhone} eingegeben:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-stelliger Code"
                      className="input-field text-center font-mono tracking-widest text-xs"
                    />
                    <button
                      type="button"
                      disabled={verifyingOtp || otpCode.length < 6}
                      onClick={handleVerifyPhoneOtp}
                      className="shrink-0 rounded-xl bg-mauve px-3 py-2 text-xs font-semibold text-white hover:bg-mauve-dark disabled:opacity-50 transition shadow-sm"
                    >
                      {verifyingOtp ? "Prüfen…" : "Bestätigen"}
                    </button>
                  </div>
                </div>
              )}

              {otpSuccess && <p className="mt-1 text-[11px] text-emerald-700 font-medium">{otpSuccess}</p>}
              {otpError && <p className="mt-1 text-[11px] text-red-600 font-medium">{otpError}</p>}
            </div>
          </div>

          <div className="border-t border-mauve/10 pt-4 space-y-4">
            <h3 className="font-serif text-base font-bold text-ink">{tx("Primary Shipping Address", "Hauptlieferadresse")}</h3>

            <div>
              <label className="text-xs font-medium text-ink/70">{tx("Street & House Number", "Straße & Hausnummer")}</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder={tx("e.g. Maximilianstraße 22", "z. B. Maximilianstraße 22")}
                className="input-field mt-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-ink/70">{tx("Postal Code", "Postleitzahl")}</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="80539"
                  className="input-field mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-ink/70">{tx("City", "Stadt")}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="München"
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink/70">{tx("Country", "Land")}</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field mt-1"
              >
                <option value="Germany">{tx("Germany", "Deutschland")}</option>
                <option value="Austria">{tx("Austria", "Österreich")}</option>
                <option value="Switzerland">{tx("Switzerland", "Schweiz")}</option>
                <option value="Netherlands">{tx("Netherlands", "Niederlande")}</option>
                <option value="France">{tx("France", "Frankreich")}</option>
                <option value="Italy">{tx("Italy", "Italien")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-full bg-mauve px-8 py-3.5 text-sm font-semibold text-white hover:bg-mauve-dark disabled:opacity-60 transition shadow-sm"
            >
              {savingProfile ? tx("Saving Details…", "Wird gespeichert…") : tx("Save Profile Details", "Profildaten speichern")}
            </button>
          </div>
        </form>
      )}

      {/* RETURN & REFUND REQUEST MODAL */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setSelectedReturnOrder(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-sand text-ink/70 hover:bg-mauve hover:text-white transition"
            >
              ✕
            </button>

            {!returnSubmitted ? (
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal/15 text-xl">
                    🛡️
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ink">
                      {tx("Request Return & Refund", "Rückgabe & Erstattung anfragen")}
                    </h3>
                    <p className="text-xs text-ink/60">
                      {tx("Order", "Bestellung")} #{selectedReturnOrder.id.slice(0, 12)} • {selectedReturnOrder.refundPolicy ? localizePolicy(selectedReturnOrder.refundPolicy) : `${selectedReturnOrder.returnPeriodDays || 30}${tx("-Day Guarantee", "-Tage-Garantie")}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-sand/40 p-4 text-xs text-ink/70 space-y-2">
                  <div className="flex justify-between">
                    <span>{tx("Refund Amount:", "Erstattungsbetrag:")}</span>
                    <strong className="text-ink font-serif">{formatPrice(selectedReturnOrder.total)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{tx("Return Policy:", "Rückgaberegelung:")}</span>
                    <strong className="text-teal-dark">{selectedReturnOrder.returnPeriodDays || 30} {tx("Days Guarantee", "Tage Garantie")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{tx("Courier Service:", "Versanddienstleister:")}</span>
                    <span className="text-ink font-medium">{tx("DHL GoGreen (Prepaid Drop-off)", "DHL GoGreen (vorfrankierte Abgabe)")}</span>
                  </div>

                  {/* Specific Admin Return Rules & Seal Breakage Condition */}
                  <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50/80 p-3 text-[11px] text-amber-950">
                    <strong className="font-bold flex items-center gap-1 text-amber-950">
                      <span>⚠️ {tx("Mandatory Return Condition:", "Verbindliche Rückgabebedingung:")}</span>
                    </strong>
                    <p className="mt-1 leading-relaxed text-amber-900">
                      {selectedReturnOrder.refundRules ||
                        tx("Hygienic seal must be intact and unbroken upon return. Items must be in original unsoiled packaging to qualify for a full refund.", "Das Hygienesiegel muss bei der Rücksendung intakt und unversehrt sein. Artikel müssen sich in unbeschmutzter Originalverpackung befinden, um eine volle Erstattung zu erhalten.")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-ink">
                      {tx("Reason for Return *", "Rückgabegrund *")}
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="input-field mt-1"
                    >
                      <option value="comfort_expectation">
                        {tx("Trial sleep comfort did not match expectations", "Der Schlafkomfort beim Probeschlafen entsprach nicht den Erwartungen")}
                      </option>
                      <option value="wrong_size_or_variant">
                        {tx("Incorrect size, color, or ergonomic fit", "Falsche Größe, Farbe oder ergonomische Passform")}
                      </option>
                      <option value="arrived_damaged">
                        {tx("Product arrived damaged or defective", "Produkt ist beschädigt oder defekt angekommen")}
                      </option>
                      <option value="mind_changed">
                        {tx("Changed mind within statutory return window", "Umentschieden innerhalb der gesetzlichen Widerrufsfrist")}
                      </option>
                      <option value="other">{tx("Other reason", "Anderer Grund")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-ink">
                      {tx("Additional Notes / Feedback (Optional)", "Zusätzliche Hinweise / Feedback (optional)")}
                    </label>
                    <textarea
                      rows={2}
                      value={returnNote}
                      onChange={(e) => setReturnNote(e.target.value)}
                      placeholder={tx("Tell us what could be improved or any details about your return...", "Teilen Sie uns mit, was wir verbessern können, oder weitere Details zu Ihrer Rücksendung...")}
                      className="input-field mt-1 resize-none text-xs"
                    />
                  </div>

                  {/* Seal Breakage / Hygiene Confirmation Checkbox */}
                  <div className="flex items-start gap-2.5 rounded-xl border border-teal/20 bg-teal/5 p-3 text-xs">
                    <input
                      type="checkbox"
                      id="sealBreakageCheck"
                      checked={sealConfirmed}
                      onChange={(e) => setSealConfirmed(e.target.checked)}
                      className="mt-0.5 rounded border-mauve/30 text-teal focus:ring-teal"
                    />
                    <label htmlFor="sealBreakageCheck" className="text-[11px] text-ink/80 leading-relaxed cursor-pointer select-none">
                      <strong>{tx("I confirm that the product condition meets the return rules", "Ich bestätige, dass der Produktzustand den Rückgaberegeln entspricht")}</strong> {tx("(e.g. hygienic seal intact, unsoiled, and complete in original packaging).", "(z. B. Hygienesiegel intakt, unbeschmutzt und vollständig in der Originalverpackung).")}
                    </label>
                  </div>

                  <div className="rounded-xl border border-teal/20 bg-teal/5 p-3 text-[11px] text-teal-dark">
                    💡 <strong>{tx("100% Zero Hassle:", "100 % unkompliziert:")}</strong> {tx("Somnobalance generates an instant prepaid DHL GoGreen QR code. Simply show it at any DHL Packstation or parcel shop. Full refund will be credited to your original payment method.", "Somnobalance erstellt sofort einen vorfrankierten DHL-GoGreen-QR-Code. Zeigen Sie ihn einfach an einer DHL-Packstation oder in einem Paketshop vor. Die volle Erstattung wird Ihrer ursprünglichen Zahlungsmethode gutgeschrieben.")}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReturnOrder(null);
                        setSealConfirmed(false);
                      }}
                      className="flex-1 rounded-full border border-mauve/20 bg-white py-3 text-xs font-semibold text-ink/70 hover:bg-sand"
                    >
                      {tx("Cancel", "Abbrechen")}
                    </button>
                    <button
                      type="button"
                      disabled={submittingReturn || !sealConfirmed}
                      onClick={async () => {
                        setSubmittingReturn(true);
                        try {
                          const res = await fetch("/api/orders/return", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              orderId: selectedReturnOrder.id,
                              returnReason,
                              returnNote,
                            }),
                          });
                          const data = await res.json();
                          if (res.ok && data.order) {
                            setOrders((prev) =>
                              prev.map((o) => (o.id === selectedReturnOrder.id ? { ...o, ...data.order } : o))
                            );
                          } else {
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === selectedReturnOrder.id
                                  ? {
                                      ...o,
                                      returnStatus: "REQUESTED",
                                      returnReason,
                                      returnNote,
                                      returnRequestedAt: new Date().toISOString(),
                                    }
                                  : o
                              )
                            );
                          }
                        } catch {
                          setOrders((prev) =>
                            prev.map((o) =>
                              o.id === selectedReturnOrder.id
                                ? {
                                    ...o,
                                    returnStatus: "REQUESTED",
                                    returnReason,
                                    returnNote,
                                    returnRequestedAt: new Date().toISOString(),
                                  }
                                : o
                            )
                          );
                        } finally {
                          setSubmittingReturn(false);
                          setReturnSubmitted(true);
                        }
                      }}
                      className="flex-1 rounded-full bg-teal py-3 text-xs font-semibold text-white hover:bg-teal-dark disabled:opacity-50 transition shadow-sm"
                    >
                      {submittingReturn ? tx("Processing…", "Wird verarbeitet…") : tx("Submit Return Request", "Rücksendeanfrage absenden")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-800">
                  ✓
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    {tx("Return Request Approved!", "Rücksendeanfrage genehmigt!")}
                  </h3>
                  <p className="mt-1 text-xs text-ink/60 max-w-sm mx-auto">
                    {tx("Your prepaid DHL GoGreen return label has been generated for Order", "Ihr vorfrankiertes DHL-GoGreen-Rücksendeetikett wurde erstellt für Bestellung")} #{selectedReturnOrder.id.slice(0, 12)}.
                  </p>
                </div>

                {/* Simulated DHL QR Code / Return Voucher */}
                <div className="rounded-2xl border border-dashed border-teal/30 bg-sand/30 p-5 text-center">
                  <div className="font-mono text-xs font-bold text-ink tracking-wider">
                    DHL RETOURE: RET-DHL-{selectedReturnOrder.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="my-3 inline-block rounded-lg bg-white p-3 shadow-inner">
                    <div className="flex h-24 w-24 items-center justify-center bg-ink text-white font-mono text-[9px] text-center p-2 rounded">
                      [ DHL QR CODE ]
                      <br />
                      {tx("Scan at DHL Packstation", "An der DHL-Packstation scannen")}
                    </div>
                  </div>
                  <p className="text-[11px] text-ink/60">
                    {tx("Show this QR code at any DHL post branch or Packstation without needing a printer.", "Zeigen Sie diesen QR-Code in jeder DHL-Filiale oder an jeder Packstation vor — ein Drucker ist nicht nötig.")}
                  </p>
                </div>

                <div className="text-xs text-ink/70">
                  {tx("Refund of", "Die Erstattung von")} <strong className="text-ink font-serif">{formatPrice(selectedReturnOrder.total)}</strong> {tx("will be processed within 2-3 business days after drop-off.", "wird innerhalb von 2–3 Werktagen nach der Abgabe bearbeitet.")}
                </div>

                <button
                  onClick={() => setSelectedReturnOrder(null)}
                  className="w-full rounded-full bg-mauve py-3 text-xs font-semibold text-white hover:bg-mauve-dark transition"
                >
                  {tx("Close & Back to Orders", "Schließen & zurück zu den Bestellungen")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
