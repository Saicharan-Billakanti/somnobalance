import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Impressum — SomnoBalance" };

export default async function ImpressumPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.impressum.title} updated="4. September 2026">
        <p>
          Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag
          (MStV).
        </p>

        <h2>1. Betreiber dieser Plattform</h2>
        <p>
          SomnoBalance, die Website, der B2C-Shop, der B2B-Zugangsbereich und das Partnerportal
          unter www.somnobalance.com (zusammen die &quot;Plattform&quot;), wird betrieben von:
        </p>
        <p>
          {business.ownerName}, handelnd unter der Bezeichnung &quot;Willing1863&quot;
          (Einzelunternehmen)
          <br />
          {business.addressLine1}
          <br />
          {business.addressLine2}
          <br />
          Inhaber: {business.ownerName}
        </p>

        <h2>2. Kontakt</h2>
        <p>
          Telefon: {business.phone}
          <br />
          E-Mail: {business.email}
        </p>

        <h2>3. Register- und Steuerangaben</h2>
        <p>
          Handelsregister: Als Einzelunternehmen besteht grundsätzlich keine Pflicht zur
          Eintragung ins Handelsregister.
          <br />
          Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {business.vatId}
        </p>

        <h2>4. Verantwortlich für redaktionelle Inhalte</h2>
        <p>
          Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV (z. B.
          magazinartige Beiträge, Gastbeiträge von Gesundheitsfachkräften und weitere
          Wissensinhalte unter der Marke SomnoBalance): {business.ownerName}, handelnd unter der
          Bezeichnung &quot;Willing1863&quot; (Einzelunternehmen), Anschrift wie unter Ziffer 1.
        </p>

        <h2>5. Verhältnis zwischen SomnoBalance und Willing1863</h2>
        <p>
          SomnoBalance ist die kundenzugewandte Marke. {business.ownerName} ist persönlich seit
          über 35 Jahren im Bereich Schlafumgebungen tätig. Das Unternehmen besteht seit{" "}
          {business.operatingSince}. Unter der Marke SomnoBalance bietet er Regenerations- und
          Lifestyle-Produkte und -Leistungen an. Willing1863 wird auf dieser Seite ausschließlich
          zu Zwecken der gesetzlich vorgeschriebenen Anbieterkennzeichnung genannt. Die gesamte
          Kommunikation mit Kund:innen, Bestellungen, der Support sowie Partner- und
          Affiliate-Aktivitäten erfolgen unter dem Namen SomnoBalance.
        </p>

        <h2>6. Haftung für Inhalte und Links</h2>
        <p>
          Als Diensteanbieter sind wir gemäß den allgemeinen Gesetzen für eigene Inhalte auf
          dieser Plattform verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die
          auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder
          Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben unberührt.
        </p>
        <p>
          Diese Plattform kann Links zu externen Websites Dritter enthalten, auf deren Inhalte
          wir keinen Einfluss haben. Für diese fremden Inhalte können wir daher keine Gewähr
          übernehmen; für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
          Betreiber der Seite verantwortlich.
        </p>

        <h2>EU-Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben. Wir sind nicht verpflichtet und grundsätzlich
          nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.impressum.title} updated="4 September 2026">
      <p>
        Information pursuant to § 5 of the German Digital Services Act (Digitale-Dienste-Gesetz,
        &quot;DDG&quot;) and § 18(2) of the Interstate Media Treaty (Medienstaatsvertrag,
        &quot;MStV&quot;).
      </p>

      <h2>1. Operator of this platform</h2>
      <p>
        SomnoBalance, the website, B2C store, B2B access area and affiliate portal available at
        www.somnobalance.com (together, the &quot;Platform&quot;), is operated by:
      </p>
      <p>
        {business.ownerName}, trading as &quot;Willing1863&quot; (sole proprietorship /
        Einzelunternehmen)
        <br />
        {business.addressLine1}
        <br />
        {business.addressLine2}
        <br />
        Owner: {business.ownerName}
      </p>

      <h2>2. Contact</h2>
      <p>
        Phone: {business.phone}
        <br />
        Email: {business.email}
      </p>

      <h2>3. Registration and tax details</h2>
      <p>
        Commercial Register: {business.registerNote}
        <br />
        VAT Identification Number pursuant to § 27a of the German VAT Act (UStG): {business.vatId}
      </p>

      <h2>4. Responsible for editorial content</h2>
      <p>
        Responsible for journalistic and editorial content pursuant to § 18(2) MStV (for example
        magazine-style articles, guest contributions from health professionals and other
        knowledge content published under the SomnoBalance brand): {business.ownerName}, trading
        as &quot;Willing1863&quot; (sole proprietorship / Einzelunternehmen), address as set out in
        Section 1 above.
      </p>

      <h2>5. Relationship between SomnoBalance and Willing1863</h2>
      <p>
        SomnoBalance is the customer-facing brand. {business.ownerName} has personally been active
        in the field of sleep environments for more than 35 years. The business has been operating
        since {business.operatingSince}. Under the SomnoBalance brand, he presents his
        regeneration and lifestyle products and services. Willing1863 is named on this page for
        legal-disclosure purposes only. All customer-facing communication, ordering, support,
        partner and affiliate activity takes place under the SomnoBalance name.
      </p>

      <h2>6. Liability for content and links</h2>
      <p>
        As a service provider, we are responsible for our own content on this Platform in
        accordance with general law. We are not, however, obliged to monitor transmitted or stored
        third-party information or to investigate circumstances indicating illegal activity.
        Obligations to remove or block the use of information under general law remain unaffected.
      </p>
      <p>
        This Platform may contain links to external websites operated by third parties, over whose
        content we have no influence. We therefore cannot accept any liability for such external
        content; the respective provider or operator of the linked page is always responsible for
        its content.
      </p>

      <h2>EU dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Our email address can be found above. We are not obliged and generally not willing to
        participate in dispute resolution proceedings before a consumer arbitration board.
      </p>
    </LegalPage>
  );
}
