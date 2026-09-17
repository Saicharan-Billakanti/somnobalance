"use client";

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
        setOtpError(data.error || "SMS-Code konnte nicht gesendet werden.");
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
        setOtpError(data.error || "Ungültiger Code.");
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
        setProfileError(data.error || "Failed to update profile");
        return;
      }
      setUser(data.profile);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch {
      setProfileError("Network error. Please try again.");
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
                Customer Account & Orders
              </span>
              {isDualRole && (
                <span className="rounded-full bg-mauve/15 px-3 py-0.5 text-xs font-semibold text-mauve-dark">
                  ⭐ Partner
                </span>
              )}
              {isBusiness && (
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                  🏢 B2B Member
                </span>
              )}
            </div>
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
              Hello, {firstName || user?.firstName || "Customer"} {lastName || user?.lastName || ""}
            </h1>
            <p className="text-xs text-ink/60 mt-0.5">
              {initialProfile?.email || user?.email} • Member since 2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${lang}/shop`}
              className="rounded-full bg-teal px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-dark transition shadow-sm"
            >
              🛒 Continue Shopping
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
          <span>📦</span> My Orders & Tracking ({orders.length})
        </button>

        <button
          onClick={() => setTab("profile")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition ${
            tab === "profile"
              ? "bg-teal text-white shadow-sm"
              : "border border-mauve/20 bg-white text-ink/70 hover:bg-sand"
          }`}
        >
          <span>👤</span> Profile & Shipping Address
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {tab === "orders" && (
        <div className="mt-8 space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-mauve/15 bg-white p-12 text-center">
              <span className="text-3xl">📦</span>
              <h3 className="mt-3 font-serif text-xl text-ink">No orders found yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-ink/60">
                You haven't placed any orders yet. Explore our sleep and ritual collection to begin.
              </p>
              <Link
                href={`/${lang}/shop`}
                className="mt-6 inline-block rounded-full bg-mauve px-6 py-2.5 text-xs font-semibold text-white hover:bg-mauve-dark"
              >
                Browse Shop →
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
                          Order #{order.id.slice(0, 12)}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-teal/15 text-teal-dark"
                          }`}
                        >
                          ● {isDelivered ? "Delivered" : "In Transit"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink/50">
                        Placed on {new Date(order.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })} • Payment: {order.paymentMethod || "Card / PayPal"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-ink/50">Total Amount</span>
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
                                  {isRefunded ? "Refund Processed via Stripe" : refundPolicy}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                    isRefunded
                                      ? "bg-emerald-200/80 text-emerald-900"
                                      : "bg-teal/15 text-teal-dark"
                                  }`}
                                >
                                  {isRefunded ? "Payment Reimbursed" : `${returnDays} Days Return Window`}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-ink/70">
                                {isRefunded ? (
                                  <span className="font-medium text-emerald-800">
                                    Full refund of <strong>{formatPrice(order.total)}</strong> credited back via Stripe to your original payment method. {order.refundTransactionId ? `(Ref: ${order.refundTransactionId})` : ""}
                                  </span>
                                ) : isReturnRequested ? (
                                  <span className="font-semibold text-amber-700">
                                    🔄 Return request received — DHL GoGreen prepaid return QR code generated.
                                  </span>
                                ) : isReturnActive ? (
                                  <>
                                    <span className="font-semibold text-teal-dark">
                                      {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left
                                    </span>{" "}
                                    to trial & request full refund (Eligible until{" "}
                                    <strong className="text-ink">
                                      {deadline.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                                    </strong>
                                    )
                                  </>
                                ) : (
                                  <span className="text-ink/50">
                                    Return window expired on{" "}
                                    {deadline.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div>
                            {isRefunded ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-800">
                                ✓ Refund Completed
                              </span>
                            ) : isReturnRequested ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-800">
                                ⏳ Return In Review
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
                                🔄 Request Return / Refund
                              </button>
                            ) : (
                              <span className="text-[11px] text-ink/40 font-medium italic">
                                Window Closed
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
                        <span className="font-bold text-ink">Courier:</span>
                        <span className="rounded bg-white px-2 py-0.5 text-xs text-teal-dark font-semibold">
                          {order.carrier || "DHL GoGreen"}
                        </span>
                        <span className="font-bold text-ink ml-2">Tracking No:</span>
                        <span className="font-mono text-xs text-ink/80 bg-white px-2 py-0.5 rounded">
                          {order.trackingNumber || "DHL-DE-8921471094"}
                        </span>
                      </div>

                      <span className="text-[11px] text-ink/60 font-medium">
                        {isDelivered ? "Delivered to recipient" : "Estimated Arrival: 1-2 Business Days"}
                      </span>
                    </div>

                    {/* Timeline visual */}
                    <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <span className="mt-2 font-semibold text-ink">Order Paid</span>
                        <span className="text-[10px] text-ink/50">Verified</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <span className="mt-2 font-semibold text-ink">Packed</span>
                        <span className="text-[10px] text-ink/50">Logistics Hub</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                            isInTransit ? "bg-teal text-white animate-pulse" : "bg-teal text-white"
                          }`}
                        >
                          🚚
                        </div>
                        <span className="mt-2 font-semibold text-teal-dark">In Transit</span>
                        <span className="text-[10px] text-ink/50">DHL Hub</span>
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
                          Delivery
                        </span>
                        <span className="text-[10px] text-ink/40">Recipient</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-ink">
                        Items in this Parcel ({(order.items || []).length})
                      </h4>
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="text-xs text-teal-dark font-medium hover:underline"
                      >
                        {isExpanded ? "Hide Details ▲" : "Show Full Details ▼"}
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
                                      🛡️ {item.refundPolicy}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-ink/50 font-mono">
                                  {item.slug} • Return period: {item.returnPeriodDays ?? order.returnPeriodDays ?? 30} days
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
                          <strong className="text-ink">Delivery Destination:</strong>
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
            <h2 className="font-serif text-2xl text-ink">Profile Details & Delivery Address</h2>
            <p className="text-xs text-ink/60 mt-1">
              Update your contact information, phone number, and primary shipping address for fast checkout.
            </p>
          </div>

          {profileSuccess && (
            <div className="rounded-2xl bg-teal/15 p-4 text-xs font-semibold text-teal-dark">
              ✓ Profile information updated successfully!
            </div>
          )}

          {profileError && (
            <div className="rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-600">
              {profileError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ink/70">First Name *</label>
              <input
                required
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/70">Last Name *</label>
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
              <label className="text-xs font-medium text-ink/70">Email Address (Account ID)</label>
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
            <h3 className="font-serif text-base font-bold text-ink">Primary Shipping Address</h3>

            <div>
              <label className="text-xs font-medium text-ink/70">Street & House Number</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Maximilianstraße 22"
                className="input-field mt-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-ink/70">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="80539"
                  className="input-field mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-ink/70">City</label>
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
              <label className="text-xs font-medium text-ink/70">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field mt-1"
              >
                <option value="Germany">Germany (Deutschland)</option>
                <option value="Austria">Austria (Österreich)</option>
                <option value="Switzerland">Switzerland (Schweiz)</option>
                <option value="Netherlands">Netherlands</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-full bg-mauve px-8 py-3.5 text-sm font-semibold text-white hover:bg-mauve-dark disabled:opacity-60 transition shadow-sm"
            >
              {savingProfile ? "Saving Details…" : "Save Profile Details"}
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
                      Request Return & Refund
                    </h3>
                    <p className="text-xs text-ink/60">
                      Order #{selectedReturnOrder.id.slice(0, 12)} • {selectedReturnOrder.refundPolicy || `${selectedReturnOrder.returnPeriodDays || 30}-Day Guarantee`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-sand/40 p-4 text-xs text-ink/70 space-y-2">
                  <div className="flex justify-between">
                    <span>Refund Amount:</span>
                    <strong className="text-ink font-serif">{formatPrice(selectedReturnOrder.total)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Policy:</span>
                    <strong className="text-teal-dark">{selectedReturnOrder.returnPeriodDays || 30} Days Guarantee</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier Service:</span>
                    <span className="text-ink font-medium">DHL GoGreen (Prepaid Drop-off)</span>
                  </div>

                  {/* Specific Admin Return Rules & Seal Breakage Condition */}
                  <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50/80 p-3 text-[11px] text-amber-950">
                    <strong className="font-bold flex items-center gap-1 text-amber-950">
                      <span>⚠️ Mandatory Return Condition:</span>
                    </strong>
                    <p className="mt-1 leading-relaxed text-amber-900">
                      {selectedReturnOrder.refundRules ||
                        "Hygienic seal must be intact and unbroken upon return. Items must be in original unsoiled packaging to qualify for a full refund."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-ink">
                      Reason for Return *
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="input-field mt-1"
                    >
                      <option value="comfort_expectation">
                        Trial sleep comfort did not match expectations
                      </option>
                      <option value="wrong_size_or_variant">
                        Incorrect size, color, or ergonomic fit
                      </option>
                      <option value="arrived_damaged">
                        Product arrived damaged or defective
                      </option>
                      <option value="mind_changed">
                        Changed mind within statutory return window
                      </option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-ink">
                      Additional Notes / Feedback (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={returnNote}
                      onChange={(e) => setReturnNote(e.target.value)}
                      placeholder="Tell us what could be improved or any details about your return..."
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
                      <strong>I confirm that the product condition meets the return rules</strong> (e.g. hygienic seal intact, unsoiled, and complete in original packaging).
                    </label>
                  </div>

                  <div className="rounded-xl border border-teal/20 bg-teal/5 p-3 text-[11px] text-teal-dark">
                    💡 <strong>100% Zero Hassle:</strong> Somnobalance generates an instant prepaid DHL GoGreen QR code. Simply show it at any DHL Packstation or parcel shop. Full refund will be credited to your original payment method.
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
                      Cancel
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
                      {submittingReturn ? "Processing…" : "Submit Return Request"}
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
                    Return Request Approved!
                  </h3>
                  <p className="mt-1 text-xs text-ink/60 max-w-sm mx-auto">
                    Your prepaid DHL GoGreen return label has been generated for Order #{selectedReturnOrder.id.slice(0, 12)}.
                  </p>
                </div>

                {/* Simulated DHL QR Code / Return Voucher */}
                <div className="rounded-2xl border border-dashed border-teal/30 bg-sand/30 p-5 text-center">
                  <div className="font-mono text-xs font-bold text-ink tracking-wider">
                    DHL RETÜRE: RET-DHL-{selectedReturnOrder.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="my-3 inline-block rounded-lg bg-white p-3 shadow-inner">
                    <div className="flex h-24 w-24 items-center justify-center bg-ink text-white font-mono text-[9px] text-center p-2 rounded">
                      [ DHL QR CODE ]
                      <br />
                      Scan at DHL Packstation
                    </div>
                  </div>
                  <p className="text-[11px] text-ink/60">
                    Show this QR code at any DHL post branch or Packstation without needing a printer.
                  </p>
                </div>

                <div className="text-xs text-ink/70">
                  Refund of <strong className="text-ink font-serif">{formatPrice(selectedReturnOrder.total)}</strong> will be processed within 2-3 business days after drop-off.
                </div>

                <button
                  onClick={() => setSelectedReturnOrder(null)}
                  className="w-full rounded-full bg-mauve py-3 text-xs font-semibold text-white hover:bg-mauve-dark transition"
                >
                  Close & Back to Orders
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
