"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/useLang";
import type { PayoutReadiness } from "@/lib/affiliateMockData";

export function RequestPayoutButton({ readiness }: { readiness: PayoutReadiness }) {
  const { tx } = useLang();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

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
    setError("");
    try {
      const response = await fetch("/api/partner/payout/request", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not request payout.");
      setStatus("success");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
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
      {status === "success" && <p className="mt-3 text-sm text-green-700">{tx("Payout request submitted for review.", "Auszahlungsanfrage zur Prüfung gesendet.")}</p>}
      {status === "error" && <p className="mt-3 text-sm text-red-700">{error}</p>}
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
