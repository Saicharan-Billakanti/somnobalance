"use client";

import { useLang } from "@/lib/useLang";

export function ShareButton({ value }: { value: string }) {
  const { tx } = useLang();
  return (
    <button
      type="button"
      onClick={() => {
        if (navigator.share) {
          navigator.share({ url: value }).catch(() => {});
        }
      }}
      className="rounded-full border border-mauve/30 px-4 py-2 text-xs font-medium text-mauve-dark transition hover:bg-sand"
    >
      {tx("Share Link", "Link teilen")}
    </button>
  );
}
