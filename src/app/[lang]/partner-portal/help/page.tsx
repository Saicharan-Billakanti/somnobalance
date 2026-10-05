import Link from "next/link";
import { getNotifications } from "@/lib/affiliateMockData";
import { NotificationsList } from "@/components/partner-portal/NotificationsList";

export default async function HelpPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const notifications = getNotifications();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Help", "Hilfe")}</h1>

      <h2 className="mt-8 font-serif text-xl text-ink">{tx("Notifications", "Benachrichtigungen")}</h2>
      <div className="mt-4">
        <NotificationsList notifications={notifications} />
      </div>

      <h2 className="mt-10 font-serif text-xl text-ink">{tx("Common questions", "Häufige Fragen")}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">{tx("How is my commission calculated?", "Wie wird meine Provision berechnet?")}</h3>
          <p className="mt-2 text-sm text-ink/70">
            {tx(
              "Commission is calculated as a percentage of the order value placed through your referral link or coupon code. It becomes available for payout after the configured approval period, and refunded or cancelled orders do not produce an active commission.",
              "Die Provision wird als Prozentsatz des Bestellwerts berechnet, der über Ihren Empfehlungslink oder Gutscheincode getätigt wurde. Sie steht nach Ablauf der festgelegten Freigabefrist zur Auszahlung bereit; erstattete oder stornierte Bestellungen erzeugen keine aktive Provision.",
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">{tx("When will I receive my payout?", "Wann erhalte ich meine Auszahlung?")}</h3>
          <p className="mt-2 text-sm text-ink/70">
            {tx(
              "Once your available balance reaches the minimum payout threshold and your selected payout method (Stripe Connect or bank transfer) is fully verified, you can request a payout from the Payouts section.",
              "Sobald Ihr verfügbares Guthaben die Mindestauszahlungsgrenze erreicht und Ihre gewählte Auszahlungsmethode (Stripe Connect oder Banküberweisung) vollständig verifiziert ist, können Sie im Bereich Auszahlungen eine Auszahlung anfordern.",
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">{tx("Why does Stripe show “verification required”?", "Warum zeigt Stripe „Verifizierung erforderlich“ an?")}</h3>
          <p className="mt-2 text-sm text-ink/70">
            {tx(
              "Stripe sometimes asks for additional identity or bank information after the initial onboarding. Continue the verification directly in Stripe’s hosted flow from the Payment Settings page.",
              "Stripe fragt nach dem ersten Onboarding manchmal zusätzliche Identitäts- oder Bankinformationen ab. Setzen Sie die Verifizierung direkt im von Stripe gehosteten Ablauf über die Seite Zahlungseinstellungen fort.",
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
          <h3 className="font-medium text-ink">{tx("Still need help?", "Brauchen Sie weitere Hilfe?")}</h3>
          <p className="mt-2 text-sm text-ink/70">
            {tx("Reach out directly through the", "Wenden Sie sich direkt über den Bereich")}{" "}
            <Link href={`/${lang}/partner-portal/messages`} className="text-mauve-dark underline">
              {tx("Messages", "Nachrichten")}
            </Link>{" "}
            {tx("section and our support team will get back to you.", "an uns — unser Support-Team meldet sich bei Ihnen.")}
          </p>
        </div>
      </div>
    </div>
  );
}
