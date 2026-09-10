"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  image,
  lifestyleImage,
  alt,
  cleanLabel,
  lifestyleLabel,
}: {
  image: string;
  lifestyleImage?: string;
  alt: string;
  cleanLabel: string;
  lifestyleLabel: string;
}) {
  const [showLifestyle, setShowLifestyle] = useState(false);
  const src = showLifestyle && lifestyleImage ? lifestyleImage : image;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={showLifestyle ? "object-cover" : "object-contain"}
          priority
        />
      </div>
      {lifestyleImage && (
        <div className="mt-3 inline-flex rounded-full border border-mauve/20 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setShowLifestyle(false)}
            className={`rounded-full px-3 py-1.5 ${!showLifestyle ? "bg-mauve text-white" : "text-ink/60 hover:bg-sand"}`}
          >
            {cleanLabel}
          </button>
          <button
            type="button"
            onClick={() => setShowLifestyle(true)}
            className={`rounded-full px-3 py-1.5 ${showLifestyle ? "bg-mauve text-white" : "text-ink/60 hover:bg-sand"}`}
          >
            {lifestyleLabel}
          </button>
        </div>
      )}
    </div>
  );
}
