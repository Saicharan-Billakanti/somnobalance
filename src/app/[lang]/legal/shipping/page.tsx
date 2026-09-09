import { LegalPage } from "@/components/LegalPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Shipping & Delivery — SomnoBalance" };

export default async function ShippingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.shipping.title} updated="4. September 2026">
        <p>
          Diese Versand- und Lieferbedingungen erläutern, wie SomnoBalance über
          www.somnobalance.com aufgegebene Bestellungen bearbeitet und ausliefert. Wir liefern
          derzeit ausschließlich innerhalb Deutschlands. Versandpartner ist DHL, auch für
          Matratzen. Ab einem Bestellwert von 59 € ist der Versand kostenfrei; bei Matratzen sind
          die Versandkosten stets im Kaufpreis enthalten, eine gesonderte
          Versandkostenberechnung entfällt.
        </p>

        <h2>1. Bearbeitung der Bestellung</h2>
        <p>
          Sobald Ihre Bestellung erfolgreich aufgegeben und die Zahlung bestätigt wurde, beginnen
          wir mit der Bearbeitung. Die Ritual-Produkte (Roll-on, Ölmischung, Raumspray,
          Regenerationstee), das Regenerationskarten-Set, das Nackenstützkissen sowie das
          Starter-Set sind vorrätig und werden umgehend versandt. Matratzen werden erst nach
          Bestellung in der gewählten Härteversion individuell gefertigt; die Fertigungs- und
          Lieferzeit beträgt hierfür in der Regel etwa 3–4 Wochen. Diese längere Lieferzeit wird
          deutlich auf der Produktseite und im Warenkorb ausgewiesen.
        </p>

        <h2>2. Lieferzeit</h2>
        <p>
          Nach Versand der vorrätigen Standardartikel dauert die DHL-Lieferung innerhalb
          Deutschlands in der Regel etwa 1–3 Werktage. Matratzen werden nach Abschluss der
          Fertigung versandt und treffen anschließend über DHL ein; Matratzen ab 160 × 200 cm
          werden dabei als 3 bis 4 separate Pakete verschickt, die jeweils eine eigene
          Sendungsnummer erhalten und nicht zwingend am selben Tag zugestellt werden.
          Lieferzeiten sind Schätzungen und, sofern nicht ausdrücklich anders angegeben, nicht
          garantiert.
        </p>

        <h2>3. Versandkosten</h2>
        <p>
          Ab einem Bestellwert von 59 € ist der Versand kostenfrei. Unterhalb dieses Werts werden
          Versandkosten, soweit anwendbar, vor Abschluss Ihrer Bestellung im Bestellprozess
          ausgewiesen; der im Checkout angezeigte Gesamtbetrag umfasst stets alle Kosten. Bei
          Matratzen sind die Versandkosten unabhängig vom Bestellwert bereits im angegebenen
          Kaufpreis enthalten. Soweit Versandkosten anfallen, können sie abhängen von:
        </p>
        <ul>
          <li>Größe und Gewicht des Produkts</li>
          <li>Menge</li>
          <li>Lieferort</li>
          <li>gewähltem Versandservice</li>
        </ul>

        <h2>4. Lieferadresse</h2>
        <p>Sie sind dafür verantwortlich, eine zutreffende und vollständige Lieferadresse anzugeben. Bitte prüfen Sie sorgfältig:</p>
        <ul>
          <li>Name</li>
          <li>Haus-/Wohnungsnummer und Straße</li>
          <li>PLZ und Ort</li>
          <li>Mobilnummer</li>
        </ul>
        <p>
          SomnoBalance haftet nicht für Verzögerungen oder zusätzliche Kosten, die durch
          fehlerhafte oder unvollständige Adressangaben des Kunden verursacht werden.
        </p>

        <h2>5. Lieferung von Matratzen, Kissen und anderen sperrigen Artikeln</h2>
        <p>
          Matratzen werden für den Versand komprimiert, gerollt oder vakuumverpackt und durch
          DHL geliefert. Matratzen ab einer Breite von 160 cm (160 × 200 cm und größer) werden
          als 3 bis 4 separate Pakete versandt; jedes Paket erhält eine eigene
          DHL-Sendungsnummer, und die Pakete können an unterschiedlichen Tagen eintreffen. Bitte
          geben Sie dem Produkt nach dem Auspacken bis zu 48–72 Stunden Zeit, um sich vollständig
          zu entfalten und seine endgültige Form und Härte anzunehmen. Unmittelbar nach dem
          Auspacken kann ein leichter Geruch wahrnehmbar sein; dies ist bei neu verpackten
          Schlafprodukten üblich und verfliegt in der Regel innerhalb weniger Tage bei
          ausreichender Belüftung des Raums.
        </p>

        <h2>6. Sendungsverfolgung</h2>
        <p>
          Sobald Ihre Bestellung versandt wurde, senden wir Ihnen die
          DHL-Sendungsverfolgungsnummer automatisch per E-Mail zu. Bei mehrteiligen
          Matratzenlieferungen erhalten Sie sämtliche Sendungsnummern für die einzelnen Pakete
          derselben Bestellung.
        </p>

        <h2>7. Zustellversuche</h2>
        <p>
          Kurierpartner können je nach eigenen Richtlinien mehrere Zustellversuche unternehmen.
          Scheitert die Zustellung, weil die empfangende Person nicht erreichbar ist, die
          Adresse fehlerhaft ist, die Annahme verweigert wird oder der Kunde nicht auf die
          Sendung reagiert bzw. sie nicht entgegennimmt, können zusätzliche Versand- oder
          Zustellgebühren anfallen, soweit gesetzlich zulässig.
        </p>

        <h2>8. Beschädigte Pakete</h2>
        <p>Wir empfehlen dringend, das Paket bei Lieferung zu überprüfen. Wirkt das Paket sichtbar beschädigt, gehen Sie bitte wie folgt vor:</p>
        <ul>
          <li>Fotografieren oder filmen Sie das Paket, bevor Sie es öffnen</li>
          <li>Halten Sie den Zustand der äußeren Verpackung fest</li>
          <li>Öffnen Sie das Paket vorsichtig</li>
          <li>Fertigen Sie deutliche Fotos oder ein Video von Produkt und Verpackung an</li>
          <li>Kontaktieren Sie SomnoBalance so bald wie möglich</li>
        </ul>
        <p>
          Transportschäden sollten möglichst innerhalb von 48 Stunden nach Lieferung gemeldet
          werden. Eine verspätete Meldung kann die Klärung erschweren.
        </p>

        <h2>9. Falsches oder fehlendes Produkt</h2>
        <p>
          Erhalten Sie ein falsches Produkt, fehlt ein Artikel oder weicht das Produkt wesentlich
          von der Bestellung ab, kontaktieren Sie uns bitte umgehend mit Ihrer Bestellnummer
          sowie entsprechenden Fotos oder Videos. Wir prüfen den Fall und bieten, sofern
          SomnoBalance den Fehler zu vertreten hat, eine angemessene Lösung gemäß unserer{" "}
          <a href={`/${lang}/legal/returns`}>Rückgabe- und Erstattungsrichtlinie</a> an.
        </p>

        <h2>10. Lieferverzögerungen</h2>
        <p>
          SomnoBalance haftet nicht für Verzögerungen, die durch Kurierunternehmen Dritter oder
          Umstände außerhalb unserer angemessenen Kontrolle verursacht werden, etwa extreme
          Wetterlagen, Naturkatastrophen, Streiks, behördliche Einschränkungen,
          Transportstörungen, Feiertage, fehlerhafte Adressen, Zustellprobleme in entlegenen
          Gebieten oder sonstige logistische Störungen. Wir unterstützen Sie jedoch im Rahmen
          des Zumutbaren bei der Verfolgung und Klärung verzögerter Sendungen.
        </p>

        <h2>11. Versand außerhalb Deutschlands</h2>
        <p>Wir liefern derzeit ausschließlich innerhalb Deutschlands. Lieferungen außerhalb Deutschlands werden derzeit nicht angeboten.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.shipping.title} updated="4 September 2026">
      <p>
        This Shipping &amp; Delivery Policy explains how SomnoBalance processes and delivers
        orders placed through www.somnobalance.com. We currently ship within Germany only. Our
        shipping partner is DHL, including for mattresses. Orders over €59 ship free of charge;
        for mattresses, shipping costs are always included in the purchase price, so no separate
        shipping calculation applies.
      </p>

      <h2>1. Order processing</h2>
      <p>
        Once your order is successfully placed and payment is confirmed, we begin processing it.
        The Ritual collection products (roll-on, oil blend, room spray, regeneration tea), the
        regeneration card set, the neck support pillow and the starter set are in stock and ship
        immediately. Mattresses are manufactured to order in the selected firmness after your
        order is placed; manufacturing and delivery for mattresses generally takes approximately
        3–4 weeks. This longer lead time is clearly shown on the product page and in the cart.
      </p>

      <h2>2. Delivery time</h2>
      <p>
        After an in-stock standard item is dispatched, DHL delivery within Germany generally takes
        approximately 1–3 business days. Mattresses are shipped once the approximately 3–4 week
        manufacturing period is complete and are then delivered via DHL; mattresses from
        160 × 200 cm ship as 3 to 4 separate parcels, each with its own tracking number, which may
        not arrive on the same day. Delivery timelines are estimates and are not guaranteed unless
        expressly stated otherwise.
      </p>

      <h2>3. Shipping charges</h2>
      <p>
        Orders over €59 ship free of charge. Below this amount, shipping charges, where
        applicable, will be displayed at checkout before you complete your purchase, and the total
        shown at checkout always includes all costs. For mattresses, shipping costs are already
        included in the stated purchase price regardless of order value. Where shipping charges
        apply, they may vary based on:
      </p>
      <ul>
        <li>Product size and weight</li>
        <li>Quantity</li>
        <li>Delivery location</li>
        <li>Shipping service selected</li>
      </ul>

      <h2>4. Delivery address</h2>
      <p>You are responsible for providing an accurate and complete delivery address. Please carefully verify:</p>
      <ul>
        <li>Name</li>
        <li>House/flat number and street</li>
        <li>Postal code and city</li>
        <li>Mobile number</li>
      </ul>
      <p>
        SomnoBalance will not be responsible for delays or additional costs caused by incorrect or
        incomplete address information supplied by the customer.
      </p>

      <h2>5. Delivery of mattresses, pillows and other bulky items</h2>
      <p>
        Mattresses are compressed, rolled or vacuum-packed for delivery and shipped via DHL.
        Mattresses from 160 × 200 cm and wider ship as 3 to 4 separate parcels; each parcel
        receives its own DHL tracking number, and the parcels may not all arrive on the same day.
        After unpacking, please allow the product up to 48–72 hours to fully expand and settle into
        its final shape and firmness. A mild odour may be noticeable immediately after unpacking;
        this is generally normal for newly packed sleep products and typically dissipates within a
        few days as the room is ventilated.
      </p>

      <h2>6. Tracking</h2>
      <p>
        Once your order is dispatched, we automatically send you the DHL tracking number by email.
        For multi-parcel mattress deliveries, you will receive all tracking numbers for the
        individual parcels belonging to the same order.
      </p>

      <h2>7. Delivery attempts</h2>
      <p>
        Courier partners may make multiple delivery attempts depending on their own policies. If
        delivery fails because the recipient is unavailable, the address is incorrect, the
        recipient refuses delivery, or the customer does not respond to or accept the shipment,
        additional shipping or re-delivery charges may apply where permitted.
      </p>

      <h2>8. Damaged packages</h2>
      <p>We strongly recommend inspecting the package at the time of delivery. If the package appears visibly damaged, please:</p>
      <ul>
        <li>Take photographs or a video of the package before opening it</li>
        <li>Record the condition of the outer packaging</li>
        <li>Open the package carefully</li>
        <li>Take clear photographs or a video of the product and packaging</li>
        <li>Contact SomnoBalance as soon as reasonably possible</li>
      </ul>
      <p>
        Claims relating to transit damage should preferably be reported within 48 hours of
        delivery. Failure to report damage promptly may make investigation or resolution more
        difficult.
      </p>

      <h2>9. Wrong or missing product</h2>
      <p>
        If you receive the wrong product, a missing item, or a product that is materially
        different from what was ordered, please contact us promptly with your order number and
        supporting photographs or video. We will investigate and, where the issue is attributable
        to SomnoBalance, provide an appropriate resolution in accordance with our{" "}
        <a href={`/${lang}/legal/returns`}>Refund &amp; Return Policy</a>.
      </p>

      <h2>10. Delivery delays</h2>
      <p>
        SomnoBalance is not responsible for delays caused by third-party courier companies or
        circumstances outside our reasonable control, including extreme weather, natural
        disasters, strikes, government restrictions, transportation disruptions, public holidays,
        incorrect addresses, remote-area delivery issues or other logistics disruptions. We will,
        however, make reasonable efforts to assist you in tracking and resolving delayed
        shipments.
      </p>

      <h2>11. Shipping outside Germany</h2>
      <p>We currently ship within Germany only. Deliveries outside Germany are not currently offered.</p>
    </LegalPage>
  );
}
