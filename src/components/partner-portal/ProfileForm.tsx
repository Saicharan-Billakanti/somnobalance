"use client";

import { useState } from "react";
import type { AffiliateProfile } from "@/lib/affiliateMockData";
import { StatusBadge } from "@/components/partner-portal/StatusBadge";

export function ProfileForm({ profile: initial }: { profile: AffiliateProfile }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // No backend endpoint exists yet — simulates saving so the UI states
    // can be reviewed.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-mauve/10 bg-white/60 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink/60">Profile status</span>
        <StatusBadge status={initial.status} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">First name</span>
          <input name="firstName" defaultValue={initial.firstName} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Last name</span>
          <input name="lastName" defaultValue={initial.lastName} className="input-field mt-1.5" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          name="email"
          defaultValue={initial.email}
          readOnly
          className="input-field mt-1.5 cursor-not-allowed bg-sand/40 text-ink/60"
        />
        <span className="mt-1 block text-xs text-ink/40">Linked to your account login and cannot be changed here.</span>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Phone number</span>
          <input name="phone" defaultValue={initial.phone} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Business name</span>
          <input name="businessName" defaultValue={initial.businessName} className="input-field mt-1.5" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Business type</span>
          <input name="businessType" defaultValue={initial.businessType} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Country</span>
          <input name="country" defaultValue={initial.country} className="input-field mt-1.5" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Address</span>
        <input name="address" defaultValue={initial.address} className="input-field mt-1.5" />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Website</span>
          <input name="website" defaultValue={initial.website} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Audience type</span>
          <input name="audienceType" defaultValue={initial.audienceType} className="input-field mt-1.5" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Affiliate description</span>
        <textarea name="description" defaultValue={initial.description} rows={3} className="input-field mt-1.5" />
      </label>

      {status === "success" && <p className="text-sm text-green-700">Profile updated successfully.</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-mauve px-6 py-3 text-sm text-white transition hover:bg-mauve-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
