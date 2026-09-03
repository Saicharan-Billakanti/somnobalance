import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Terms & Conditions — SomnoBalance" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions (AGB)" updated="2 September 2026">
      <h2>1. Scope and contracting party</h2>
      <p>
        These Terms & Conditions apply to all orders placed through somnobalance.com. The
        contracting party is {business.legalEntityName}, {business.addressLine1},{" "}
        {business.addressLine2}, trading under the brand SomnoBalance. These Terms apply to
        consumers and, where applicable, business customers under our B2B and partner programmes.
      </p>

      <h2>2. Conclusion of contract</h2>
      <p>
        Product listings on this site are a non-binding invitation to order. By clicking &quot;Place
        order&quot;, you submit a binding offer to purchase. A contract is formed once we confirm
        acceptance of your order by email or by dispatching the goods.
      </p>

      <h2>3. Prices and payment</h2>
      <p>
        All prices are shown in Euro and include statutory German VAT (MwSt.). Shipping costs are
        shown separately during checkout before you place your order. Accepted payment methods are
        displayed at checkout (e.g. card, SEPA Direct Debit, PayPal) and may vary by country.
        Payment is due at the time of ordering unless otherwise agreed.
      </p>

      <h2>4. Delivery</h2>
      <p>
        Delivery timeframes and areas are set out in our{" "}
        <a href="/legal/shipping">Shipping & Delivery Policy</a>. Risk of accidental loss or
        damage passes to a consumer upon delivery of the goods.
      </p>

      <h2>5. Right of withdrawal</h2>
      <p>
        Consumers in the EU have a statutory 14-day right of withdrawal. Full details, exceptions,
        and a sample withdrawal form are set out in our{" "}
        <a href="/legal/returns">Returns & Withdrawal Policy</a>.
      </p>

      <h2>6. Retention of title</h2>
      <p>Delivered goods remain our property until paid for in full.</p>

      <h2>7. Warranty</h2>
      <p>
        Statutory warranty rights apply. If goods are defective, please contact us at{" "}
        {business.supportEmail} before returning them, so we can advise on the best process.
      </p>

      <h2>8. B2B and affiliate terms</h2>
      <p>
        Business customers (hospitality, health-sector partners) and affiliate partners operate
        under separate wholesale or partnership agreements, made available on request via our{" "}
        <a href="/contact">contact page</a>. Where these Terms conflict with a signed partner
        agreement, the partner agreement takes precedence for that relationship.
      </p>

      <h2>9. Dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR) at{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . We are not obliged and generally not willing to participate in proceedings before a
        consumer arbitration board.
      </p>

      <h2>10. Governing law</h2>
      <p>
        German law applies, excluding the UN Convention on Contracts for the International Sale of
        Goods (CISG), without prejudice to mandatory consumer-protection provisions of your
        country of residence.
      </p>
    </LegalPage>
  );
}
