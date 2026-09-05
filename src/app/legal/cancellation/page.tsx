import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Cancellation Policy — SomnoBalance" };

export default function CancellationPage() {
  return (
    <LegalPage title="Cancellation Policy" updated="4 September 2026">
      <p>
        This Cancellation Policy applies to orders placed through www.somnobalance.com and
        describes how you may request to cancel an order before it is dispatched. It is separate
        from, and does not limit, the statutory right of withdrawal available to consumers under
        our <a href="/legal/withdrawal">Right of Withdrawal Policy</a>.
      </p>

      <h2>1. Cancellation requests</h2>
      <p>
        You may request cancellation by contacting SomnoBalance as soon as possible after placing
        an order. Cancellation is subject to the current processing status of the order.
      </p>

      <h2>2. Standard products</h2>
      <p>
        For standard, in-stock products, cancellation requests may generally be accepted if the
        order has not yet been dispatched. Once an order has been dispatched, cancellation may no
        longer be possible through this process.
      </p>

      <h2>3. Bulk, made-to-order or B2B orders</h2>
      <p>
        For B2B bulk orders or orders produced or sourced specifically for a business customer,
        cancellation may not be possible once production or procurement has commenced.
        Cancellation terms for such orders will be confirmed as part of the order confirmation or
        the applicable partner agreement. This includes mattresses, which are manufactured to
        order.
      </p>

      <h2>4. Cancellation before dispatch</h2>
      <p>
        If an eligible cancellation request is received before dispatch, SomnoBalance will cancel
        the order and initiate an eligible refund. Refund processing times may depend on the
        payment provider and your bank.
      </p>

      <h2>5. Cancellation after dispatch</h2>
      <p>
        Once an order has been dispatched, it generally cannot be cancelled through this process.
        If you no longer require the product, please see our{" "}
        <a href="/legal/withdrawal">Right of Withdrawal Policy</a> (for consumers) or contact us
        regarding the applicable return process.
      </p>

      <h2>6. Order cancellation by SomnoBalance</h2>
      <p>
        SomnoBalance may cancel an order in circumstances including product unavailability,
        incorrect pricing or product information, payment failure, suspected fraudulent activity,
        incorrect or unverifiable customer information, delivery restrictions, technical errors,
        or a violation of our <a href="/legal/terms">Terms &amp; Conditions</a>. If payment has
        already been received for an order cancelled by SomnoBalance, an eligible refund will be
        initiated.
      </p>

      <h2>7. Refund after cancellation</h2>
      <p>
        Approved refunds will generally be processed through the original payment method. The time
        taken for the amount to reflect in your account depends on the payment provider, your bank
        or financial institution.
      </p>

      <h2>8. How to request cancellation</h2>
      <p>
        To request cancellation, contact us at Email: {business.email}, Phone: {business.phone}.
        Please provide:
      </p>
      <ul>
        <li>Order number</li>
        <li>Customer name</li>
        <li>Registered mobile number or email</li>
        <li>Reason for cancellation</li>
      </ul>
      <p>Cancellation requests should be submitted as early as possible.</p>
    </LegalPage>
  );
}
