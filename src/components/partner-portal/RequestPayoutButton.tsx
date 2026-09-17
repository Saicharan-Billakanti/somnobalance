"use client";

import { useState } from "react";
import type { PayoutReadiness } from "@/lib/affiliateMockData";

export function RequestPayoutButton({ readiness }: { readiness: PayoutReadiness }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const blockers: string[] = [];
  if (readiness.availableBalance < readiness.minimumPayout) blockers.push("Payout amount is below the minimum threshold.");
  if (readiness.accountSuspended) blockers.push("Your affiliate account is suspended.");
  if (readiness.payoutProcessing) blockers.push("A payout is already processing.");
  if (readiness.selectedMethod === "stripe" && readiness.stripeStatus !== "connected") {
    blockers.push("Complete Stripe onboarding to receive payouts.");
  }
  if (readiness.selectedMethod === "bank" && !readiness.bankDetailsComplete) {
    blockers.push("Your payout method is incomplete.");
  }
  if (!readiness.selectedMethod) blockers.push("Your payout method is not ready yet.");

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
        {status === "submitting" ? "Requesting…" : "Request payout"}
      </button>
      {status === "success" && <p className="mt-3 text-sm text-green-700">Payout request submitted.</p>}
      {status === "error" && <p className="mt-3 text-sm text-red-700">Something went wrong. Please try again.</p>}
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
