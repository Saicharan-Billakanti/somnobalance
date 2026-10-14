"use client";

import { useEffect, useRef } from "react";

// Autoplaying background video. Browsers can pause muted autoplay (power
// saving, tab switches, intersection), so we re-issue play() whenever the
// video or page state suggests it stopped.
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const play = () => {
      if (v.paused) v.play().catch(() => {});
    };
    play();
    const onVisible = () => {
      if (document.visibilityState === "visible") play();
    };
    const io = new IntersectionObserver((e) => e[0]?.isIntersecting && play());
    io.observe(v);
    v.addEventListener("pause", play);
    v.addEventListener("suspend", play);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pointerdown", play, { once: true });
    window.addEventListener("scroll", play, { once: true, passive: true });
    return () => {
      io.disconnect();
      v.removeEventListener("pause", play);
      v.removeEventListener("suspend", play);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("scroll", play);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster="/video/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
    >
      <source src="/video/hero.webm" type="video/webm" />
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}
