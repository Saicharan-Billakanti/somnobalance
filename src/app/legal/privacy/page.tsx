import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Privacy Policy — SomnoBalance" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="2 September 2026">
      <p>
        This policy explains what personal data we collect on somnobalance.com, why, and what
        rights you have under the EU General Data Protection Regulation (GDPR / DSGVO).
      </p>

      <h2>1. Controller</h2>
      <p>
        {business.legalEntityName}
        <br />
        {business.addressLine1}
        <br />
        {business.addressLine2}
        <br />
        Email: {business.email}
      </p>

      <h2>2. Data we process</h2>
      <h3>Order and account data</h3>
      <p>
        When you place an order, we process your name, delivery and billing address, email,
        phone number, and order contents, in order to fulfil the contract (Art. 6(1)(b) GDPR).
      </p>
      <h3>Payment data</h3>
      <p>
        Payment is processed by our payment service provider. Card, SEPA, or PayPal details are
        transmitted directly to the provider and are not stored on our servers. See our checkout
        page for the providers offered.
      </p>
      <h3>Contact form and email</h3>
      <p>
        If you contact us, we process the information you provide (name, email, message) to
        respond to your enquiry (Art. 6(1)(b)/(f) GDPR).
      </p>
      <h3>Cookies and local storage</h3>
      <p>
        We use essential cookies/local storage to operate the shopping cart. With your consent, we
        also embed Spotify players for our ritual playlists; loading these sets third-party
        cookies from Spotify (see our <a href="/legal/cookies">Cookie Policy</a>). Non-essential
        embeds are blocked until you actively consent.
      </p>

      <h2>3. Third-party recipients</h2>
      <ul>
        <li>Payment service provider(s), to process transactions</li>
        <li>Delivery/logistics partner(s), to fulfil shipments</li>
        <li>Spotify, only if you consent to third-party embeds</li>
        <li>Hosting provider, to operate this website</li>
      </ul>
      <p>
        We do not sell personal data. Where a provider is located outside the EU/EEA, transfers
        take place only on the basis of an adequacy decision or appropriate safeguards (e.g.
        Standard Contractual Clauses) under Art. 44 et seq. GDPR.
      </p>

      <h2>4. Retention</h2>
      <p>
        We retain order and invoice data for the statutory retention periods under German
        commercial and tax law (currently up to 10 years for accounting records). Contact form
        data is deleted once your enquiry has been resolved, unless a longer retention obligation
        applies.
      </p>

      <h2>5. Your rights</h2>
      <p>
        You have the right to access, rectify, erase, or restrict processing of your data, to
        object to processing, and to data portability, under Art. 15–21 GDPR. You also have the
        right to lodge a complaint with a supervisory authority. To exercise these rights, contact
        us at {business.email}.
      </p>

      <h2>6. Security</h2>
      <p>
        This site is served over an encrypted (HTTPS) connection, and payment processing is
        handled by PCI-DSS compliant providers so that card data never touches our own servers.
      </p>
    </LegalPage>
  );
}
