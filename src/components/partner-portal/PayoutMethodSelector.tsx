"use client";

import { useState } from "react";
import { StripeStatusCard } from "@/components/partner-portal/StripeStatusCard";
import { BankTransferForm } from "@/components/partner-portal/BankTransferForm";
import type { BankDetails, PayoutMethod, StripeStatus } from "@/lib/affiliateMockData";

export function PayoutMethodSelector({
  initialMethod,
  stripeStatus,
  bankDetails,
}: {
  initialMethod: PayoutMethod;
  stripeStatus: StripeStatus;
  bankDetails: BankDetails | null;
}) {
  const [method, setMethod] = useState<PayoutMethod>(initialMethod);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingMethod, setPendingMethod] = useState<PayoutMethod>(null);

  function selectMethod(next: PayoutMethod) {
    if (next === method) return;
    setPendingMethod(next);
    setShowConfirm(true);
  }

  function confirmChange() {
    setMethod(pendingMethod);
    setShowConfirm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => selectMethod("stripe")}
          className={`flex-1 rounded-2xl border p-4 text-left transition ${
            method === "stripe" ? "border-mauve bg-mauve/5" : "border-mauve/10 bg-white/60 hover:bg-sand/40"
          }`}
        >
          <div className="font-medium text-ink">Stripe Connect</div>
          <div className="mt-1 text-sm text-ink/60">Receive payouts through your verified Stripe account.</div>
        </button>
        <button
          type="button"
          onClick={() => selectMethod("bank")}
          className={`flex-1 rounded-2xl border p-4 text-left transition ${
            method === "bank" ? "border-mauve bg-mauve/5" : "border-mauve/10 bg-white/60 hover:bg-sand/40"
          }`}
        >
          <div className="font-medium text-ink">Bank transfer</div>
          <div className="mt-1 text-sm text-ink/60">Receive payouts directly to your bank account.</div>
        </button>
      </div>

      {showConfirm && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>Changing your payout method may delay the next payout until verification is complete.</p>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={confirmChange} className="font-medium underline">
              Continue
            </button>
            <button type="button" onClick={() => setShowConfirm(false)} className="text-amber-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="pt-2">
        {method === "stripe" ? (
          <StripeStatusCard status={stripeStatus} />
        ) : method === "bank" ? (
          <BankTransferForm existing={bankDetails} />
        ) : (
          <p className="text-sm text-ink/60">Select a payout method above to continue.</p>
        )}
      </div>
    </div>
  );
}
