"use client";

import Image from "next/image";
import { useState } from "react";

export type FlipCardItem = {
  src: string;
  name: string;
  phaseLabel: string;
};

export function HeroFlipCards({ items, caption }: { items: FlipCardItem[]; caption: string }) {
  const [order, setOrder] = useState(items.map((_, i) => i));
  const [exiting, setExiting] = useState(false);

  const advance = () => {
    if (exiting || order.length < 2) return;
    setExiting(true);
  };

  const handleExitEnd = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
    setExiting(false);
  };

  const top = items[order[0]];
  const mid = items[order[1] ?? order[0]];
  const back = items[order[2] ?? order[0]];

  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-teal/30 via-mauve/10 to-mauve/30" />

      <button
        type="button"
        onClick={advance}
        aria-label="Show next product"
        className="relative block aspect-[4/5] w-full cursor-pointer overflow-visible rounded-[2rem] text-left"
      >
        {/* back card, peeking for stack depth */}
        <div className="absolute inset-0 -rotate-6 translate-x-3 translate-y-2 scale-[0.96] overflow-hidden rounded-[2rem] bg-sand shadow-[0_20px_50px_-25px_rgba(43,37,48,0.4)]">
          <Image src={back.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-70" />
        </div>

        {/* mid card, static — revealed the instant the top card exits */}
        <div className="absolute inset-0 -rotate-3 overflow-hidden rounded-[2rem] shadow-[0_30px_65px_-25px_rgba(43,37,48,0.45)]">
          <Image src={mid.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        </div>

        {/* top card — plays a one-shot exit animation, then is swapped out (no transition, so no fly-back-in) */}
        <div
          key={order[0]}
          onAnimationEnd={handleExitEnd}
          className={`absolute inset-0 -rotate-3 overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-25px_rgba(43,37,48,0.45)] ${
            exiting ? "animate-[card-exit_420ms_cubic-bezier(.4,0,1,1)_forwards]" : ""
          }`}
        >
          <Image
            src={top.src}
            alt={top.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:p-6">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-[11px]">
                {caption}
              </div>
              <div className="mt-1 truncate font-serif text-lg text-white sm:text-xl">{top.name}</div>
            </div>
            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur sm:py-1.5 sm:text-[11px]">
              {top.phaseLabel}
            </span>
          </div>
        </div>
      </button>

      <div
        className="pointer-events-none absolute -top-4 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-mauve/15 bg-white/90 text-ink/50 shadow-sm"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
