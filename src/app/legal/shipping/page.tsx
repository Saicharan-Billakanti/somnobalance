import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Shipping & Delivery — SomnoBalance" };

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy" updated="2 September 2026">
      <h2>Delivery areas</h2>
      <p>
        We currently ship to Germany, Austria, Switzerland, and the rest of the European Union.
        Delivery partner integration is in progress — see the note below.
      </p>

      <h2>Delivery timeframes</h2>
      <ul>
        <li>Germany: 2–5 business days from dispatch</li>
        <li>Austria &amp; Switzerland: 4–8 business days from dispatch</li>
        <li>Rest of EU: 5–10 business days from dispatch</li>
      </ul>
      <p>
        Orders are dispatched within 1–2 business days of payment confirmation, Monday to Friday,
        excluding public holidays.
      </p>

      <h2>Shipping costs</h2>
      <p>
        A flat shipping rate is shown at checkout before you place your order. We may offer free
        shipping above a minimum order value; any such threshold will be shown at checkout.
      </p>

      <h2>Carriers</h2>
      <p>
        Shipments are handled by our delivery partner(s) (e.g. DHL, DPD, or an equivalent carrier
        — {business.supportEmail} can confirm the current carrier for your order). Tracking
        information is provided by email once your order is dispatched.
      </p>

      <h2>Packaging</h2>
      <p>
        Products are shipped in recyclable packaging suited to their fragility — mattresses and
        pillows are compressed and boxed; oils, tea, and cards are shipped in padded mailers.
      </p>

      <h2>Failed or delayed deliveries</h2>
      <p>
        If a delivery is delayed beyond the timeframes above or marked as delivered but not
        received, contact {business.supportEmail} with your order number and we will investigate
        with the carrier.
      </p>
    </LegalPage>
  );
}
