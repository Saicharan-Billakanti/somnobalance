import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Privacy Policy — SomnoBalance" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="4 September 2026">
      <p>
        SomnoBalance, operated by {business.ownerName}, trading as &quot;Willing1863&quot; (sole
        proprietorship / Einzelunternehmen) (&quot;SomnoBalance&quot;, &quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;), respects your privacy and is committed to protecting the
        personal data you share with us across our website, our B2C store, our B2B access area and
        our affiliate portal at www.somnobalance.com (together, the &quot;Platform&quot;).
      </p>
      <p>
        This Privacy Policy explains, in line with the EU General Data Protection Regulation
        (&quot;GDPR&quot;) and applicable German data-protection law, what personal data we
        collect, why and on what legal basis we process it, when we may share it, how long we keep
        it, and the rights available to you. By using the Platform, you acknowledge that you have
        read and understood this Privacy Policy.
      </p>

      <h2>1. Data controller</h2>
      <p>
        The controller responsible for the processing described in this Policy is{" "}
        {business.ownerName}, trading as &quot;Willing1863&quot; (sole proprietorship /
        Einzelunternehmen), {business.addressLine1}, {business.addressLine2}. For questions about
        this Policy or about our use of your data, contact us at {business.email}. Full corporate
        details are set out in our{" "}
        <a href="/legal/impressum">Legal Notice (Impressum)</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>
        We may collect information you voluntarily provide when you browse the Platform, create
        an account, place an order, register for B2B or affiliate access, contact us, or otherwise
        interact with our services. This may include:
      </p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Mobile/telephone number</li>
        <li>Billing address</li>
        <li>Shipping/delivery address</li>
        <li>Account information</li>
        <li>Order and transaction details</li>
        <li>
          Sleep and product preferences you choose to share with us (for example firmness,
          materials or ritual preferences)
        </li>
        <li>For B2B customers: company name, business registration details, VAT ID and contact-person details</li>
        <li>
          For affiliate partners: professional qualification or credentials, business details and
          payment details for commission payments
        </li>
        <li>Information provided to our customer-support team</li>
        <li>Any other information you voluntarily provide</li>
      </ul>
      <p>
        We may also automatically collect technical information when you visit the Platform, such
        as IP address, browser type, device type, operating system, pages visited, referring URLs,
        approximate location, and Platform interaction data, generally via cookies and similar
        technologies (see Section 7).
      </p>

      <h2>3. Legal basis and purposes of processing</h2>
      <p>We process personal data for the following purposes and on the following legal bases under Art. 6(1) GDPR:</p>
      <ul>
        <li>To process and fulfil your orders, arrange shipping and delivery, and process payments — performance of a contract (Art. 6(1)(b) GDPR)</li>
        <li>To manage your B2B account or affiliate partnership, including onboarding, verification and commission payments — performance of a contract or pre-contractual measures (Art. 6(1)(b) GDPR)</li>
        <li>To respond to enquiries and provide customer support — Art. 6(1)(b) and Art. 6(1)(f) GDPR</li>
        <li>To send order- and service-related communications — performance of a contract (Art. 6(1)(b) GDPR)</li>
        <li>To send marketing communications such as our newsletter — your consent (Art. 6(1)(a) GDPR), which you may withdraw at any time</li>
        <li>To improve the Platform, prevent fraud and maintain security — our legitimate interests (Art. 6(1)(f) GDPR)</li>
        <li>To comply with legal, tax and accounting obligations — Art. 6(1)(c) GDPR</li>
      </ul>

      <h2>4. Payment information</h2>
      <p>
        Payments may be processed through our third-party payment provider, Stripe. SomnoBalance
        does not intentionally store complete card numbers, CVV codes or banking passwords on its
        own servers. Payment data is processed by Stripe in accordance with its own security and
        privacy practices and, where relevant, PCI-DSS standards.
      </p>

      <h2>5. Sharing of information</h2>
      <p>We do not sell your personal data. We may share necessary information with trusted service providers, including:</p>
      <ul>
        <li>Payment providers</li>
        <li>Courier and logistics companies (including specialist carriers for bulky goods such as mattresses)</li>
        <li>Website hosting and IT providers</li>
        <li>Analytics providers</li>
        <li>Customer-support providers</li>
        <li>Affiliate-tracking and commission-payment providers</li>
        <li>Email and marketing service providers, where applicable</li>
        <li>Professional advisers (legal, tax, audit)</li>
        <li>Government or law-enforcement authorities, where legally required</li>
      </ul>
      <p>
        For example, your name, phone number and delivery address may be shared with a courier
        partner to fulfil your order. Where a service provider is located outside the European
        Economic Area, we rely on appropriate safeguards such as EU Standard Contractual Clauses
        or an applicable adequacy decision; details are available on request.
      </p>

      <h2>6. Embedded Spotify players</h2>
      <p>
        Our Platform uses Spotify&apos;s official embedding tool to offer curated music for each
        phase of the SomnoBalance ritual (Regulate · Let Go · Prepare · Regenerate). No separate
        music licence is required on our side, as the licence for the streamed content remains
        with Spotify. When a Spotify player is loaded, Spotify may set its own cookies and process
        technical and usage data in accordance with Spotify&apos;s own privacy policy. Where
        required by law, Spotify players are only loaded after you have given consent through our
        consent tool, or only after you actively click to play.
      </p>

      <h2>7. Cookies and similar technologies</h2>
      <p>
        We use cookies and similar technologies to enable essential Platform functions, remember
        your preferences, maintain shopping-cart information, and — subject to your consent — to
        analyse traffic, improve marketing performance and load embedded content such as the
        Spotify players described above.
      </p>
      <p>
        In line with the German Telecommunications-Digital Services Data Protection Act (TDDDG,
        formerly TTDSG) and applicable ePrivacy rules, we ask for your consent before setting
        non-essential cookies, through the consent banner shown on your first visit. You may
        withdraw or change your consent at any time via our{" "}
        <a href="/legal/cookies">Cookie Policy</a> or your browser settings. Disabling essential
        cookies may affect Platform functionality.
      </p>

      <h2>8. Marketing communications</h2>
      <p>
        Where you have given consent, for example via double opt-in for our newsletter or where
        otherwise permitted by law, we may contact you about new products, rituals, offers and
        other SomnoBalance content. You may withdraw consent at any time via the unsubscribe link
        in each communication or by contacting us. Transactional communications relating to your
        order, payment, delivery, returns or support will still be sent when necessary.
      </p>

      <h2>9. Data security</h2>
      <p>
        We take reasonable technical and organisational measures to protect personal data against
        unauthorised access, misuse, loss, alteration or disclosure. However, no Internet
        transmission or electronic storage system can be guaranteed to be completely secure.
      </p>

      <h2>10. Data retention</h2>
      <p>
        We retain personal data only as long as reasonably necessary for the purposes described
        above, including statutory retention obligations under German commercial and tax law (for
        example § 257 HGB and § 147 AO), which generally require certain business records to be
        kept for six to ten years. Where data is no longer required, we delete or anonymise it,
        subject to these statutory retention periods.
      </p>

      <h2>11. International transfers</h2>
      <p>
        Where we or our service providers transfer personal data outside the European Economic
        Area, for example in connection with certain hosting, analytics or music-embedding
        providers, we rely on appropriate safeguards such as EU Standard Contractual Clauses or an
        applicable adequacy decision. You may request further details by contacting us.
      </p>

      <h2>12. Third-party websites</h2>
      <p>
        The Platform may contain links to third-party websites or services. SomnoBalance is not
        responsible for the privacy practices or content of third-party websites. We encourage you
        to review their privacy policies before providing personal data.
      </p>

      <h2>13. Your rights under the GDPR</h2>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>Request access to the personal data we hold about you (Art. 15 GDPR)</li>
        <li>Request correction of inaccurate data (Art. 16 GDPR)</li>
        <li>Request erasure, where legally permissible (Art. 17 GDPR)</li>
        <li>Request restriction of processing (Art. 18 GDPR)</li>
        <li>Request a portable copy of the data you provided to us (Art. 20 GDPR)</li>
        <li>Object to processing based on legitimate interests or direct marketing (Art. 21 GDPR)</li>
        <li>Withdraw consent at any time, without affecting the lawfulness of processing before withdrawal (Art. 7(3) GDPR)</li>
      </ul>
      <p>
        The authority responsible for us is the {business.supervisoryAuthority}. We may request
        reasonable verification of your identity before processing certain requests.
      </p>

      <h2>14. Children&apos;s privacy</h2>
      <p>
        The Platform is intended for adults and is not directed at children. If you believe a
        child has provided personal data to us without appropriate parental consent, please
        contact us so that we can address it.
      </p>

      <h2>15. Policy changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be published
        on this page with a revised &quot;Last Updated&quot; date.
      </p>
    </LegalPage>
  );
}
