import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Refund & Return Policy — SomnoBalance" };

export default async function ReturnsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.returns.title} updated="4. September 2026">
        <p>
          SomnoBalance möchte hochwertige Matratzen, Kissen, Öle, Tees, Ritual-Karten und
          verwandte Produkte anbieten. Erhalten Sie ein Produkt, das beschädigt, mangelhaft,
          fehlerhaft hergestellt oder wesentlich anders als bestellt ist, kontaktieren Sie uns
          bitte, damit wir den Fall prüfen können.
        </p>

        <h2>1. Drei getrennte Kundenschutzrechte</h2>
        <p>
          Diese Richtlinie besteht neben zwei weiteren, eigenständigen Schutzrechten: (a) dem
          gesetzlichen 14-tägigen Widerrufsrecht für Verbraucher:innen (siehe unsere{" "}
          <a href={`/${lang}/legal/withdrawal`}>Widerrufsbelehrung</a>) und (b) der gesetzlichen
          zweijährigen Gewährleistung für Mängel, die bereits bei Lieferung vorlagen (siehe
          Ziffer 12 unserer <a href={`/${lang}/legal/terms`}>AGB</a>). Keines dieser gesetzlichen
          Rechte wird durch diese Richtlinie eingeschränkt.
        </p>

        <h2>2. Rückgabefähige Produkte</h2>
        <p>Ein Produkt kann im Rahmen dieser Richtlinie für Rückgabe, Ersatz oder Erstattung infrage kommen, wenn es:</p>
        <ul>
          <li>beim Transport beschädigt wurde</li>
          <li>mangelhaft ist</li>
          <li>fehlerhaft hergestellt wurde</li>
          <li>das falsche Produkt ist</li>
          <li>wesentlich vom bestellten Produkt abweicht</li>
          <li>fehlende Teile oder Bestandteile aufweist, soweit anwendbar</li>
        </ul>
        <p>Alle Rückgabe- und Erstattungsanfragen unterliegen einer Prüfung.</p>

        <h2>3. Verbrauchsprodukte und hygieneversiegelte Produkte</h2>
        <p>
          Öle und Tee sind Verbrauchsprodukte. Sobald sie geöffnet oder ihre Versiegelung
          entfernt wurde, sind sie — sofern nicht mangelhaft — aus Gründen der Hygiene sowie der
          Lebensmittel-/Kosmetiksicherheit grundsätzlich von der Rückgabe ausgeschlossen.
          Entsprechend sind Kissen, Matratzenbezüge oder andere mit einem Hygienesiegel versehene
          Bettwaren nach Entfernung dieses Siegels — sofern nicht mangelhaft — grundsätzlich von
          der Rückgabe ausgeschlossen.
        </p>

        <h2>4. Vom Kunden falsch gewählte Option oder Angabe</h2>
        <p>
          Bei Produkten mit vom Kunden ausgewählten Optionen (z. B. Härtegrad, Größe oder Duft)
          sind Sie für die korrekte Auswahl im Bestellprozess verantwortlich. SomnoBalance
          haftet nicht für eine Abweichung, die allein auf einer fehlerhaften Auswahl des Kunden
          beruht; wir unterstützen Sie jedoch stets bei der Suche nach einer passenden Lösung.
        </p>

        <h2>5. Meldung beschädigter Produkte</h2>
        <p>Kommt Ihr Produkt beschädigt an, kontaktieren Sie uns bitte möglichst innerhalb von 48 Stunden nach Lieferung. Bitte geben Sie an:</p>
        <ul>
          <li>Bestellnummer</li>
          <li>Fotos der äußeren Verpackung</li>
          <li>Fotos des Versandetiketts</li>
          <li>deutliche Fotos oder ein Video des beschädigten Produkts</li>
          <li>Beschreibung des Problems</li>
        </ul>
        <p>Diese Angaben können für die Klärung des Falls mit dem Kurier- oder Logistikdienstleister erforderlich sein.</p>

        <h2>6. Rückgabeverfahren</h2>
        <ul>
          <li>Kontaktieren Sie SomnoBalance über die offiziellen Kontaktdaten</li>
          <li>Geben Sie Ihre Bestellnummer an</li>
          <li>Schildern Sie das Problem</li>
          <li>Reichen Sie auf Anfrage Fotos oder ein Video ein</li>
          <li>Warten Sie die Bestätigung durch unser Support-Team ab</li>
          <li>Folgen Sie im Falle einer Genehmigung den von uns bereitgestellten Rücksendehinweisen</li>
        </ul>
        <p>
          Bitte senden Sie Produkte nicht zurück, ohne zuvor Rücksendehinweise erhalten zu
          haben, es sei denn, wir weisen Sie ausdrücklich dazu an.
        </p>

        <h2>7. Prüfung</h2>
        <p>
          Zurückgesandte Produkte können geprüft werden, um festzustellen, ob das gemeldete
          Problem einen Anspruch auf Erstattung oder Ersatz begründet. Ein Anspruch kann
          abgelehnt werden, wenn die Prüfung ergibt, dass das Produkt nach Lieferung durch
          unsachgemäße Handhabung beschädigt wurde, unsachgemäß verwendet wurde, den
          Bestellangaben entspricht oder die Voraussetzungen dieser Richtlinie anderweitig nicht
          erfüllt.
        </p>

        <h2>8. Ersatz</h2>
        <p>
          Stellt sich bei einem anspruchsberechtigten Produkt heraus, dass es mangelhaft,
          beschädigt oder falsch geliefert wurde, kann SomnoBalance nach eigenem Ermessen und im
          Rahmen der gesetzlichen Vorgaben das Produkt ersetzen, es — soweit zumutbar —
          reparieren, eine Erstattung leisten oder eine andere angemessene Lösung anbieten.
        </p>

        <h2>9. Erstattungen</h2>
        <p>
          Wird eine Erstattung außerhalb des gesetzlichen Widerrufsverfahrens genehmigt, erfolgt
          sie in der Regel über das ursprüngliche Zahlungsmittel, unverzüglich und grundsätzlich
          innerhalb von 14 Tagen nach Genehmigung, entsprechend den in unserer{" "}
          <a href={`/${lang}/legal/withdrawal`}>Widerrufsbelehrung</a> genannten Fristen. Bis der
          Betrag tatsächlich auf Ihrem Konto gutgeschrieben wird, können je nach
          Zahlungsdienstleister oder Bank noch einige weitere Werktage vergehen.
        </p>

        <h2>10. Fälle ohne Rückgabeanspruch</h2>
        <p>Vorbehaltlich Ihrer gesetzlichen Rechte besteht im Rahmen dieser Richtlinie in der Regel kein Anspruch auf Rückgabe oder Erstattung bei:</p>
        <ul>
          <li>Sinneswandel, wenn die gesetzliche Widerrufsfrist bereits abgelaufen ist</li>
          <li>geöffneten oder entsiegelten Verbrauchsprodukten (Öle, Tee) ohne Mangel</li>
          <li>hygieneversiegelten Bettwaren nach Entfernung des Siegels, ohne Mangel</li>
          <li>vom Kunden im Bestellprozess falsch gewählter Option (z. B. Härtegrad oder Duft)</li>
          <li>Produkten, die nach erfolgreicher Lieferung durch unsachgemäße Handhabung beschädigt wurden</li>
          <li>Produkten, bei denen kein SomnoBalance zurechenbarer Mangel oder Fehler vorliegt</li>
        </ul>

        <h2>11. Versandkosten für Rücksendungen</h2>
        <p>
          SomnoBalance unterscheidet bei Rücksendungen zwischen zwei Produktgruppen. Paketfähige
          Waren (Ritual-Produkte, Regenerationskarten-Set, Nackenstützkissen, Starter-Set) werden
          auf Kosten des Kunden als DHL-Paket zurückgesandt. Matratzen lassen sich nach dem
          Auspacken nicht mehr paketfähig verpacken und werden ausschließlich durch einen
          Speditionsdienst bis zur Bordsteinkante abgeholt, den SomnoBalance auf Wunsch des
          Kunden organisiert; auch hier trägt der Kunde die Rücksendekosten, in der Höhe, die vor
          Vertragsschluss auf der jeweiligen Produktseite angegeben ist. Wird eine Rücksendung
          aufgrund eines SomnoBalance zurechenbaren Fehlers oder eines anspruchsberechtigten
          Mangels genehmigt, übernimmt SomnoBalance stattdessen die angemessenen
          Rücksendekosten für beide Produktgruppen.
        </p>

        <h2>12. Umtausch</h2>
        <p>Ein Produktumtausch kann, sofern angemessen und je nach Verfügbarkeit, angeboten werden.</p>

        <h2>13. Aktions- oder Rabattbestellungen</h2>
        <p>
          Mit Aktionsangeboten oder Rabatten erworbene Produkte unterliegen weiterhin dieser
          Richtlinie. Ein Rabatt oder Aktionsangebot entzieht Ihnen keine Rechte, die gesetzlich
          nicht ausgeschlossen werden können.
        </p>

        <h2>14. Betrügerische oder missbräuchliche Ansprüche</h2>
        <p>
          SomnoBalance behält sich vor, möglicherweise betrügerische, irreführende oder
          missbräuchliche Rückgabe- oder Erstattungsansprüche zu prüfen. Diese Ziffer schränkt
          keine Rechte ein, die Kund:innen nach geltendem Recht zustehen.
        </p>

        <p className="mt-8 text-xs text-ink/50">
          Kontakt für Rücksendungen: {business.email} · {business.phone}
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.returns.title} updated="4 September 2026">
      <p>
        SomnoBalance aims to provide high-quality mattresses, pillows, oils, tea, ritual cards and
        related products. If you receive a product that is damaged, defective, incorrectly
        manufactured or materially different from what you ordered, please contact us so that we
        can review the issue.
      </p>

      <h2>1. Three separate customer protections</h2>
      <p>
        This policy works alongside two further, separate protections: (a) the statutory 14-day
        right of withdrawal available to consumers (see our{" "}
        <a href={`/${lang}/legal/withdrawal`}>Right of Withdrawal Policy</a>), and (b) the statutory
        two-year warranty (Gewährleistung) for defects that existed at the time of delivery (see
        Section 12 of our <a href={`/${lang}/legal/terms`}>Terms &amp; Conditions</a>). Neither of those
        statutory rights is limited by this policy.
      </p>

      <h2>2. Eligible returns</h2>
      <p>A product may be eligible for return, replacement or refund under this policy where it is:</p>
      <ul>
        <li>Damaged during transit</li>
        <li>Defective</li>
        <li>Incorrectly manufactured</li>
        <li>The wrong product</li>
        <li>Materially different from the product ordered</li>
        <li>Missing parts or components, where applicable</li>
      </ul>
      <p>All return and refund requests are subject to verification.</p>

      <h2>3. Consumable and hygiene-sealed products</h2>
      <p>
        Oils and tea are consumable products. Once opened or their seal has been broken, they are
        generally not eligible for return for reasons of hygiene and food/cosmetic safety, unless
        the product is defective. Similarly, pillows, mattress covers or other bedding items
        supplied with a hygiene seal are generally not eligible for return once that seal has been
        removed, unless the product is defective.
      </p>

      <h2>4. Wrong option selected by the customer</h2>
      <p>
        For any products ordered with customer-selected options (such as firmness, size or scent),
        you are responsible for selecting the correct option at checkout. SomnoBalance is not
        responsible for a mismatch caused solely by an incorrect selection made by the customer,
        though we will always try to help you find the right solution.
      </p>

      <h2>5. Reporting damaged products</h2>
      <p>If your product arrives damaged, please contact us preferably within 48 hours of delivery. Please provide:</p>
      <ul>
        <li>Order number</li>
        <li>Photographs of the outer packaging</li>
        <li>Photographs of the shipping label</li>
        <li>Clear photographs or video of the damaged product</li>
        <li>Description of the issue</li>
      </ul>
      <p>This information may be required to investigate the claim with the courier or logistics provider.</p>

      <h2>6. Return request process</h2>
      <ul>
        <li>Contact SomnoBalance using the official contact details</li>
        <li>Provide your order number</li>
        <li>Explain the issue</li>
        <li>Provide photographs or video where requested</li>
        <li>Wait for confirmation from our support team</li>
        <li>If approved, follow the return instructions provided by us</li>
      </ul>
      <p>
        Please do not send products back without receiving return instructions, unless
        specifically directed to do so.
      </p>

      <h2>7. Inspection</h2>
      <p>
        Returned products may be inspected to determine whether the reported issue qualifies for a
        refund or replacement. A claim may be rejected where inspection establishes that the
        product was damaged after delivery due to customer handling, was improperly used, matches
        the order specifications, or does not otherwise satisfy this policy.
      </p>

      <h2>8. Replacement</h2>
      <p>
        Where an eligible product is found to be defective, damaged or incorrectly supplied,
        SomnoBalance may, at its discretion and subject to applicable law, replace the product,
        repair it where reasonably possible, provide a refund, or offer another appropriate remedy.
      </p>

      <h2>9. Refunds</h2>
      <p>
        If a refund is approved outside the statutory withdrawal process, it will generally be
        processed through the original payment method, without undue delay and in principle within
        14 days of approval, consistent with the timelines described in our{" "}
        <a href={`/${lang}/legal/withdrawal`}>Right of Withdrawal Policy</a>. Actual crediting to your
        account may take a few additional business days depending on your payment provider or
        bank.
      </p>

      <h2>10. Non-returnable situations</h2>
      <p>Subject to your statutory rights, returns or refunds under this policy will generally not be available for:</p>
      <ul>
        <li>Change of mind, where the statutory withdrawal period has already expired</li>
        <li>Opened or seal-broken consumable products (oils, tea) with no defect</li>
        <li>Hygiene-sealed bedding items once unsealed, with no defect</li>
        <li>Incorrect option selected by the customer at checkout (for example firmness or scent)</li>
        <li>Products damaged after successful delivery due to customer handling</li>
        <li>Products where there is no defect or error attributable to SomnoBalance</li>
      </ul>

      <h2>11. Shipping costs for returns</h2>
      <p>
        SomnoBalance distinguishes between two product groups for returns. Parcel-suitable goods
        (Ritual collection products, regeneration card set, neck support pillow, starter set) are
        returned as a DHL parcel, at the customer&apos;s cost. Mattresses can no longer be repacked
        into parcel-suitable packaging once unpacked and are collected exclusively by a freight
        forwarder, kerbside, which SomnoBalance arranges at the customer&apos;s request; the
        customer likewise bears the return cost, in the amount stated on the relevant product page
        before the contract is concluded. Where a return is approved because of an error
        attributable to SomnoBalance or a qualifying product defect, SomnoBalance will bear the
        reasonable return-shipping costs for either product group instead.
      </p>

      <h2>12. Exchange</h2>
      <p>Product exchanges may be offered where appropriate and subject to product availability.</p>

      <h2>13. Promotional or discounted orders</h2>
      <p>
        Products purchased using promotional offers or discounts remain subject to this policy. A
        discount or promotional offer does not remove any rights that cannot legally be excluded.
      </p>

      <h2>14. Fraudulent or abusive claims</h2>
      <p>
        SomnoBalance reserves the right to investigate potentially fraudulent, misleading or
        abusive refund or return claims. Nothing in this section limits any rights available to
        customers under applicable law.
      </p>

      <p className="mt-8 text-xs text-ink/50">
        Contact for returns: {business.email} · {business.phone}
      </p>
    </LegalPage>
  );
}
