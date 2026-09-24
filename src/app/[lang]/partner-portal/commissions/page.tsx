import { getCommissionHistory } from "@/lib/affiliateMockData";
import { formatPrice } from "@/lib/products";
import { StatusBadge } from "@/components/partner-portal/StatusBadge";

export default async function CommissionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const commissions = getCommissionHistory();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Commissions", "Provisionen")}</h1>
      <p className="mt-2 text-ink/70">
        {tx("Commission becomes available after the configured approval period. You cannot edit these records.", "Provisionen werden nach Ablauf der festgelegten Freigabefrist verfügbar. Diese Einträge können nicht bearbeitet werden.")}
      </p>

      {commissions.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-mauve/10 bg-white/60 p-10 text-center">
          <p className="text-ink/70">{tx("No commissions yet.", "Noch keine Provisionen.")}</p>
          <p className="mt-1 text-sm text-ink/50">{tx("Share your affiliate link to start earning.", "Teilen Sie Ihren Partner-Link, um Provisionen zu verdienen.")}</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-mauve/10 bg-white/60">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-mauve/10 text-left text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3">{tx("Order", "Bestellung")}</th>
                <th className="px-4 py-3">{tx("Date", "Datum")}</th>
                <th className="px-4 py-3">{tx("Order Value", "Bestellwert")}</th>
                <th className="px-4 py-3">{tx("Coupon", "Gutschein")}</th>
                <th className="px-4 py-3">{tx("Rate", "Satz")}</th>
                <th className="px-4 py-3">{tx("Commission", "Provision")}</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">{tx("Payout", "Auszahlung")}</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.orderId} className="border-b border-mauve/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.orderId}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(c.orderDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{formatPrice(c.orderValue)}</td>
                  <td className="px-4 py-3 text-ink/70">{c.couponCode}</td>
                  <td className="px-4 py-3 text-ink/70">{c.commissionRate}%</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(c.commissionAmount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-ink/50">{c.payoutId ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
