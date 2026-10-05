import { getBankDetails, getPayoutReadiness } from "@/lib/affiliateMockData";
import { PayoutMethodSelector } from "@/components/partner-portal/PayoutMethodSelector";

export default async function PaymentSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const readiness = getPayoutReadiness();
  const bankDetails = getBankDetails();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Payment Settings", "Zahlungseinstellungen")}</h1>
      <p className="mt-2 text-ink/70">{tx("Choose how you receive your commission payouts.", "Wählen Sie, wie Sie Ihre Provisionsauszahlungen erhalten.")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Payout Threshold", "Auszahlungsgrenze")}</div>
          <div className="mt-2 text-lg font-medium text-ink">€{readiness.minimumPayout.toFixed(2)}</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Payout Currency", "Auszahlungswährung")}</div>
          <div className="mt-2 text-lg font-medium text-ink">EUR</div>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Requirements", "Voraussetzungen")}</div>
          <div className="mt-2 text-sm text-ink/70">{tx("Verified identity and completed payout method.", "Verifizierte Identität und vollständige Auszahlungsmethode.")}</div>
        </div>
      </div>

      <div className="mt-8">
        <PayoutMethodSelector
          initialMethod={readiness.selectedMethod}
          stripeStatus={readiness.stripeStatus}
          bankDetails={bankDetails}
        />
      </div>
    </div>
  );
}
