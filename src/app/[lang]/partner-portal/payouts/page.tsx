import { getPayoutHistory, getPayoutReadiness } from "@/lib/affiliateMockData";
import { formatPrice } from "@/lib/products";
import { StatusBadge } from "@/components/partner-portal/StatusBadge";
import { RequestPayoutButton } from "@/components/partner-portal/RequestPayoutButton";

export default async function PayoutsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const readiness = getPayoutReadiness();
  const history = getPayoutHistory();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Payouts", "Auszahlungen")}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Available Balance", "Verfügbares Guthaben")}</div>
          <div className="mt-2 text-2xl font-medium text-ink">{formatPrice(readiness.availableBalance)}</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Minimum Payout", "Mindestauszahlung")}</div>
          <div className="mt-2 text-2xl font-medium text-ink">{formatPrice(readiness.minimumPayout)}</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Payment Method", "Zahlungsmethode")}</div>
          <div className="mt-2 text-lg font-medium text-ink">
            {readiness.selectedMethod === "stripe" ? "Stripe Connect" : readiness.selectedMethod === "bank" ? tx("Bank transfer", "Banküberweisung") : tx("Not selected", "Nicht ausgewählt")}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-mauve/10 bg-white/60 p-6">
        <RequestPayoutButton readiness={readiness} />
      </div>

      <h2 className="mt-10 font-serif text-xl text-ink">{tx("Payout History", "Auszahlungsverlauf")}</h2>
      {history.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-mauve/10 bg-white/60 p-10 text-center">
          <p className="text-ink/70">{tx("You have not received any payouts yet.", "Sie haben noch keine Auszahlungen erhalten.")}</p>
          <p className="mt-1 text-sm text-ink/50">{tx("Your payout history will appear here.", "Ihr Auszahlungsverlauf wird hier angezeigt.")}</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-mauve/10 bg-white/60">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-mauve/10 text-left text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3">{tx("Date", "Datum")}</th>
                <th className="px-4 py-3">{tx("Amount", "Betrag")}</th>
                <th className="px-4 py-3">{tx("Method", "Methode")}</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">{tx("Reference", "Referenz")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((p) => (
                <tr key={p.id} className="border-b border-mauve/5 last:border-0 align-top">
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(p.date).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(p.amount)}</td>
                  <td className="px-4 py-3 text-ink/70">{p.method}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                    {p.failureReason && <p className="mt-1 max-w-xs text-xs text-red-700">{p.failureReason}</p>}
                  </td>
                  <td className="px-4 py-3 text-ink/50">{p.referenceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
