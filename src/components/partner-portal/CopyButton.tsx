"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API can fail in some contexts (e.g. no HTTPS) — fail quietly
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-mauve/30 px-4 py-2 text-xs font-medium text-mauve-dark transition hover:bg-sand"
    >
      {copied ? "Copied to clipboard" : label}
    </button>
  );
}
