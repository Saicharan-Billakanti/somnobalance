import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Impressum — SomnoBalance" };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" updated="2 September 2026">
      <p>Information according to § 5 TMG (German Telemedia Act):</p>

      <h2>Operator</h2>
      <p>
        {business.legalEntityName}
        <br />
        {business.addressLine1}
        <br />
        {business.addressLine2}
      </p>

      <h2>Represented by</h2>
      <p>{business.managingDirector}, Managing Director</p>

      <h2>Contact</h2>
      <p>
        Phone: {business.phone}
        <br />
        Email: {business.email}
      </p>

      <h2>Register entry</h2>
      <p>
        Registration court: {business.registerCourt}
        <br />
        Registration number: {business.registerNumber}
      </p>

      <h2>VAT identification number</h2>
      <p>
        VAT ID according to § 27a of the German VAT Act (UStG): {business.vatId}
      </p>

      <h2>Brand</h2>
      <p>
        SomnoBalance is the trading name and brand under which {business.legalEntityName} offers
        its products and services. {business.legalEntityName} has developed sleep-environment
        products for over 35 years and operates in the background of the SomnoBalance brand.
      </p>

      <h2>Responsible for content according to § 18 (2) MStV</h2>
      <p>{business.managingDirector}, address as above.</p>

      <h2>EU dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Our email address can be found above. We are not obliged and generally not willing to
        participate in dispute resolution proceedings before a consumer arbitration board.
      </p>

      <h2>Liability for content</h2>
      <p>
        As a service provider, we are responsible for our own content on these pages in accordance
        with general law. We are, however, not obliged to monitor transmitted or stored
        third-party information, or to investigate circumstances that indicate illegal activity.
      </p>
    </LegalPage>
  );
}
