import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Refund & Return Policy — SomnoBalance" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Refund & Return Policy" updated="4 September 2026">
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
        <a href="/legal/withdrawal">Right of Withdrawal Policy</a>), and (b) the statutory
        two-year warranty (Gewährleistung) for defects that existed at the time of delivery (see
        Section 12 of our <a href="/legal/terms">Terms &amp; Conditions</a>). Neither of those
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
        <a href="/legal/withdrawal">Right of Withdrawal Policy</a>. Actual crediting to your
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
