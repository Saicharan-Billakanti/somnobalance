import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Shipping & Delivery — SomnoBalance" };

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy" updated="4 September 2026">
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
        <a href="/legal/returns">Refund &amp; Return Policy</a>.
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
