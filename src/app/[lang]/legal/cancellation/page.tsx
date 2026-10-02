import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Cancellation Policy — SomnoBalance" };

export default async function CancellationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.cancellation.title} updated="4. September 2026">
        <p>
          Diese Stornierungsrichtlinie gilt für über www.somnobalance.com aufgegebene
          Bestellungen und beschreibt, wie Sie eine Stornierung vor Versand beantragen können.
          Sie steht unabhängig neben dem gesetzlichen Widerrufsrecht der Verbraucher:innen gemäß
          unserer <a href={`/${lang}/legal/withdrawal`}>Widerrufsbelehrung</a> und schränkt dieses
          nicht ein.
        </p>

        <h2>1. Stornierungsanfragen</h2>
        <p>
          Sie können eine Stornierung beantragen, indem Sie SomnoBalance so bald wie möglich
          nach Aufgabe der Bestellung kontaktieren. Die Stornierung ist vom aktuellen
          Bearbeitungsstand der Bestellung abhängig.
        </p>

        <h2>2. Standardprodukte</h2>
        <p>
          Für lagernde Standardprodukte werden Stornierungsanfragen in der Regel akzeptiert,
          sofern die Bestellung noch nicht versandt wurde. Nach Versand der Bestellung ist eine
          Stornierung über dieses Verfahren in der Regel nicht mehr möglich.
        </p>

        <h2>3. Sammelbestellungen, Sonderanfertigungen oder B2B-Bestellungen</h2>
        <p>
          Bei B2B-Sammelbestellungen oder Bestellungen, die speziell für einen Geschäftskunden
          hergestellt oder beschafft werden, ist eine Stornierung nach Beginn von Produktion
          oder Beschaffung unter Umständen nicht mehr möglich. Die Stornierungsbedingungen für
          solche Bestellungen werden im Rahmen der Bestellbestätigung oder des jeweiligen
          Partnervertrags festgelegt. Dies gilt auch für Matratzen, die auf Bestellung gefertigt
          werden.
        </p>

        <h2>4. Stornierung vor Versand</h2>
        <p>
          Geht eine berechtigte Stornierungsanfrage vor Versand ein, storniert SomnoBalance die
          Bestellung und leitet eine entsprechende Erstattung ein. Die Dauer der Erstattung kann
          vom Zahlungsdienstleister und Ihrer Bank abhängen.
        </p>

        <h2>5. Stornierung nach Versand</h2>
        <p>
          Nach Versand der Bestellung ist eine Stornierung über dieses Verfahren grundsätzlich
          nicht mehr möglich. Benötigen Sie das Produkt nicht mehr, beachten Sie bitte unsere{" "}
          <a href={`/${lang}/legal/withdrawal`}>Widerrufsbelehrung</a> (für Verbraucher:innen)
          oder kontaktieren Sie uns bezüglich des anwendbaren Rückgabeverfahrens.
        </p>

        <h2>6. Stornierung durch SomnoBalance</h2>
        <p>
          SomnoBalance kann eine Bestellung unter anderem bei Nichtverfügbarkeit des Produkts,
          fehlerhaften Preis- oder Produktangaben, gescheiterter Zahlung, Verdacht auf
          betrügerische Aktivität, fehlerhaften oder nicht verifizierbaren Kundenangaben,
          Lieferbeschränkungen, technischen Fehlern oder einem Verstoß gegen unsere{" "}
          <a href={`/${lang}/legal/terms`}>AGB</a> stornieren. Wurde für eine von SomnoBalance
          stornierte Bestellung bereits gezahlt, leiten wir eine entsprechende Erstattung ein.
        </p>

        <h2>7. Erstattung nach Stornierung</h2>
        <p>
          Genehmigte Erstattungen erfolgen in der Regel über das ursprüngliche Zahlungsmittel.
          Wie lange es dauert, bis der Betrag auf Ihrem Konto sichtbar wird, hängt vom
          Zahlungsdienstleister, Ihrer Bank oder Ihrem Finanzinstitut ab.
        </p>

        <h2>8. Stornierung beantragen</h2>
        <p>Um eine Stornierung zu beantragen, kontaktieren Sie uns unter E-Mail: {business.email}, Telefon: {business.phone}. Bitte geben Sie an:</p>
        <ul>
          <li>Bestellnummer</li>
          <li>Name der Kundin/des Kunden</li>
          <li>hinterlegte Mobilnummer oder E-Mail-Adresse</li>
          <li>Grund der Stornierung</li>
        </ul>
        <p>Stornierungsanfragen sollten so früh wie möglich eingereicht werden.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.cancellation.title} updated="4 September 2026">
      <p>
        This Cancellation Policy applies to orders placed through www.somnobalance.com and
        describes how you may request to cancel an order before it is dispatched. It is separate
        from, and does not limit, the statutory right of withdrawal available to consumers under
        our <a href={`/${lang}/legal/withdrawal`}>Right of Withdrawal Policy</a>.
      </p>

      <h2>1. Cancellation requests</h2>
      <p>
        You may request cancellation by contacting SomnoBalance as soon as possible after placing
        an order. Cancellation is subject to the current processing status of the order.
      </p>

      <h2>2. Standard products</h2>
      <p>
        For standard, in-stock products, cancellation requests may generally be accepted if the
        order has not yet been dispatched. Once an order has been dispatched, cancellation may no
        longer be possible through this process.
      </p>

      <h2>3. Bulk, made-to-order or B2B orders</h2>
      <p>
        For B2B bulk orders or orders produced or sourced specifically for a business customer,
        cancellation may not be possible once production or procurement has commenced.
        Cancellation terms for such orders will be confirmed as part of the order confirmation or
        the applicable partner agreement. This includes mattresses, which are manufactured to
        order.
      </p>

      <h2>4. Cancellation before dispatch</h2>
      <p>
        If an eligible cancellation request is received before dispatch, SomnoBalance will cancel
        the order and initiate an eligible refund. Refund processing times may depend on the
        payment provider and your bank.
      </p>

      <h2>5. Cancellation after dispatch</h2>
      <p>
        Once an order has been dispatched, it generally cannot be cancelled through this process.
        If you no longer require the product, please see our{" "}
        <a href={`/${lang}/legal/withdrawal`}>Right of Withdrawal Policy</a> (for consumers) or contact us
        regarding the applicable return process.
      </p>

      <h2>6. Order cancellation by SomnoBalance</h2>
      <p>
        SomnoBalance may cancel an order in circumstances including product unavailability,
        incorrect pricing or product information, payment failure, suspected fraudulent activity,
        incorrect or unverifiable customer information, delivery restrictions, technical errors,
        or a violation of our <a href={`/${lang}/legal/terms`}>Terms &amp; Conditions</a>. If payment has
        already been received for an order cancelled by SomnoBalance, an eligible refund will be
        initiated.
      </p>

      <h2>7. Refund after cancellation</h2>
      <p>
        Approved refunds will generally be processed through the original payment method. The time
        taken for the amount to reflect in your account depends on the payment provider, your bank
        or financial institution.
      </p>

      <h2>8. How to request cancellation</h2>
      <p>
        To request cancellation, contact us at Email: {business.email}, Phone: {business.phone}.
        Please provide:
      </p>
      <ul>
        <li>Order number</li>
        <li>Customer name</li>
        <li>Registered mobile number or email</li>
        <li>Reason for cancellation</li>
      </ul>
      <p>Cancellation requests should be submitted as early as possible.</p>
    </LegalPage>
  );
}
