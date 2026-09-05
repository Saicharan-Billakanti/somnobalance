import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Right of Withdrawal — SomnoBalance" };

export default function WithdrawalPage() {
  return (
    <LegalPage title="Right of Withdrawal" updated="4 September 2026">
      <p>
        This policy applies to consumers (Verbraucher) — natural persons entering into a contract
        with SomnoBalance for purposes that are predominantly outside their trade, business or
        profession. It does not apply to B2B customers acting in the course of their trade,
        business or profession.
      </p>

      <h2>Right of withdrawal</h2>
      <p>You have the right to withdraw from this contract within 14 days without giving any reason.</p>
      <p>
        The withdrawal period will expire 14 days from the day on which you, or a third party
        other than the carrier and indicated by you, acquire physical possession of the goods or,
        in the case of an order comprising multiple goods delivered separately, from the day you
        acquire physical possession of the last good.
      </p>
      <p>
        To exercise the right of withdrawal, you must inform us — {business.ownerName}, trading as
        &quot;Willing1863&quot; (sole proprietorship / Einzelunternehmen), {business.addressLine1},{" "}
        {business.addressLine2}, Email: {business.email}, Phone: {business.phone} — of your
        decision to withdraw from this contract by an unequivocal statement (for example a letter
        sent by post, or an email). You may use the model withdrawal form set out below, but it is
        not obligatory.
      </p>
      <p>
        To meet the withdrawal deadline, it is sufficient for you to send your communication
        concerning your exercise of the right of withdrawal before the withdrawal period has
        expired.
      </p>

      <h2>Effects of withdrawal</h2>
      <p>
        If you withdraw from this contract, we will reimburse all payments received from you,
        including delivery costs (except for supplementary costs resulting from your choice of a
        delivery type other than the least expensive standard delivery offered by us), without
        undue delay and in any event not later than 14 days from the day on which we are informed
        about your decision to withdraw. We will use the same means of payment as you used for the
        original transaction, unless expressly agreed otherwise; in any event, you will not incur
        any fees as a result of this reimbursement.
      </p>
      <p>
        We may withhold reimbursement until we have received the goods back, or you have supplied
        evidence of having sent back the goods, whichever is the earliest.
      </p>
      <p>
        You must send back the goods or hand them over to us at {business.ownerName},
        &quot;Willing1863&quot;, {business.addressLine1}, {business.addressLine2}, without undue
        delay and in any event not later than 14 days from the day on which you communicate your
        withdrawal from this contract. The deadline is met if you send back the goods before the
        period of 14 days has expired.
      </p>
      <p>
        You will have to bear the direct cost of returning the goods. For goods that can be
        shipped as a parcel (Ritual collection products, card set, neck support pillow, starter
        set), the return is made as a DHL parcel at your own cost. Mattresses cannot be repacked
        into parcel-suitable packaging once unpacked and are collected exclusively by a freight
        forwarder, kerbside, which we arrange at your request; the exact return-cost amount for a
        mattress will be stated on the relevant product page before the contract is concluded.
      </p>
      <p>
        You are only liable for any diminished value of the goods resulting from handling other
        than what is necessary to establish the nature, characteristics and functioning of the
        goods.
      </p>

      <h2>Exclusions and early expiry of the right of withdrawal</h2>
      <p>Unless otherwise agreed, the right of withdrawal does not apply to contracts for:</p>
      <ul>
        <li>Goods made to your specifications or clearly personalised</li>
        <li>Sealed goods which are not suitable for return for reasons of health protection or hygiene, if their seal was removed after delivery</li>
        <li>Goods which, after delivery, are, according to their nature, inseparably mixed with other items</li>
        <li>Sealed audio or video recordings, or sealed software, once unsealed after delivery</li>
      </ul>

      <h2>Model withdrawal form</h2>
      <p>(Complete and return this form only if you wish to withdraw from the contract.)</p>
      <div className="rounded-xl border border-mauve/15 bg-white/60 p-5 text-sm">
        <p>
          To: {business.ownerName}, trading as &quot;Willing1863&quot; (sole proprietorship /
          Einzelunternehmen), {business.addressLine1}, {business.addressLine2}, Email:{" "}
          {business.email}
        </p>
        <p className="mt-3">
          I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of
          the following goods (*)/for the provision of the following service (*),
        </p>
        <p className="mt-3">Ordered on (*)/received on (*):</p>
        <p className="mt-3">Name of consumer(s):</p>
        <p className="mt-3">Address of consumer(s):</p>
        <p className="mt-3">Signature of consumer(s) (only if this form is notified on paper):</p>
        <p className="mt-3">Date:</p>
        <p className="mt-3 text-xs text-ink/50">(*) Delete as appropriate.</p>
      </div>
    </LegalPage>
  );
}
