import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";

export const metadata = { title: "Returns & Withdrawal — SomnoBalance" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns & Withdrawal Policy" updated="2 September 2026">
      <p className="rounded-xl border border-teal/20 bg-teal/5 p-4 text-sm">
        This page follows the standard EU model withdrawal instructions (Consumer Rights Directive
        2011/83/EU, Annex I). Please have a lawyer confirm the final wording and timeframes before
        this policy is used for real transactions.
      </p>

      <h2>Right of withdrawal</h2>
      <p>
        You have the right to withdraw from this contract within 14 days without giving any
        reason. The withdrawal period will expire 14 days from the day on which you, or a third
        party other than the carrier and indicated by you, acquires physical possession of the
        goods.
      </p>
      <p>
        To exercise the right of withdrawal, you must inform us ({business.legalEntityName},{" "}
        {business.addressLine1}, {business.addressLine2}, {business.email}, {business.phone}) of
        your decision to withdraw from this contract by an unequivocal statement (e.g. a letter
        sent by post or email). You may use the model withdrawal form below, but it is not
        obligatory.
      </p>
      <p>
        To meet the withdrawal deadline, it is sufficient for you to send your communication
        concerning your exercise of the right of withdrawal before the withdrawal period has
        expired.
      </p>

      <h2>Effects of withdrawal</h2>
      <p>
        If you withdraw from this contract, we will reimburse all payments received from you,
        including the costs of delivery (except for supplementary costs arising if you chose a
        type of delivery other than the least expensive type of standard delivery offered by us),
        without undue delay and, in any event, not later than 14 days from the day on which we are
        informed about your decision to withdraw. We will carry out such reimbursement using the
        same means of payment as you used for the initial transaction, unless expressly agreed
        otherwise; in any event, you will not incur any fees as a result of the reimbursement.
      </p>
      <p>
        We may withhold reimbursement until we have received the goods back, or you have supplied
        evidence of having sent back the goods, whichever is the earliest. You must send back the
        goods without undue delay and, in any event, not later than 14 days from the day on which
        you communicate your withdrawal. The deadline is met if you send back the goods before the
        14-day period has expired. You bear the direct cost of returning the goods. You are only
        liable for any diminished value of the goods resulting from handling other than what is
        necessary to establish the nature, characteristics, and functioning of the goods.
      </p>

      <h2>Exceptions</h2>
      <p>
        The right of withdrawal does not apply to sealed goods which are not suitable for return
        due to health protection or hygiene reasons if they were unsealed after delivery (this may
        apply to certain oils and consumables, clearly marked on the product page).
      </p>

      <h2>Model withdrawal form</h2>
      <p>(Complete and return this form only if you wish to withdraw from the contract.)</p>
      <div className="rounded-xl border border-mauve/15 bg-white/60 p-5 text-sm">
        <p>To: {business.legalEntityName}, {business.addressLine1}, {business.addressLine2}, {business.email}</p>
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
