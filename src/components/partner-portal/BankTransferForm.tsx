"use client";

import { useState } from "react";
import { useLang } from "@/lib/useLang";
import type { BankDetails } from "@/lib/affiliateMockData";

function maskIban(iban: string) {
  const last4 = iban.replace(/\s/g, "").slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function BankTransferForm({ existing }: { existing: BankDetails | null }) {
  const { tx } = useLang();
  const [saved, setSaved] = useState(existing);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const accountHolderName = String(form.get("accountHolderName") || "").trim();
    const bankName = String(form.get("bankName") || "").trim();
    const iban = String(form.get("iban") || "").trim();
    const bicSwift = String(form.get("bicSwift") || "").trim();
    const country = String(form.get("country") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!accountHolderName) nextErrors.accountHolderName = tx("Account holder name is required", "Name des Kontoinhabers ist erforderlich");
    if (!bankName) nextErrors.bankName = tx("Bank name is required", "Bankname ist erforderlich");
    if (!iban) nextErrors.iban = tx("IBAN is required", "IBAN ist erforderlich");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    // No backend endpoint exists yet — this simulates saving so the UI
    // states (validation, masking, success) can be reviewed.
    await new Promise((r) => setTimeout(r, 700));
    setSaved({ accountHolderName, bankName, ibanMasked: maskIban(iban), bicSwift, country });
    setStatus("success");
  }

  if (saved && status !== "idle") {
    return (
      <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
        <p className="text-sm text-green-700">{tx("Payment details saved successfully.", "Zahlungsdaten erfolgreich gespeichert.")}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Account holder", "Kontoinhaber")}</dt>
            <dd className="mt-1 text-ink/80">{saved.accountHolderName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-ink/50">{tx("Bank", "Bank")}</dt>
            <dd className="mt-1 text-ink/80">{saved.bankName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-ink/50">IBAN</dt>
            <dd className="mt-1 text-ink/80">{saved.ibanMasked}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-ink/50">BIC/SWIFT</dt>
            <dd className="mt-1 text-ink/80">{saved.bicSwift || "—"}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-mauve-dark underline"
        >
          {tx("Update details", "Daten aktualisieren")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-mauve/10 bg-white/60 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">{tx("Account holder name", "Name des Kontoinhabers")}</span>
          <input name="accountHolderName" className="input-field mt-1.5" />
          {errors.accountHolderName && <p className="mt-1 text-xs text-red-700">{errors.accountHolderName}</p>}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">{tx("Bank name", "Bankname")}</span>
          <input name="bankName" className="input-field mt-1.5" />
          {errors.bankName && <p className="mt-1 text-xs text-red-700">{errors.bankName}</p>}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">IBAN</span>
          <input name="iban" className="input-field mt-1.5" />
          {errors.iban && <p className="mt-1 text-xs text-red-700">{errors.iban}</p>}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">BIC/SWIFT</span>
          <input name="bicSwift" className="input-field mt-1.5" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-ink">{tx("Country", "Land")}</span>
        <input name="country" className="input-field mt-1.5" />
      </label>

      <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
        {tx("Please ensure these payment details belong to you. Incorrect details may delay your payout.", "Bitte stellen Sie sicher, dass diese Zahlungsdaten Ihnen gehören. Falsche Angaben können Ihre Auszahlung verzögern.")}
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-mauve px-6 py-3 text-sm text-white transition hover:bg-mauve-dark disabled:opacity-60"
      >
        {status === "submitting" ? tx("Saving…", "Wird gespeichert…") : tx("Save bank details", "Bankdaten speichern")}
      </button>
    </form>
  );
}
