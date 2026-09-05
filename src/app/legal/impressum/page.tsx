import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Impressum — SomnoBalance" };

export default function ImpressumPage() {
  return (
    <LegalPage title="Legal Notice (Impressum)" updated="4 September 2026">
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
