import { getReferralTools } from "@/lib/affiliateMockData";
import { CopyButton } from "@/components/partner-portal/CopyButton";
import { QrCodeBox } from "@/components/partner-portal/QrCodeBox";
import { ShareButton } from "@/components/partner-portal/ShareButton";

export default async function ReferralToolsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const tools = getReferralTools();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Referral Tools", "Empfehlungs-Tools")}</h1>
      <p className="mt-2 text-ink/70">{tx("Share your link and coupon code to start earning commission.", "Teilen Sie Ihren Link und Gutscheincode, um Provisionen zu verdienen.")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
            <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Affiliate Code", "Partner-Code")}</div>
            <div className="mt-1 text-lg font-medium text-ink">{tools.affiliateCode}</div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-mauve/10 bg-sand/40 px-4 py-3">
              <code className="min-w-0 flex-1 truncate text-sm text-ink/80">{tools.referralLink}</code>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton value={tools.referralLink} label={tx("Copy Affiliate Link", "Partner-Link kopieren")} />
              <ShareButton value={tools.referralLink} />
            </div>
          </div>

          <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Coupon Code", "Gutscheincode")}</div>
                <div className="mt-1 text-lg font-medium text-ink">{tools.couponCode}</div>
              </div>
              <div className="text-right text-sm text-ink/60">
                <div>{tx("Customer Discount", "Kundenrabatt")}: {tools.discountPercent}%</div>
                <div>{tx("Affiliate Commission", "Partnerprovision")}: {tools.commissionPercent}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-mauve/10 bg-sand/40 px-4 py-3">
              <code className="min-w-0 flex-1 truncate text-sm text-ink/80">{tools.couponLink}</code>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton value={tools.couponCode} label={tx("Copy Coupon Code", "Gutscheincode kopieren")} />
              <CopyButton value={tools.couponLink} label={tx("Copy Coupon Link", "Gutschein-Link kopieren")} />
            </div>
          </div>
        </div>

        <QrCodeBox value={tools.referralLink} />
      </div>
    </div>
  );
}
