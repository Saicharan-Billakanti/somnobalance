"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/getDictionary";

export function BusinessApplicationForm({ dict }: { dict: Dictionary }) {
  const f = dict.applicationForm;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      contactName: form.get("contactName"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      companyName: form.get("companyName"),
      companyType: form.get("companyType"),
      propertyCount: form.get("propertyCount") || undefined,
      projectStage: form.get("projectStage"),
      message: form.get("message") || undefined,
    };

    try {
      const res = await fetch("/api/applications/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="rounded-2xl border border-mauve/10 bg-white/60 p-6 text-ink/80">{f.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-mauve/10 bg-white/60 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">{f.contactName}</span>
          <input name="contactName" required className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">{f.email}</span>
          <input name="email" type="email" required className="input-field mt-1.5" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">{f.phone}</span>
          <input name="phone" type="tel" className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">{f.companyName}</span>
          <input name="companyName" required className="input-field mt-1.5" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">{f.companyType}</span>
          <select name="companyType" required defaultValue="hotel" className="input-field mt-1.5">
            <option value="hotel">{f.companyTypeHotel}</option>
            <option value="planning-office">{f.companyTypePlanningOffice}</option>
            <option value="clinic">{f.companyTypeClinic}</option>
            <option value="other">{f.companyTypeOther}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">{f.projectStage}</span>
          <select name="projectStage" required defaultValue="planning" className="input-field mt-1.5">
            <option value="planning">{f.projectStagePlanning}</option>
            <option value="active">{f.projectStageActive}</option>
            <option value="renovation">{f.projectStageRenovation}</option>
            <option value="other">{f.projectStageOther}</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">{f.propertyCount}</span>
        <input name="propertyCount" className="input-field mt-1.5" />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-ink">{f.message}</span>
        <textarea name="message" rows={4} className="input-field mt-1.5" />
      </label>

      {status === "error" && <p className="text-sm text-red-700">{f.error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark disabled:opacity-60"
      >
        {status === "submitting" ? f.submitting : f.submit}
      </button>
    </form>
  );
}
