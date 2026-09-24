"use client";

import { useState } from "react";
import { useLang } from "@/lib/useLang";
import type { StripeStatus } from "@/lib/affiliateMockData";

type Copy = { title: string; body: string; button: string };
const COPY: Record<"en" | "de", Record<StripeStatus, Copy>> = {
  en: {
    not_connected: {
      title: "Connect your Stripe account to receive commissions.",
      body: "Receive payouts through your verified Stripe account.",
      button: "Connect with Stripe",
    },
    restricted: {
      title: "Stripe verification required",
      body: "Complete the remaining information in Stripe to enable payouts.",
      button: "Continue verification",
    },
    paused: {
      title: "Payouts paused",
      body: "Stripe requires additional information before payouts can be sent.",
      button: "Open Stripe onboarding",
    },
    connected: {
      title: "Stripe Connected",
      body: "Your account is ready to receive payouts.",
      button: "Open Stripe dashboard",
    },
  },
  de: {
    not_connected: {
      title: "Verbinden Sie Ihr Stripe-Konto, um Provisionen zu erhalten.",
      body: "Erhalten Sie Auszahlungen über Ihr verifiziertes Stripe-Konto.",
      button: "Mit Stripe verbinden",
    },
    restricted: {
      title: "Stripe-Verifizierung erforderlich",
      body: "Vervollständigen Sie die restlichen Angaben in Stripe, um Auszahlungen zu aktivieren.",
      button: "Verifizierung fortsetzen",
    },
    paused: {
      title: "Auszahlungen pausiert",
      body: "Stripe benötigt zusätzliche Informationen, bevor Auszahlungen gesendet werden können.",
      button: "Stripe-Onboarding öffnen",
    },
    connected: {
      title: "Stripe verbunden",
      body: "Ihr Konto ist bereit für Auszahlungen.",
      button: "Stripe-Dashboard öffnen",
    },
  },
};

export function StripeStatusCard({ status: initialStatus }: { status: StripeStatus }) {
  const { lang, tx } = useLang();
  const [status] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const copy = COPY[lang][status];

  async function handleClick() {
    setLoading(true);
    // No backend endpoint exists yet for creating a real Stripe Connect
    // onboarding link. This simulates the round trip so the UI states can
    // be reviewed — replace with a real call to the backend, which should
    // create/reuse the connected account and return a Stripe-hosted
    // onboarding URL to redirect to.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-ink">{copy.title}</h3>
          <p className="mt-1 text-sm text-ink/70">{copy.body}</p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="shrink-0 rounded-full bg-mauve px-5 py-2.5 text-sm text-white transition hover:bg-mauve-dark disabled:opacity-60"
        >
          {loading ? tx("Opening…", "Wird geöffnet…") : copy.button}
        </button>
      </div>

      {status !== "not_connected" && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-mauve/10 pt-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Stripe account ID", "Stripe-Konto-ID")}</div>
            <div className="mt-1 text-ink/80">{tx("Connected", "Verbunden")}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Payout status", "Auszahlungsstatus")}</div>
            <div className="mt-1 text-ink/80">
              {status === "connected" ? tx("Enabled", "Aktiviert") : status === "paused" ? tx("Paused", "Pausiert") : tx("Verification required", "Verifizierung erforderlich")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
