"use client";

import { useState } from "react";

export function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-mauve/10 border-y border-mauve/10">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left text-sm text-ink"
          >
            {item.title}
            <span aria-hidden="true" className="text-lg text-ink/50">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && <div className="pb-4 text-sm leading-relaxed text-ink/70">{item.content}</div>}
        </div>
      ))}
    </div>
  );
}
