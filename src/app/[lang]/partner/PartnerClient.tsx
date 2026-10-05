"use client";
import { localizeError } from "@/lib/localizeError";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { Star, User, Check, Link as LinkIcon, ClipboardList, Ticket, CreditCard, Zap, Banknote, Package } from "lucide-react";

export function PartnerClient({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const statusDe: Record<string, string> = { active: "Aktiv", pending: "Ausstehend", approved: "Genehmigt", paid: "Ausgezahlt", rejected: "Abgelehnt", suspended: "Gesperrt", cancelled: "Storniert", refunded: "Erstattet", processing: "In Bearbeitung", failed: "Fehlgeschlagen", available: "Verfügbar" };
  const status = (v: string) => (lang === "de" ? (statusDe[String(v).toLowerCase()] ?? v) : v);
  const method = (v?: string) => (v ? v.replace("_", " ") : "Stripe Connect");
  const { user } = useAuth();
  const isPartnerUser = Boolean(user?.isAffiliate || user?.role === "affiliate");
  const [activeTab, setActiveTab] = useState<"overview" | "apply">("overview");

  // Application form state (for regular visitors / customers wanting to become an affiliate)
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Partner portal dashboard state
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalData, setPortalData] = useState<any | null>(null);
  const [portalLoadAttemptedFor, setPortalLoadAttemptedFor] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [stripeStatusMsg, setStripeStatusMsg] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleConnectStripe = async () => {
    if (!portalData?.affiliate?.id) return;
    setConnectingStripe(true);
    setStripeStatusMsg(null);
    try {
      const res = await fetch("/api/partner/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "onboard",
          affiliateId: portalData.affiliate.id,
          email: portalData.affiliate.email,
          lang,
        }),
      });
      const data = await res.json();
      if (res.ok && data.onboardingUrl) {
        if (data.onboardingUrl.startsWith("http")) {
          window.location.href = data.onboardingUrl;
        } else {
          setPortalData((prev: any) => ({
            ...prev,
            affiliate: {
              ...prev.affiliate,
              stripeAccountId: data.stripeAccountId,
              paymentMethod: "stripe_connect",
            },
          }));
          setStripeStatusMsg("✓ Connected with Stripe Express Payouts!");
        }
      } else {
        setStripeStatusMsg(localizeError(data.error || "Stripe onboarding could not be started.", lang));
      }
    } catch (err) {
      console.error("[partner] Stripe Connect error", err);
      setStripeStatusMsg(tx("Network error while connecting Stripe. Please try again.", "Netzwerkfehler bei der Stripe-Verbindung. Bitte versuchen Sie es erneut."));
    } finally {
      setConnectingStripe(false);
    }
  };

  // Auto-load partner portal data if user is logged in as an affiliate (or dual customer+affiliate)
  useEffect(() => {
    if (user?.email && (isPartnerUser || user.role === "admin") && portalLoadAttemptedFor !== user.email) {
      setPortalLoadAttemptedFor(user.email);
      setPortalLoading(true);
      fetch("/api/partner/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error && data.affiliate) {
            setPortalData(data);
          }
        })
        .catch(() => {})
        .finally(() => setPortalLoading(false));
    }
  }, [user, isPartnerUser, portalLoadAttemptedFor]);

  const handleApplicationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      businessName: String(fd.get("businessName") || ""),
      businessType: String(fd.get("businessType") || ""),
      website: String(fd.get("website") || ""),
      description: String(fd.get("description") || ""),
      bankName: String(fd.get("bankName") || ""),
      iban: String(fd.get("iban") || ""),
      bicSwift: String(fd.get("bicSwift") || ""),
    };

    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(localizeError(data.error || "Could not submit application.", lang));
      } else {
        setFormSuccess(true);
      }
    } catch {
      setFormError(tx("Network error. Please try again.", "Netzwerkfehler. Bitte versuchen Sie es erneut."));
    } finally {
      setFormSubmitting(false);
    }
  };

  const copyReferralLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const refUrl = `${origin}/${lang}/shop?ref=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(refUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyCodeOnly = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponCode(code);
    setTimeout(() => setCopiedCouponCode(null), 2500);
  };

  // Determine if the user is a qualified affiliate with loaded portal data
  const showAffiliateDashboard = Boolean(portalData && portalData.affiliate);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-dark font-semibold">
          {dict.partner.eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          {showAffiliateDashboard ? tx("Partner Dashboard", "Partner-Dashboard") : dict.partner.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {showAffiliateDashboard
            ? tx("Track your referral links, active promo coupons, commission balance, and connected payout transfers.", "Verfolgen Sie Ihre Empfehlungslinks, aktiven Gutscheine, Ihr Provisionsguthaben und verbundene Auszahlungen.")
            : dict.partner.intro}
        </p>
      </div>

      {/* CASE 1: USER IS AN AFFILIATE (OR DUAL CUSTOMER + AFFILIATE) -> SHOW COMPREHENSIVE DASHBOARD */}
      {showAffiliateDashboard ? (
        <div className="mt-12 space-y-8 animate-fade-in">
          {/* 1. Affiliate Profile & Account Details Header Banner */}
          <div className="rounded-3xl border border-teal/20 bg-gradient-to-br from-teal/5 to-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-teal/15 px-3 py-0.5 text-xs font-semibold text-teal-dark uppercase tracking-wider">
                    <Star className="size-3" /> {tx("Partner ID", "Partner-ID")}: {portalData.affiliate.affiliateCode}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    ● {status(portalData.affiliate.status || "Active")}
                  </span>
                  {user && (
                    <span className="rounded-full bg-mauve/15 px-3 py-0.5 text-xs font-semibold text-mauve-dark">
                      {tx("Dual Account: Customer & Partner", "Doppelkonto: Kunde & Partner")}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-serif text-3xl text-ink">
                  {tx("Welcome back", "Willkommen zurück")}, {portalData.affiliate.name}
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  {portalData.affiliate.businessName || tx("Healthcare Partner", "Gesundheitspartner")} • {portalData.affiliate.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/${lang}/account`}
                  className="flex items-center gap-1.5 rounded-full bg-white border border-mauve/20 px-5 py-2.5 text-xs font-semibold text-ink/80 hover:bg-sand transition shadow-sm"
                >
                  <User className="size-4" /> {tx("My Customer Orders", "Meine Kundenbestellungen")}
                </Link>
                <button
                  onClick={() => copyReferralLink(portalData.affiliate.affiliateCode)}
                  className="flex items-center gap-1.5 rounded-full bg-teal px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-dark transition shadow-sm"
                >
                  {copiedLink ? <><Check className="size-4" /> {tx("Referral Link Copied", "Empfehlungslink kopiert")}</> : <><LinkIcon className="size-4" /> {tx("Copy Primary Referral Link", "Haupt-Empfehlungslink kopieren")}</>}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Key Financial & Referral Metrics */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">{tx("Referred Orders", "Vermittelte Bestellungen")}</span>
              <div className="mt-2 font-serif text-3xl font-bold text-ink">
                {portalData.metrics?.totalReferralOrders ?? (portalData.commissions || []).length}
              </div>
              <span className="text-[11px] text-ink/50 mt-1 block">{tx("Lifetime verified sales", "Verifizierte Verkäufe gesamt")}</span>
            </div>

            <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">{tx("Total Earned", "Gesamt verdient")}</span>
              <div className="mt-2 font-serif text-3xl font-bold text-mauve-dark">
                {formatPrice(portalData.metrics?.totalEarned ?? 0)}
              </div>
              <span className="text-[11px] text-ink/50 mt-1 block">{tx("Gross commission generated", "Erzielte Bruttoprovision")}</span>
            </div>

            <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">{tx("Total Paid Out", "Gesamt ausgezahlt")}</span>
              <div className="mt-2 font-serif text-3xl font-bold text-emerald-800">
                {formatPrice(portalData.metrics?.totalPaid ?? 0)}
              </div>
              <span className="text-[11px] text-ink/50 mt-1 block">{tx("Disbursed via Connected Stripe / SEPA", "Ausgezahlt über verbundenes Stripe / SEPA")}</span>
            </div>

            <div className="rounded-3xl border border-teal/30 bg-teal/5 p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-dark">{tx("Available Balance", "Verfügbares Guthaben")}</span>
              <div className="mt-2 font-serif text-3xl font-bold text-teal-dark">
                {formatPrice(portalData.metrics?.availableBalance ?? 0)}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-ink/60">
                <span>{tx("Threshold", "Schwelle")}: {formatPrice(portalData.metrics?.payoutThreshold || 50)}</span>
                <span className="font-semibold text-teal-dark flex items-center gap-1">
                  {portalData.metrics?.availableBalance >= (portalData.metrics?.payoutThreshold || 50)
                    ? <><Check className="size-3" /> {tx("Payout Ready", "Auszahlung möglich")}</>
                    : `${formatPrice((portalData.metrics?.payoutThreshold || 50) - (portalData.metrics?.availableBalance || 0))} ${tx("to threshold", "bis zur Schwelle")}`}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-sand">
                <div
                  className="h-1.5 rounded-full bg-teal transition-all"
                  style={{ width: `${portalData.metrics?.thresholdProgress ?? 50}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. All Details About That Affiliate */}
          <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
              <ClipboardList className="size-5 text-teal-dark" /> {tx("Partner Profile & Business Registration Details", "Partnerprofil & Registrierungsdaten")}
            </h3>
            <p className="text-xs text-ink/60 mt-1">
              {tx("Your registered professional information and commission terms with SomnoBalance.", "Ihre registrierten beruflichen Angaben und Provisionskonditionen bei SomnoBalance.")}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Partner Full Name", "Vollständiger Name")}</span>
                <p className="mt-1 font-medium text-ink text-sm">{portalData.affiliate.name}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Partner Email", "Partner-E-Mail")}</span>
                <p className="mt-1 font-medium text-ink text-sm font-mono">{portalData.affiliate.email}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Mobile / Phone", "Mobil / Telefon")}</span>
                <p className="mt-1 font-medium text-ink text-sm">{portalData.affiliate.phone || tx("Not specified", "Nicht angegeben")}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Practice / Clinic", "Praxis / Klinik")}</span>
                <p className="mt-1 font-medium text-ink text-sm">{portalData.affiliate.businessName || tx("Private Practice", "Privatpraxis")}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Specialization", "Fachrichtung")}</span>
                <p className="mt-1 font-medium text-ink text-sm">{portalData.affiliate.businessType || tx("Physiotherapy & Wellness", "Physiotherapie & Wellness")}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Website / Social", "Website / Social Media")}</span>
                <p className="mt-1 font-medium text-ink text-sm truncate">
                  {portalData.affiliate.website ? (
                    <a href={portalData.affiliate.website} target="_blank" rel="noopener noreferrer" className="text-teal-dark hover:underline">
                      {portalData.affiliate.website}
                    </a>
                  ) : (
                    tx("None", "Keine")
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Practice Address", "Praxisadresse")}</span>
                <p className="mt-1 font-medium text-ink text-sm">{portalData.affiliate.address || `${portalData.affiliate.country || tx("Germany", "Deutschland")}`}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Target Audience", "Zielgruppe")}</span>
                <p className="mt-1 font-medium text-ink text-sm">{portalData.affiliate.audienceType || tx("Sleep & Recovery Clients", "Schlaf- & Regenerationsklienten")}</p>
              </div>

              <div className="rounded-2xl bg-sand/30 p-4 text-xs">
                <span className="font-semibold text-ink/50 uppercase text-[10px]">{tx("Standard Commission Rate", "Standard-Provisionssatz")}</span>
                <p className="mt-1 font-bold text-teal-dark text-sm">
                  {portalData.affiliate.defaultCommissionRate || 10}% {tx("per verified sale", "je verifiziertem Verkauf")}
                </p>
              </div>
            </div>
          </div>

          {/* 4. All Coupons On His Account */}
          <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                  <Ticket className="size-5 text-teal-dark" /> {tx("Active Coupons On Your Account", "Aktive Gutscheine Ihres Kontos")} ({(portalData.coupons || []).length})
                </h3>
                <p className="text-xs text-ink/60 mt-1">
                  {tx("Share these codes with your clients and patients. They receive an exclusive discount and you earn commission.", "Teilen Sie diese Codes mit Ihren Klienten und Patienten. Sie erhalten einen exklusiven Rabatt und Sie verdienen Provision.")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal-dark">
                  {tx("Self-Referral Protected", "Eigenempfehlungs-Schutz")} <Check className="size-3" />
                </span>
              </div>
            </div>

            {(!portalData.coupons || portalData.coupons.length === 0) ? (
              <div className="rounded-2xl border border-dashed border-mauve/20 p-8 text-center">
                <p className="text-xs text-ink/60">
                  {tx("Your custom coupon code is currently being prepared by the SomnoBalance team.", "Ihr persönlicher Gutscheincode wird derzeit vom SomnoBalance-Team vorbereitet.")}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {portalData.coupons.map((coupon: any) => {
                  const couponLink = `${origin || ""}/${lang}/shop?ref=${encodeURIComponent(coupon.couponCode)}`;
                  const isCopied = copiedCouponCode === coupon.couponCode;

                  return (
                    <div
                      key={coupon.id}
                      className="rounded-3xl border border-mauve/15 bg-sand/20 p-5 shadow-sm space-y-4 hover:border-teal/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xl font-bold tracking-wider text-mauve-dark">
                            {coupon.couponCode}
                          </span>
                          <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                            {tx("Active", "Aktiv")}
                          </span>
                        </div>
                        <button
                          onClick={() => copyCodeOnly(coupon.couponCode)}
                          className="flex items-center gap-1 rounded-full bg-white border border-mauve/20 px-3 py-1 text-xs font-semibold text-ink/80 hover:bg-sand transition"
                        >
                          {isCopied ? <><Check className="size-3" /> {tx("Copied", "Kopiert")}</> : tx("Copy Code", "Code kopieren")}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-ink/50 uppercase">{tx("Customer Discount", "Kundenrabatt")}</span>
                          <p className="mt-0.5 font-bold text-teal-dark text-sm">{coupon.discountRate}%</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-ink/50 uppercase">{tx("Your Commission", "Ihre Provision")}</span>
                          <p className="mt-0.5 font-bold text-mauve-dark text-sm">{coupon.commissionRate}%</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-ink/50 uppercase">{tx("Times Used", "Nutzungen")}</span>
                          <p className="mt-0.5 font-bold text-ink text-sm">{coupon.timesUsed || 0}x</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-ink/70">
                        <div className="flex justify-between">
                          <span>{tx("Min Order Value:", "Mindestbestellwert:")}</span>
                          <strong className="text-ink">
                            {coupon.minimumOrderValue > 0 ? formatPrice(coupon.minimumOrderValue) : tx("No minimum", "Kein Minimum")}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{tx("Commission Base:", "Provisionsbasis:")}</span>
                          <strong className="text-ink capitalize">
                            {coupon.commissionBaseType ? (lang === "de" ? ({ discounted_value: "Rabattierter Wert", subtotal: "Zwischensumme", order_total: "Bestellsumme" } as Record<string, string>)[coupon.commissionBaseType] ?? coupon.commissionBaseType.replace("_", " ") : coupon.commissionBaseType.replace("_", " ")) : tx("Discounted Value", "Rabattierter Wert")}
                          </strong>
                        </div>
                      </div>

                      {/* Direct Link Share */}
                      <div className="flex items-center gap-2 rounded-xl bg-white p-2 border border-mauve/10">
                        <input
                          readOnly
                          value={couponLink}
                          className="flex-1 bg-transparent font-mono text-[11px] text-ink/70 outline-none select-all"
                        />
                        <button
                          onClick={() => copyReferralLink(coupon.couponCode)}
                          className="shrink-0 rounded-lg bg-teal px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-teal-dark"
                        >
                          {tx("Share Link", "Link teilen")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Payout Details & Financial Ledger */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Payout Method Card */}
            <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8 space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                <CreditCard className="size-5 text-teal-dark" /> {tx("Stripe Payout Setup", "Stripe-Auszahlung einrichten")}
              </h3>
              <p className="text-xs text-ink/60">
                {tx("Stripe securely collects your identity and bank details. SomnoBalance never stores your raw bank account information.", "Stripe erfasst Ihre Identitäts- und Bankdaten sicher. SomnoBalance speichert Ihre Kontodaten niemals im Klartext.")}
              </p>

              <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{tx("Connected Payment:", "Verbundene Zahlung:")}</span>
                  <span className="rounded-full bg-teal/15 px-2.5 py-0.5 font-semibold text-teal-dark capitalize">
                    {method(portalData.affiliate.paymentMethod)}
                  </span>
                </div>

                {portalData.affiliate.stripeAccountId && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-ink/50 uppercase">{tx("Connected Stripe Account", "Verbundenes Stripe-Konto")}</span>
                    <p className="font-mono text-xs font-semibold text-ink">{portalData.affiliate.stripeAccountId}</p>
                  </div>
                )}

                <div className="border-t border-teal/15 pt-2 text-[11px] text-teal-dark flex items-start gap-1">
                  <Zap className="size-4 shrink-0" /> <span><strong>{tx("Automated Payouts:", "Automatische Auszahlungen:")}</strong> {tx("Approved commissions are paid after Stripe enables payouts for your connected account.", "Genehmigte Provisionen werden ausgezahlt, sobald Stripe Auszahlungen für Ihr verbundenes Konto freigibt.")}</span>
                </div>

                <button
                  type="button"
                  disabled={connectingStripe}
                  onClick={handleConnectStripe}
                  className="w-full mt-2 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal-dark transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {connectingStripe ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {tx("Connecting Stripe…", "Stripe wird verbunden…")}
                    </>
                  ) : (
                    <>
                      <Zap className="size-4" /> {portalData.affiliate.stripeAccountId ? tx("Manage Connected Stripe", "Verbundenes Stripe verwalten") : tx("Connect with Stripe", "Mit Stripe verbinden")}
                    </>
                  )}
                </button>
                {stripeStatusMsg && (
                  <p className="text-center text-xs text-emerald-700 font-semibold mt-1">
                    {stripeStatusMsg}
                  </p>
                )}
              </div>
            </div>

            {/* Payout History Table */}
            <div className="lg:col-span-2 rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8 space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                <Banknote className="size-5 text-teal-dark" /> {tx("Payout Disbursement History", "Auszahlungsverlauf")} ({(portalData.payouts || []).length})
              </h3>

              {(!portalData.payouts || portalData.payouts.length === 0) ? (
                <div className="rounded-2xl bg-sand/30 p-8 text-center text-xs text-ink/60">
                  {tx("No payouts processed yet. Once your commission balance reaches", "Noch keine Auszahlungen. Sobald Ihr Provisionsguthaben")} {formatPrice(portalData.affiliate.payoutThreshold || 50)}{tx(", your first disbursement will be recorded here.", " erreicht, wird Ihre erste Auszahlung hier erfasst.")}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-mauve/10 text-ink/50 uppercase tracking-wider">
                      <tr>
                        <th className="pb-3">{tx("Reference", "Referenz")}</th>
                        <th className="pb-3">{tx("Date", "Datum")}</th>
                        <th className="pb-3">{tx("Method", "Methode")}</th>
                        <th className="pb-3">{tx("Amount", "Betrag")}</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mauve/5">
                      {portalData.payouts.map((p: any) => (
                        <tr key={p.id}>
                          <td className="py-3 font-mono font-medium text-ink">
                            {p.paymentReference || p.id}
                          </td>
                          <td className="py-3 text-ink/60">
                            {new Date(p.paymentDate || p.createdAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB")}
                          </td>
                          <td className="py-3 capitalize text-ink/70">
                            {method(p.paymentMethod)}
                          </td>
                          <td className="py-3 font-bold text-emerald-800">
                            {formatPrice(p.amount)}
                          </td>
                          <td className="py-3">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                              {status(p.status || "Paid")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 6. Recent Referred Commissions */}
          <div className="rounded-3xl border border-mauve/15 bg-white p-6 shadow-sm sm:p-8 space-y-4">
            <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
              <Package className="size-5 text-teal-dark" /> {tx("Referral Orders & Commission Ledger", "Vermittelte Bestellungen & Provisionsübersicht")} ({(portalData.commissions || []).length})
            </h3>

            {(!portalData.commissions || portalData.commissions.length === 0) ? (
              <div className="rounded-2xl bg-sand/30 p-8 text-center text-xs text-ink/60">
                {tx("No referred orders recorded yet. Share your promo code or referral link to earn your first commission!", "Noch keine vermittelten Bestellungen. Teilen Sie Ihren Gutscheincode oder Empfehlungslink, um Ihre erste Provision zu verdienen!")}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-mauve/10 text-ink/50 uppercase tracking-wider">
                    <tr>
                      <th className="pb-3">{tx("Order ID", "Bestell-ID")}</th>
                      <th className="pb-3">{tx("Date", "Datum")}</th>
                      <th className="pb-3">{tx("Base Value", "Basiswert")}</th>
                      <th className="pb-3">{tx("Rate", "Satz")}</th>
                      <th className="pb-3">{tx("Earned Commission", "Verdiente Provision")}</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mauve/5">
                    {portalData.commissions.map((c: any) => (
                      <tr key={c.id}>
                        <td className="py-3 font-mono font-medium">{c.orderId}</td>
                        <td className="py-3 text-ink/60">{new Date(c.createdAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB")}</td>
                        <td className="py-3">{formatPrice(c.commissionBase)}</td>
                        <td className="py-3 text-ink/70">{c.commissionRate}%</td>
                        <td className="py-3 font-bold text-mauve-dark">
                          {formatPrice(c.commissionAmount)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                              c.status === "approved" || c.status === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {status(c.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CASE 2: REGULAR VISITOR OR CUSTOMER ONLY -> SHOW VALUE PROPOSITION & CREATE ACCOUNT / APPLICATION FORM */
        <>
          {/* Tabs for Prospective Partners */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-full border border-mauve/20 bg-sand/40 p-1.5 shadow-sm">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                  activeTab === "overview"
                    ? "bg-mauve text-white shadow"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {dict.partner.tabs?.overview || tx("Overview & Values", "Überblick & Vorteile")}
              </button>
              <button
                onClick={() => setActiveTab("apply")}
                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                  activeTab === "apply"
                    ? "bg-mauve text-white shadow"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {dict.partner.tabs?.apply || tx("Create Partner Account", "Partnerkonto erstellen")}
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="mt-12 space-y-12 animate-fade-in">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-mauve/10 bg-white/70 p-6 shadow-sm">
                  <div className="text-2xl font-serif text-teal-dark">01</div>
                  <h3 className="mt-2 font-medium text-ink">{dict.partner.card1Title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{dict.partner.card1Copy}</p>
                </div>
                <div className="rounded-3xl border border-mauve/10 bg-white/70 p-6 shadow-sm">
                  <div className="text-2xl font-serif text-teal-dark">02</div>
                  <h3 className="mt-2 font-medium text-ink">{dict.partner.card2Title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{dict.partner.card2Copy}</p>
                </div>
                <div className="rounded-3xl border border-mauve/10 bg-white/70 p-6 shadow-sm">
                  <div className="text-2xl font-serif text-teal-dark">03</div>
                  <h3 className="mt-2 font-medium text-ink">
                    {dict.partner.card3Title || tx("Dedicated portal", "Eigenes Portal")}
                  </h3>
                  <p className="mt-2 text-sm text-ink/70">
                    {dict.partner.card3Copy ||
                      tx("Track clicks, referred orders, commission payouts, and in-app alerts.", "Verfolgen Sie Klicks, vermittelte Bestellungen, Provisionsauszahlungen und Benachrichtigungen.")}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-mauve/10 bg-gradient-to-br from-sand/50 to-sand/20 p-8 text-center sm:p-12">
                <h2 className="font-serif text-2xl text-ink">{dict.partner.readyTitle}</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-ink/70">
                  {dict.partner.readyCopy}
                </p>
                <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
                  <button
                    onClick={() => setActiveTab("apply")}
                    className="rounded-full bg-mauve px-8 py-3 text-sm font-medium text-white shadow transition hover:bg-mauve-dark"
                  >
                    {dict.partner.cta}
                  </button>
                  <Link
                    href={`/${lang}/login`}
                    className="text-sm font-medium text-mauve-dark underline underline-offset-4"
                  >
                    {dict.partner.alreadyPartnerLogin}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATION / CREATE ACCOUNT FORM */}
          {activeTab === "apply" && (
            <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-mauve/10 bg-white/80 p-8 shadow-sm sm:p-10 animate-fade-in">
              {formSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/20 text-teal-dark">
                    <Check className="size-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-ink">
                    {dict.partner.form?.successTitle || tx("Application Received!", "Bewerbung eingegangen!")}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
                    {dict.partner.form?.successCopy ||
                      tx("Thank you for applying. Our partner team will review your application and activate your custom coupon code within 24–48 hours.", "Vielen Dank für Ihre Bewerbung. Unser Partnerteam prüft Ihre Angaben und aktiviert Ihren persönlichen Gutscheincode innerhalb von 24–48 Stunden.")}
                  </p>
                  <Link
                    href={`/${lang}/login`}
                    className="mt-6 inline-block rounded-full bg-mauve px-6 py-2.5 text-sm text-white hover:bg-mauve-dark"
                  >
                    {dict.partner.form?.successLoginLink || "Log In to Your Account"}
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-ink">
                      {dict.partner.form?.title || tx("Partner Application", "Partner-Bewerbung")}
                    </h2>
                    <p className="mt-1 text-sm text-ink/60">
                      {dict.partner.form?.subtitle || tx("Join our verified health and wellness partner network.", "Werden Sie Teil unseres verifizierten Gesundheits- und Wellness-Partnernetzwerks.")}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-ink/70">
                        {dict.partner.form?.name || tx("Full Name", "Vollständiger Name")} *
                      </label>
                      <input
                        required
                        name="name"
                        defaultValue={user ? `${user.firstName} ${user.lastName}` : ""}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink/70">
                        {dict.partner.form?.email || tx("Email Address", "E-Mail-Adresse")} *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        defaultValue={user?.email || ""}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink/70">
                        {dict.partner.form?.phone || tx("Phone Number", "Telefonnummer")}
                      </label>
                      <input name="phone" placeholder="+49 ..." className="input-field mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink/70">
                        {dict.partner.form?.businessName || tx("Practice / Business Name", "Praxis- / Unternehmensname")}
                      </label>
                      <input
                        name="businessName"
                        placeholder={tx("e.g. Praxis für Physiotherapie", "z. B. Praxis für Physiotherapie")}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink/70">
                        {dict.partner.form?.businessType || tx("Field of Practice", "Fachbereich")}
                      </label>
                      <input
                        name="businessType"
                        placeholder={tx("e.g. Physiotherapy, Health Coach", "z. B. Physiotherapie, Gesundheitscoach")}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink/70">
                        {dict.partner.form?.website || tx("Website / Social Profile", "Website / Social-Media-Profil")}
                      </label>
                      <input name="website" placeholder="https://..." className="input-field mt-1" />
                    </div>
                  </div>

                  <div className="border-t border-mauve/10 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-dark">
                      {dict.partner.form?.bankDetailsTitle ||
                        tx("Payout & Banking Details (Optional at registration)", "Auszahlungs- & Bankdaten (bei Registrierung optional)")}
                    </h4>
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-medium text-ink/70">
                          {dict.partner.form?.bankName || tx("Bank Name", "Name der Bank")}
                        </label>
                        <input name="bankName" placeholder="Deutsche Bank" className="input-field mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink/70">
                          {dict.partner.form?.iban || "IBAN"}
                        </label>
                        <input name="iban" placeholder="DE89..." className="input-field mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink/70">
                          {dict.partner.form?.bicSwift || "BIC / SWIFT"}
                        </label>
                        <input name="bicSwift" placeholder="DEUTDED..." className="input-field mt-1" />
                      </div>
                    </div>
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full rounded-full bg-mauve py-3.5 text-sm font-medium text-white shadow hover:bg-mauve-dark disabled:opacity-60 transition"
                  >
                    {formSubmitting
                      ? dict.partner.form?.submitting || tx("Submitting…", "Wird übermittelt…")
                      : dict.partner.form?.submit || tx("Submit Application", "Bewerbung absenden")}
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
