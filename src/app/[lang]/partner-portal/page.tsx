import { getAffiliateOverview } from "@/lib/affiliateMockData";
import { formatPrice } from "@/lib/products";
import { StatCard } from "@/components/partner-portal/StatCard";
import { StatusBadge } from "@/components/partner-portal/StatusBadge";

export default function PartnerPortalOverviewPage() {
  const overview = getAffiliateOverview();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">{overview.name}</h1>
          <p className="mt-1 text-sm text-ink/60">Affiliate code: {overview.affiliateCode}</p>
        </div>
        <StatusBadge status={overview.status} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Referred Orders" value={String(overview.totalReferredOrders)} />
        <StatCard label="Total Revenue" value={formatPrice(overview.totalReferredRevenue)} />
        <StatCard label="Total Commission" value={formatPrice(overview.totalCommissionEarned)} />
        <StatCard label="Available Balance" value={formatPrice(overview.availableBalance)} />
        <StatCard label="Pending Commission" value={formatPrice(overview.pendingCommission)} />
        <StatCard label="Paid Out" value={formatPrice(overview.paidCommission)} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">Commission Rate</div>
          <div className="mt-2 text-lg font-medium text-ink">{overview.commissionRate}%</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">Coupon Code</div>
          <div className="mt-2 text-lg font-medium text-ink">{overview.couponCode}</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">Next Payout Eligibility</div>
          <div className="mt-2 text-lg font-medium text-ink">
            {overview.nextPayoutEligibleDate
              ? new Date(overview.nextPayoutEligibleDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">Stripe Connect Status</div>
          <div className="mt-2">
            <StatusBadge
              status={overview.stripeStatus}
              label={
                overview.stripeStatus === "not_connected"
                  ? "Not connected"
                  : overview.stripeStatus === "restricted"
                    ? "Verification required"
                    : overview.stripeStatus === "paused"
                      ? "Paused"
                      : "Connected"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
