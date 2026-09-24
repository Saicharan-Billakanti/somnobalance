"use client";

import { useState } from "react";
import { useLang } from "@/lib/useLang";
import type { PayoutReadiness } from "@/lib/affiliateMockData";

export function RequestPayoutButton({ readiness }: { readiness: PayoutReadiness }) {
  const { tx } = useLang();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const blockers: string[] = [];
  if (readiness.availableBalance < readiness.minimumPayout) blockers.push(tx("Payout amount is below the minimum threshold.", "Der Auszahlungsbetrag liegt unter der Mindestgrenze."));
  if (readiness.accountSuspended) blockers.push(tx("Your affiliate account is suspended.", "Ihr Partnerkonto ist gesperrt."));
  if (readiness.payoutProcessing) blockers.push(tx("A payout is already processing.", "Eine Auszahlung wird bereits bearbeitet."));
  if (readiness.selectedMethod === "stripe" && readiness.stripeStatus !== "connected") {
    blockers.push(tx("Complete Stripe onboarding to receive payouts.", "Schließen Sie das Stripe-Onboarding ab, um Auszahlungen zu erhalten."));
  }
  if (readiness.selectedMethod === "bank" && !readiness.bankDetailsComplete) {
    blockers.push(tx("Your payout method is incomplete.", "Ihre Auszahlungsmethode ist unvollständig."));
  }
  if (!readiness.selectedMethod) blockers.push(tx("Your payout method is not ready yet.", "Ihre Auszahlungsmethode ist noch nicht bereit."));

  const disabled = blockers.length > 0 || status === "submitting";

  async function handleRequest() {
    setStatus("submitting");
    // No backend endpoint exists yet — this simulates the request so the
    // UI states (submitting/success) can be reviewed. Replace with a real
    // POST once the payout API exists.
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={handleRequest}
        className="rounded-full bg-mauve px-6 py-3 text-sm text-white transition hover:bg-mauve-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? tx("Requesting…", "Wird angefordert…") : tx("Request payout", "Auszahlung anfordern")}
      </button>
      {status === "success" && <p className="mt-3 text-sm text-green-700">{tx("Payout request submitted.", "Auszahlungsanfrage gesendet.")}</p>}
      {status === "error" && <p className="mt-3 text-sm text-red-700">{tx("Something went wrong. Please try again.", "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.")}</p>}
      {blockers.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-ink/60">
          {blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
