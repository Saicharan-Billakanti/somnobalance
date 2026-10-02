import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Right of Withdrawal — SomnoBalance" };

export default async function WithdrawalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.withdrawal.title} updated="4. September 2026">
        <p>
          Diese Belehrung gilt für Verbraucher:innen — natürliche Personen, die mit
          SomnoBalance ein Rechtsgeschäft zu Zwecken abschließen, die überwiegend außerhalb
          ihrer gewerblichen oder selbständigen beruflichen Tätigkeit liegen. Sie gilt nicht für
          B2B-Kund:innen, die im Rahmen ihrer gewerblichen oder selbständigen beruflichen
          Tätigkeit handeln.
        </p>

        <h2>Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p>
          Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter
          Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat —
          im Falle einer Bestellung mehrerer, getrennt gelieferter Waren ab dem Tag, an dem Sie
          oder ein von Ihnen benannter Dritter die letzte Ware in Besitz genommen haben bzw. hat.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — {business.ownerName}, handelnd
          unter der Bezeichnung &quot;Willing1863&quot; (Einzelunternehmen),{" "}
          {business.addressLine1}, {business.addressLine2}, E-Mail: {business.email}, Telefon:{" "}
          {business.phone} — mittels einer eindeutigen Erklärung (z. B. ein mit der Post
          versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
          informieren. Sie können dafür das untenstehende Muster-Widerrufsformular verwenden, was
          jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
          Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>

        <h2>Folgen des Widerrufs</h2>
        <p>
          Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle Zahlungen, die wir von
          Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
          Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns
          angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens
          binnen 14 Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf dieses Vertrags
          bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel,
          das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen
          wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
          Rückzahlung Entgelte berechnet.
        </p>
        <p>
          Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben
          oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je
          nachdem, welches der frühere Zeitpunkt ist.
        </p>
        <p>
          Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen 14 Tagen ab dem
          Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns
          zurückzusenden oder zu übergeben, und zwar an {business.ownerName}, &quot;Willing1863&quot;,{" "}
          {business.addressLine1}, {business.addressLine2}. Die Frist ist gewahrt, wenn Sie die
          Waren vor Ablauf der Frist von 14 Tagen absenden.
        </p>
        <p>
          Sie haben die Kosten der Rücksendung der Waren zu tragen. Für paketfähige Waren
          (Ritual-Produkte, Kartenset, Nackenstützkissen, Starter-Set) erfolgt die Rücksendung
          auf eigene Kosten als DHL-Paket. Matratzen können nach dem Auspacken nicht mehr
          paketfähig verpackt werden und werden ausschließlich durch einen Speditionsdienst bis
          zur Bordsteinkante abgeholt, den wir auf Ihre Anfrage hin organisieren. Der genaue
          Rücksendekostenbetrag wird vor Vertragsschluss auf der jeweiligen Produktseite
          angegeben.
        </p>
        <p>
          Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
          Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise
          der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
        </p>

        <h2>Ausschluss und vorzeitiges Erlöschen des Widerrufsrechts</h2>
        <p>Sofern nicht anders vereinbart, besteht das Widerrufsrecht nicht bei Verträgen:</p>
        <ul>
          <li>zur Lieferung von Waren, die nach Kundenspezifikation angefertigt werden oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind</li>
          <li>zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde</li>
          <li>zur Lieferung von Waren, die nach ihrer Lieferung aufgrund ihrer Beschaffenheit untrennbar mit anderen Gütern vermischt wurden</li>
          <li>zur Lieferung versiegelter Ton- oder Videoaufnahmen oder versiegelter Software, wenn die Versiegelung nach der Lieferung entfernt wurde</li>
        </ul>

        <h2>Muster-Widerrufsformular</h2>
        <p>(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
        <div className="rounded-xl border border-mauve/15 bg-white/60 p-5 text-sm">
          <p>
            An: {business.ownerName}, handelnd unter der Bezeichnung &quot;Willing1863&quot;
            (Einzelunternehmen), {business.addressLine1}, {business.addressLine2}, E-Mail:{" "}
            {business.email}
          </p>
          <p className="mt-3">
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den
            Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*),
          </p>
          <p className="mt-3">Bestellt am (*)/erhalten am (*):</p>
          <p className="mt-3">Name des/der Verbraucher(s):</p>
          <p className="mt-3">Anschrift des/der Verbraucher(s):</p>
          <p className="mt-3">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
          <p className="mt-3">Datum:</p>
          <p className="mt-3 text-xs text-ink/50">(*) Unzutreffendes streichen.</p>
        </div>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.withdrawal.title} updated="4 September 2026">
      <p>
        This policy applies to consumers (Verbraucher) — natural persons entering into a contract
        with SomnoBalance for purposes that are predominantly outside their trade, business or
        profession. It does not apply to B2B customers acting in the course of their trade,
        business or profession.
      </p>

      <h2>Right of withdrawal</h2>
      <p>You have the right to withdraw from this contract within 14 days without giving any reason.</p>
      <p>
        The withdrawal period will expire 14 days from the day on which you, or a third party
        other than the carrier and indicated by you, acquire physical possession of the goods or,
        in the case of an order comprising multiple goods delivered separately, from the day you
        acquire physical possession of the last good.
      </p>
      <p>
        To exercise the right of withdrawal, you must inform us — {business.ownerName}, trading as
        &quot;Willing1863&quot; (sole proprietorship / Einzelunternehmen), {business.addressLine1},{" "}
        {business.addressLine2}, Email: {business.email}, Phone: {business.phone} — of your
        decision to withdraw from this contract by an unequivocal statement (for example a letter
        sent by post, or an email). You may use the model withdrawal form set out below, but it is
        not obligatory.
      </p>
      <p>
        To meet the withdrawal deadline, it is sufficient for you to send your communication
        concerning your exercise of the right of withdrawal before the withdrawal period has
        expired.
      </p>

      <h2>Effects of withdrawal</h2>
      <p>
        If you withdraw from this contract, we will reimburse all payments received from you,
        including delivery costs (except for supplementary costs resulting from your choice of a
        delivery type other than the least expensive standard delivery offered by us), without
        undue delay and in any event not later than 14 days from the day on which we are informed
        about your decision to withdraw. We will use the same means of payment as you used for the
        original transaction, unless expressly agreed otherwise; in any event, you will not incur
        any fees as a result of this reimbursement.
      </p>
      <p>
        We may withhold reimbursement until we have received the goods back, or you have supplied
        evidence of having sent back the goods, whichever is the earliest.
      </p>
      <p>
        You must send back the goods or hand them over to us at {business.ownerName},
        &quot;Willing1863&quot;, {business.addressLine1}, {business.addressLine2}, without undue
        delay and in any event not later than 14 days from the day on which you communicate your
        withdrawal from this contract. The deadline is met if you send back the goods before the
        period of 14 days has expired.
      </p>
      <p>
        You will have to bear the direct cost of returning the goods. For goods that can be
        shipped as a parcel (Ritual collection products, card set, neck support pillow, starter
        set), the return is made as a DHL parcel at your own cost. Mattresses cannot be repacked
        into parcel-suitable packaging once unpacked and are collected exclusively by a freight
        forwarder, kerbside, which we arrange at your request; the exact return-cost amount for a
        mattress will be stated on the relevant product page before the contract is concluded.
      </p>
      <p>
        You are only liable for any diminished value of the goods resulting from handling other
        than what is necessary to establish the nature, characteristics and functioning of the
        goods.
      </p>

      <h2>Exclusions and early expiry of the right of withdrawal</h2>
      <p>Unless otherwise agreed, the right of withdrawal does not apply to contracts for:</p>
      <ul>
        <li>Goods made to your specifications or clearly personalised</li>
        <li>Sealed goods which are not suitable for return for reasons of health protection or hygiene, if their seal was removed after delivery</li>
        <li>Goods which, after delivery, are, according to their nature, inseparably mixed with other items</li>
        <li>Sealed audio or video recordings, or sealed software, once unsealed after delivery</li>
      </ul>

      <h2>Model withdrawal form</h2>
      <p>(Complete and return this form only if you wish to withdraw from the contract.)</p>
      <div className="rounded-xl border border-mauve/15 bg-white/60 p-5 text-sm">
        <p>
          To: {business.ownerName}, trading as &quot;Willing1863&quot; (sole proprietorship /
          Einzelunternehmen), {business.addressLine1}, {business.addressLine2}, Email:{" "}
          {business.email}
        </p>
        <p className="mt-3">
          I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of
          the following goods (*)/for the provision of the following service (*),
        </p>
        <p className="mt-3">Ordered on (*)/received on (*):</p>
        <p className="mt-3">Name of consumer(s):</p>
        <p className="mt-3">Address of consumer(s):</p>
        <p className="mt-3">Signature of consumer(s) (only if this form is notified on paper):</p>
        <p className="mt-3">Date:</p>
        <p className="mt-3 text-xs text-ink/50">(*) Delete as appropriate.</p>
      </div>
    </LegalPage>
  );
}
