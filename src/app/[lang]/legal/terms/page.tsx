import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Terms & Conditions — SomnoBalance" };

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.terms.title} updated="4. September 2026">
        <p>
          Diese Allgemeinen Geschäftsbedingungen (&quot;AGB&quot;) regeln den Zugang zur und die
          Nutzung der SomnoBalance-Plattform sowie den Kauf von Produkten und Leistungen bei uns,
          über unseren B2C-Shop, unseren B2B-Zugangsbereich und unser Affiliate-Programm. Mit dem
          Zugriff auf die Plattform oder der Aufgabe einer Bestellung erklären Sie sich mit
          diesen AGB einverstanden. Wenn Sie diesen AGB nicht zustimmen, nutzen Sie die Plattform
          bitte nicht.
        </p>

        <h2>1. Über SomnoBalance</h2>
        <p>
          SomnoBalance ist die Regenerations- und Lifestyle-Marke von {business.ownerName}. Er
          ist persönlich seit über 35 Jahren im Bereich Schlafumgebungen tätig. Das Unternehmen
          besteht seit {business.operatingSince}. Unter der Marke SomnoBalance bietet er
          kuratierte Produkte an, darunter Matratzen, Kissen, Öle, Tee und Ritual-Karten, als
          Werkzeuge innerhalb eines ganzheitlichen Systems für Regeneration, Ruhe und
          Lebensqualität. SomnoBalance ist nicht einfach ein Händler für Matratzen oder
          Bettwaren: Unsere Produkte, Inhalte und Rituale sind um die vier Phasen des
          SomnoBalance-Systems aufgebaut — Regulate · Let Go · Prepare · Regenerate.
        </p>

        <h2>2. Geltungsbereich und Kundengruppen</h2>
        <p>Diese AGB gelten für drei Nutzergruppen, für die jeweils zusätzliche Bestimmungen gelten können:</p>
        <ul>
          <li>B2C-Kund:innen: Verbraucher:innen, die über unseren Bereich &quot;Für mich&quot; zu privaten, nicht gewerblichen Zwecken einkaufen</li>
          <li>B2B-Kund:innen: Unternehmen aus dem Hotel- und Gesundheitssektor, die über unseren Bereich &quot;Für mein Unternehmen&quot; zu gewerblichen Zwecken einkaufen</li>
          <li>Affiliate-Partner:innen: Gesundheitsfachkräfte und weitere Partner:innen, die über &quot;Partner werden&quot; beitreten</li>
        </ul>
        <p>
          Bestimmte in diesen AGB beschriebene Schutzrechte — insbesondere das gesetzliche
          Widerrufsrecht in Ziffer 10 — gelten nur für Verbraucher:innen und nicht für
          B2B-Kund:innen, die im Rahmen ihrer gewerblichen oder selbständigen beruflichen
          Tätigkeit handeln. Für Affiliate-Partnerschaften gilt ergänzend ein gesonderter, beim
          Onboarding bereitgestellter Partnervertrag; im Konfliktfall geht dieser Vertrag für die
          darin ausdrücklich geregelten Punkte vor.
        </p>

        <h2>3. Teilnahmevoraussetzungen</h2>
        <p>Mit der Nutzung der Plattform versichern Sie, dass:</p>
        <ul>
          <li>die von Ihnen gemachten Angaben zutreffend und vollständig sind</li>
          <li>Sie nach geltendem Recht geschäftsfähig sind</li>
          <li>Sie die Plattform ausschließlich zu rechtmäßigen Zwecken nutzen</li>
        </ul>

        <h2>4. Produktinformationen</h2>
        <p>
          Wir bemühen uns nach Kräften, dass Produktbeschreibungen, Materialangaben, Maße,
          Abbildungen und Preise auf der Plattform zutreffend sind. Dennoch gilt:
        </p>
        <ul>
          <li>Farben und Texturen können je nach Anzeigegerät und aufgrund natürlicher Materialschwankungen leicht abweichen</li>
          <li>Das Erscheinungsbild eines Produkts kann herstellungsbedingt und aufgrund der natürlichen oder handwerklichen Beschaffenheit bestimmter Materialien leicht variieren</li>
          <li>Schwankungen von Charge zu Charge sind bei Naturprodukten wie Ölen und Tee üblich und stellen keinen Mangel dar</li>
          <li>Auf der Plattform gezeigte Abbildungen können beispielhaft sein</li>
        </ul>
        <p>
          Solche geringfügigen Abweichungen, die die Funktion oder Qualität eines Produkts nicht
          wesentlich beeinträchtigen, stellen nicht zwangsläufig einen Mangel dar.
        </p>

        <h2>5. Gesundheits- und Wohlbefindenshinweis</h2>
        <p>
          SomnoBalance-Produkte sind darauf ausgelegt, Entspannung, Regeneration und allgemeines
          Wohlbefinden im Rahmen eines sinnlichen, ritualbasierten Ansatzes zur Ruhe zu
          unterstützen. Es handelt sich nicht um Medizinprodukte; sie sind nicht dazu bestimmt,
          Krankheiten oder gesundheitliche Beschwerden zu diagnostizieren, zu behandeln, zu
          heilen oder ihnen vorzubeugen. Bei bestehenden gesundheitlichen Beschwerden, in
          Schwangerschaft oder Stillzeit oder bei besonderen gesundheitlichen Anliegen —
          einschließlich möglicher Allergien gegen Inhaltsstoffe unserer Öle oder unseres Tees —
          konsultieren Sie bitte vor der Anwendung eine qualifizierte medizinische Fachperson.
          Angaben zu Inhaltsstoffen, Allergenen und Anwendung für verzehr- oder äußerlich
          anzuwendende Produkte (Öle, Tee) finden Sie auf der Produktverpackung und/oder den
          Produktseiten gemäß den geltenden lebensmittel- und kosmetikrechtlichen Vorgaben.
        </p>

        <h2>6. Preise</h2>
        <p>
          Alle auf der Plattform angezeigten Produktpreise können sich ohne vorherige
          Ankündigung ändern. Maßgeblich ist grundsätzlich der zum Zeitpunkt der Bestellung
          angezeigte Preis. Alle Preise verstehen sich in Euro und, sofern nicht anders
          angegeben, inklusive der gesetzlichen deutschen Umsatzsteuer (Mehrwertsteuer/USt.) zum
          jeweils geltenden Satz zzgl. Versandkosten; dieser Hinweis (&quot;inkl. MwSt., zzgl.
          Versandkosten&quot;) wird neben jedem Preis angezeigt. Für einzelne Produkte kann ein
          abweichender gesetzlicher Steuersatz gelten (z. B. der ermäßigte Steuersatz für
          bestimmte Lebensmittel wie unseren Regenerationstee). Der Checkout weist den
          Gesamtbetrag einschließlich aller Kosten aus, bevor die Bestellung abgeschlossen wird.
        </p>

        <h2>7. Bestellungen</h2>
        <p>
          Mit der Bestellung geben Sie ein Angebot zum Kauf der ausgewählten Produkte ab. Eine
          Bestellung gilt als angenommen, sobald SomnoBalance die Bestellung bestätigt oder mit
          deren Bearbeitung beginnt. Wir behalten uns vor, eine Bestellung unter anderem in
          folgenden Fällen zu stornieren: Nichtverfügbarkeit des Produkts; Preis- oder
          Angebotsfehler; Zahlungsprobleme; Verdacht auf betrügerische Aktivität; fehlerhafte
          Kundenangaben; Lieferbeschränkungen; oder Verstoß gegen diese AGB. Stornieren wir eine
          Bestellung, nachdem die Zahlung bereits eingegangen ist, wird der entsprechende Betrag
          über das jeweilige Zahlungsmittel erstattet.
        </p>

        <h2>8. Zahlung</h2>
        <p>
          Bestellungen sind mit den auf der Plattform angebotenen Zahlungsmethoden zu bezahlen.
          Sie verpflichten sich, zutreffende Rechnungs- und Zahlungsangaben bereitzustellen.
          SomnoBalance haftet nicht für Verzögerungen, die durch Störungen von
          Zahlungsdienstleistern, Bankennetzwerken oder sonstiger Zahlungsinfrastruktur Dritter
          verursacht werden.
        </p>

        <h2>9. Versand und Lieferung</h2>
        <p>
          Wir liefern derzeit ausschließlich innerhalb Deutschlands, versandt durch DHL. Ab
          einem Bestellwert von 59 € ist der Versand kostenfrei. Bestellungen werden an die im
          Bestellprozess angegebene Adresse versandt. Sperrige Artikel wie Matratzen können in
          mehreren Paketen mit jeweils eigener Sendungsnummer geliefert werden, die nicht
          zwingend am selben Tag eintreffen; bei Matratzen sind die Versandkosten bereits im
          Kaufpreis enthalten. Nähere Informationen finden Sie in unseren gesonderten{" "}
          <a href={`/${lang}/legal/shipping`}>Versand- und Lieferbedingungen</a>.
        </p>

        <h2>10. Widerrufsrecht für Verbraucher</h2>
        <p>
          Wenn Sie Verbraucher:in sind, steht Ihnen ein gesetzliches Recht zu, Ihren Vertrag
          innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen, vorbehaltlich der in
          unserer <a href={`/${lang}/legal/withdrawal`}>Widerrufsbelehrung</a> genannten
          Ausnahmen — etwa für bestimmte versiegelte Hygieneartikel, deren Siegel nach Lieferung
          entfernt wurde. Die vollständige Belehrung sowie das Muster-Widerrufsformular finden
          Sie in unserer gesonderten Widerrufsbelehrung, die Bestandteil dieser AGB ist. Dieses
          gesetzliche Recht gilt nicht für B2B-Kund:innen, die im Rahmen ihrer gewerblichen oder
          selbständigen beruflichen Tätigkeit handeln.
        </p>

        <h2>11. Stornierungen</h2>
        <p>
          Unabhängig vom oben beschriebenen gesetzlichen Widerrufsrecht können Sie eine
          Stornierung Ihrer Bestellung beantragen, bevor diese in Produktion oder Versand geht;
          Näheres regelt unsere{" "}
          <a href={`/${lang}/legal/cancellation`}>Stornierungsrichtlinie</a>. Für
          B2B-Sammelbestellungen oder Sonderanfertigungen werden die Stornierungsbedingungen im
          Rahmen der Bestellbestätigung oder des jeweiligen Partnervertrags festgelegt.
        </p>

        <h2>12. Rückgabe, Erstattung und gesetzliche Gewährleistung</h2>
        <p>
          Rückgaben und Erstattungen für beschädigte, mangelhafte, fehlerhaft hergestellte oder
          falsch gelieferte Produkte richten sich nach unserer{" "}
          <a href={`/${lang}/legal/returns`}>Rückgabe- und Erstattungsrichtlinie</a>. Unabhängig
          von dieser Richtlinie und vom gesetzlichen Widerrufsrecht steht Verbraucher:innen die
          gesetzliche Gewährleistung von zwei Jahren ab Lieferung für Mängel zu, die bereits bei
          Lieferung vorlagen, gemäß §§ 434 ff. BGB. Diese gesetzliche Gewährleistung wird durch
          unsere Rückgabe- und Erstattungsrichtlinie nicht eingeschränkt.
        </p>

        <h2>13. Geistiges Eigentum</h2>
        <p>
          Sämtliche Inhalte auf der Plattform — einschließlich Logos, Markennamen, Texten,
          Grafiken, Produktbildern, Layout, Design, Software und Videos — stehen, soweit nicht
          anders angegeben, im Eigentum von oder unter Lizenz für SomnoBalance /{" "}
          {business.ownerName}, handelnd unter der Bezeichnung &quot;Willing1863&quot;
          (Einzelunternehmen). Dies schließt den eingetragenen SomnoBalance-Schriftzug sowie das
          Lotus-Symbol ein. Eine Vervielfältigung, Kopie, Verbreitung, Bearbeitung oder
          kommerzielle Nutzung von Plattforminhalten ohne vorherige schriftliche Zustimmung ist
          nicht gestattet.
        </p>

        <h2>14. B2B- und Affiliate-Partner</h2>
        <p>
          Der Zugang zum B2B-Bereich und zum Partnerportal setzt eine Freigabe durch
          SomnoBalance sowie gegebenenfalls einen gesonderten Partner- oder Wiederverkäufervertrag
          voraus, der Preise, Provisionen, die zulässige Nutzung der Marke SomnoBalance sowie
          Vertraulichkeit regelt. Affiliate-Partner:innen dürfen SomnoBalance ausschließlich in
          einer Weise bewerben, die unserem Markenton entspricht — ruhig, vertrauensorientiert
          und niemals aufdringlich — und dürfen keine medizinischen oder unbelegten Aussagen über
          unsere Produkte treffen.
        </p>

        <h2>15. Untersagte Nutzung</h2>
        <p>Sie verpflichten sich, Folgendes zu unterlassen:</p>
        <ul>
          <li>Nutzung der Plattform zu rechtswidrigen Zwecken</li>
          <li>Versuch eines unbefugten Zugriffs auf die Plattform</li>
          <li>Eingriff in den Betrieb der Plattform</li>
          <li>Einschleusen schädlicher Software</li>
          <li>Kopieren von Plattforminhalten zu kommerziellen Zwecken</li>
          <li>Vortäuschen einer falschen Identität</li>
          <li>Nutzung der Plattform zur Begehung von Betrug</li>
          <li>Verletzung der Rechte Dritter</li>
        </ul>

        <h2>16. Haftungsbeschränkung</h2>
        <p>
          Wir haften unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder
          der Gesundheit, bei Vorsatz oder grober Fahrlässigkeit, bei arglistig verschwiegenen
          Mängeln sowie nach dem Produkthaftungsgesetz. Für die leicht fahrlässige Verletzung
          einer wesentlichen Vertragspflicht (Kardinalpflicht) — also einer Pflicht, deren
          Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und
          auf deren Einhaltung Sie regelmäßig vertrauen dürfen — ist unsere Haftung auf den
          vorhersehbaren, vertragstypischen Schaden begrenzt. Eine darüber hinausgehende Haftung
          ist, soweit gesetzlich zulässig, ausgeschlossen.
        </p>

        <h2>17. Höhere Gewalt</h2>
        <p>
          SomnoBalance haftet nicht für Verzögerungen oder die Nichterfüllung von Pflichten, die
          auf Umständen außerhalb unserer angemessenen Kontrolle beruhen, einschließlich
          Naturkatastrophen, behördlichen Einschränkungen, Streiks, Ausfällen von Internet oder
          Infrastruktur, Transportstörungen, Pandemien, Krieg, inneren Unruhen oder anderen
          unvorhersehbaren Ereignissen.
        </p>

        <h2>18. Anwendbares Recht und Gerichtsstand</h2>
        <p>
          Diese AGB unterliegen dem Recht der Bundesrepublik Deutschland unter Ausschluss des
          UN-Kaufrechts (CISG). Sind Sie Verbraucher:in mit gewöhnlichem Aufenthalt in einem
          anderen EU-/EWR-Mitgliedstaat, bleiben ungeachtet dieser Rechtswahl die zwingenden
          verbraucherschutzrechtlichen Bestimmungen dieses Staates anwendbar. Für
          B2B-Kund:innen ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem
          Vertrag Detmold, Deutschland, der Sitz von {business.ownerName}, handelnd unter der
          Bezeichnung &quot;Willing1863&quot; (Einzelunternehmen).
        </p>

        <h2>19. Änderungen dieser AGB</h2>
        <p>
          Wir können diese AGB von Zeit zu Zeit ändern. Die geänderten AGB werden auf der
          Plattform veröffentlicht. Die fortgesetzte Nutzung der Plattform nach Veröffentlichung
          der Änderungen gilt, soweit gesetzlich zulässig, als deren Annahme.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.terms.title} updated="4 September 2026">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern access to and use of the
        SomnoBalance Platform and the purchase of products and services from us, across our B2C
        store, our B2B access area and our affiliate programme. By accessing the Platform or
        placing an order, you agree to these Terms. If you do not agree with these Terms, please
        do not use the Platform.
      </p>

      <h2>1. About SomnoBalance</h2>
      <p>
        SomnoBalance is the regeneration and lifestyle brand of {business.ownerName}. He has
        personally been active in the field of sleep environments for more than 35 years. The
        business has been operating since {business.operatingSince}. Under the SomnoBalance brand,
        he offers curated products, including mattresses, pillows, oils, tea and ritual cards, as
        tools within a holistic system for regeneration, calm and quality of life. SomnoBalance is
        not simply a mattress or bedding retailer: our products, content and rituals are built
        around the four phases of the SomnoBalance system: Regulate · Let Go · Prepare ·
        Regenerate.
      </p>

      <h2>2. Scope and customer types</h2>
      <p>
        These Terms apply to three groups of users, each of which may be subject to additional
        provisions:
      </p>
      <ul>
        <li>B2C customers: consumers (Verbraucher) purchasing through our &quot;For me&quot; store for personal, non-business use</li>
        <li>B2B customers: businesses in the hospitality and health sector purchasing through our &quot;For my business&quot; area for trade or business purposes</li>
        <li>Affiliate partners: health professionals and other partners joining through &quot;Become a partner&quot;</li>
      </ul>
      <p>
        Certain protections described in these Terms, in particular the statutory right of
        withdrawal in Section 10, apply only to consumers and not to B2B customers acting in the
        course of their trade, business or profession. Affiliate partnerships are additionally
        governed by a separate partner agreement provided at onboarding; in the event of a
        conflict, that agreement prevails for the matters it expressly covers.
      </p>

      <h2>3. Eligibility</h2>
      <p>By using the Platform, you represent that:</p>
      <ul>
        <li>The information you provide is accurate and complete</li>
        <li>You are legally capable of entering into a binding transaction under applicable law</li>
        <li>You will use the Platform only for lawful purposes</li>
      </ul>

      <h2>4. Product information</h2>
      <p>
        We take reasonable care to ensure product descriptions, materials, dimensions, images and
        prices displayed on the Platform are accurate. However:
      </p>
      <ul>
        <li>Actual colours and textures may vary depending on your device display and on natural material variation</li>
        <li>Product appearance may vary slightly due to manufacturing processes and the natural or handcrafted nature of certain materials</li>
        <li>Batch-to-batch variation is normal for natural products such as oils and tea and does not constitute a defect</li>
        <li>Images shown on the Platform may be illustrative</li>
      </ul>
      <p>
        Such minor variations that do not materially affect a product&apos;s function or quality
        shall not necessarily constitute a defect.
      </p>

      <h2>5. Health &amp; wellness disclaimer</h2>
      <p>
        SomnoBalance products are designed to support relaxation, regeneration and general
        wellbeing as part of a sensory, ritual-based approach to rest. They are not medical devices
        and are not intended to diagnose, treat, cure or prevent any illness or medical condition.
        If you have a medical condition, are pregnant or breastfeeding, or have specific health
        concerns, including possible allergies to ingredients used in our oils or tea, please
        consult a qualified healthcare professional before use. Ingredient, allergen and usage
        information for consumable and topical products (oils, tea) is provided on the product
        packaging and/or product pages in accordance with applicable food-information and
        cosmetics regulations.
      </p>

      <h2>6. Prices</h2>
      <p>
        All product prices displayed on the Platform are subject to change without prior notice.
        The applicable price at the time of placing your order will generally apply to that order.
        All prices are shown in euros and, unless stated otherwise, include statutory German VAT
        (Mehrwertsteuer/USt.) at the applicable rate, plus shipping costs; this note (&quot;incl.
        VAT, plus shipping costs&quot;) is displayed next to every price. Individual products may
        be subject to a different statutory VAT rate (for example the reduced rate that may apply
        to certain food items such as our regeneration tea). The checkout displays the final total
        amount, including all costs, before the order is completed.
      </p>

      <h2>7. Orders</h2>
      <p>
        Placing an order constitutes a request to purchase the selected products. An order is
        considered accepted once SomnoBalance confirms the order or begins processing it. We
        reserve the right to cancel an order in circumstances including: product unavailability;
        pricing or listing errors; payment issues; suspected fraudulent activity; incorrect
        customer information; delivery restrictions; or violation of these Terms. If we cancel an
        order after payment has been received, the eligible amount will be refunded through the
        applicable payment method.
      </p>

      <h2>8. Payment</h2>
      <p>
        Orders must be paid using the payment methods offered on the Platform. You agree to
        provide accurate billing and payment information. SomnoBalance is not responsible for
        delays caused by payment-gateway failures, banking networks or other third-party payment
        infrastructure.
      </p>

      <h2>9. Shipping and delivery</h2>
      <p>
        We currently ship within Germany only, via DHL. Orders over €59 ship free of charge.
        Orders are shipped to the address provided at checkout. Bulky items
        such as mattresses may arrive in several parcels, each with its own tracking number, which
        may not all arrive on the same day; shipping costs for mattresses are always included in
        the purchase price. Please refer to our separate{" "}
        <a href={`/${lang}/legal/shipping`}>Shipping &amp; Delivery Policy</a> for further information.
      </p>

      <h2>10. Right of withdrawal for consumers</h2>
      <p>
        If you are a consumer, you have a statutory right to withdraw from your contract within 14
        days without giving reasons, subject to the exceptions set out in our{" "}
        <a href={`/${lang}/legal/withdrawal`}>Right of Withdrawal Policy</a>, for example for certain
        hygiene-sealed products once the seal has been removed after delivery. Please see that
        policy, which forms part of these Terms, for the full instructions and the model
        withdrawal form. This statutory right does not apply to B2B customers acting in the course
        of their trade, business or profession.
      </p>

      <h2>11. Cancellations</h2>
      <p>
        Separately from the statutory right of withdrawal described above, you may request to
        cancel an order before it enters production or dispatch, subject to our{" "}
        <a href={`/${lang}/legal/cancellation`}>Cancellation Policy</a>. For B2B bulk or made-to-order
        orders, cancellation terms will be confirmed as part of your order confirmation or partner
        agreement.
      </p>

      <h2>12. Returns, refunds and statutory warranty</h2>
      <p>
        Returns and refunds for damaged, defective, incorrectly manufactured or incorrectly
        supplied products are governed by our{" "}
        <a href={`/${lang}/legal/returns`}>Refund &amp; Return Policy</a>. Separately from that policy and
        from the statutory right of withdrawal, consumers benefit from the statutory warranty
        (Gewährleistung) of two years from delivery for defects that already existed at the time of
        delivery, in accordance with §§ 434 et seq. of the German Civil Code (BGB). This statutory
        warranty is not limited by our Refund &amp; Return Policy.
      </p>

      <h2>13. Intellectual property</h2>
      <p>
        All content on the Platform, including logos, brand names, text, graphics, product images,
        layout, design, software and video, is owned by or licensed to SomnoBalance /{" "}
        {business.ownerName}, trading as &quot;Willing1863&quot; (sole proprietorship /
        Einzelunternehmen) unless otherwise stated. This includes the registered SomnoBalance
        wordmark and lotus symbol. You may not reproduce, copy, distribute, modify or commercially
        exploit Platform content without prior written permission.
      </p>

      <h2>14. B2B and affiliate partners</h2>
      <p>
        Access to the B2B area and the affiliate portal is subject to approval by SomnoBalance and,
        where applicable, a separate partner or reseller agreement covering pricing, commission,
        permitted use of the SomnoBalance brand, and confidentiality. Affiliate partners may
        promote SomnoBalance only in a manner consistent with our brand tone — calm, trust-oriented
        and never pushy — and must not make medical or unsubstantiated claims about our products.
      </p>

      <h2>15. Prohibited use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Platform for unlawful purposes</li>
        <li>Attempt to gain unauthorised access to the Platform</li>
        <li>Interfere with the Platform&apos;s operation</li>
        <li>Introduce malicious software</li>
        <li>Copy Platform content for commercial purposes</li>
        <li>Misrepresent your identity</li>
        <li>Use the Platform to commit fraud</li>
        <li>Violate another person&apos;s rights</li>
      </ul>

      <h2>16. Limitation of liability</h2>
      <p>
        We are liable without limitation for damages arising from injury to life, body or health,
        for intentional or grossly negligent breaches of duty, for fraudulently concealed defects,
        and under the German Product Liability Act (Produkthaftungsgesetz). For the slightly
        negligent breach of a material contractual obligation (Kardinalpflicht) — an obligation
        whose fulfilment is essential to the proper performance of the contract and on which you
        may regularly rely — our liability is limited to the foreseeable, contract-typical damage.
        Liability beyond this is excluded, to the extent permitted by law.
      </p>

      <h2>17. Force majeure</h2>
      <p>
        SomnoBalance is not responsible for delays or failure to perform obligations caused by
        circumstances beyond our reasonable control, including natural disasters, governmental
        restrictions, strikes, internet or infrastructure failures, transportation disruptions,
        pandemics, war, civil unrest or other unforeseen events.
      </p>

      <h2>18. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by the laws of the Federal Republic of Germany, excluding the UN
        Convention on Contracts for the International Sale of Goods (CISG). If you are a consumer
        habitually resident in another EU/EEA member state, mandatory consumer-protection
        provisions of that country continue to apply, notwithstanding this choice of law. For B2B
        customers, the exclusive place of jurisdiction for disputes arising from this contract is
        Detmold, Germany, the registered place of business of {business.ownerName}, trading as
        &quot;Willing1863&quot; (sole proprietorship / Einzelunternehmen).
      </p>

      <h2>19. Changes to these Terms</h2>
      <p>
        We may modify these Terms from time to time. The revised Terms will be published on the
        Platform. Continued use of the Platform after changes are published constitutes acceptance
        of the revised Terms to the extent permitted by law.
      </p>
    </LegalPage>
  );
}
