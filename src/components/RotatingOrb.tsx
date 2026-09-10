"use client";

import Image from "next/image";
import { useRef } from "react";

export function RotatingOrb({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-y * 20).toFixed(2)}deg) rotateY(${(x * 20).toFixed(2)}deg) scale(1.04)`;
  }

  function handleLeave() {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]"
    >
      <div className="relative aspect-square overflow-hidden rounded-full border border-white shadow-[0_20px_50px_-20px_rgba(43,37,48,0.4)]">
        <div className="absolute inset-0 animate-[spin_14s_linear_infinite]">
          <Image src={src} alt={alt} fill sizes="320px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}
