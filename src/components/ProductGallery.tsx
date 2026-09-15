"use client";

import { useState } from "react";
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
      </div>

      {showControls && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Previous"
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
            aria-label="Next"
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
