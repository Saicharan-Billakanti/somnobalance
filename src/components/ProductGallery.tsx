"use client";

import { useState } from "react";
import { useLang } from "@/lib/useLang";
import Image from "next/image";

export function ProductGallery({
  images,
  alt,
  overlay,
}: {
  images: string[];
  alt: string;
  overlay?: React.ReactNode;
}) {
  const { tx } = useLang();
  const [active, setActive] = useState(0);

  const showControls = images.length > 1;

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white shadow-sm">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        {overlay}
        <button
          type="button"
          disabled
          aria-label={tx("Zoom (coming soon)", "Zoom (demnächst)")}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow transition hover:bg-sand"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {showControls && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label={tx("Previous", "Zurück")}
            onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mauve/30 bg-transparent text-ink/70 transition hover:border-mauve hover:text-mauve-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-1 items-center justify-center gap-4 overflow-hidden px-2">
            {images.map((imgSrc, i) => (
              <button
                key={imgSrc}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-white transition ${
                  i === active ? "border-[1.5px] border-ink p-[1px]" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <Image src={imgSrc} alt="" fill className="object-cover" />
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label={tx("Next", "Weiter")}
            onClick={() => setActive((i) => (i + 1) % images.length)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mauve/30 bg-transparent text-ink/70 transition hover:border-mauve hover:text-mauve-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
