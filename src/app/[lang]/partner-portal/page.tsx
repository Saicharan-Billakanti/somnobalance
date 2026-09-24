import { getAffiliateOverview } from "@/lib/affiliateMockData";
import { formatPrice } from "@/lib/products";
import { StatCard } from "@/components/partner-portal/StatCard";
import { StatusBadge } from "@/components/partner-portal/StatusBadge";

export default async function PartnerPortalOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const overview = getAffiliateOverview();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">{overview.name}</h1>
          <p className="mt-1 text-sm text-ink/60">{tx("Affiliate code", "Partner-Code")}: {overview.affiliateCode}</p>
        </div>
        <StatusBadge status={overview.status} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={tx("Total Referred Orders", "Vermittelte Bestellungen gesamt")} value={String(overview.totalReferredOrders)} />
        <StatCard label={tx("Total Revenue", "Gesamtumsatz")} value={formatPrice(overview.totalReferredRevenue)} />
        <StatCard label={tx("Total Commission", "Gesamtprovision")} value={formatPrice(overview.totalCommissionEarned)} />
        <StatCard label={tx("Available Balance", "Verfügbares Guthaben")} value={formatPrice(overview.availableBalance)} />
        <StatCard label={tx("Pending Commission", "Ausstehende Provision")} value={formatPrice(overview.pendingCommission)} />
        <StatCard label={tx("Paid Out", "Ausgezahlt")} value={formatPrice(overview.paidCommission)} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Commission Rate", "Provisionssatz")}</div>
          <div className="mt-2 text-lg font-medium text-ink">{overview.commissionRate}%</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Coupon Code", "Gutscheincode")}</div>
          <div className="mt-2 text-lg font-medium text-ink">{overview.couponCode}</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Next Payout Eligibility", "Nächste Auszahlungsberechtigung")}</div>
          <div className="mt-2 text-lg font-medium text-ink">
            {overview.nextPayoutEligibleDate
              ? new Date(overview.nextPayoutEligibleDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Stripe Connect Status", "Stripe-Connect-Status")}</div>
          <div className="mt-2">
            <StatusBadge
              status={overview.stripeStatus}
              label={
                overview.stripeStatus === "not_connected"
                  ? tx("Not connected", "Nicht verbunden")
                  : overview.stripeStatus === "restricted"
                    ? tx("Verification required", "Verifizierung erforderlich")
                    : overview.stripeStatus === "paused"
                      ? tx("Paused", "Pausiert")
                      : tx("Connected", "Verbunden")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
