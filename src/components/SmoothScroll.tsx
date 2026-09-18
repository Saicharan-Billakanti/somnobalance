"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Apple-style eased/inertial scrolling (macOS Safari, apple.com product
// pages) instead of the browser's native stepped scroll. Mounted once in
// the shared locale layout so it applies to every page. Respects
// prefers-reduced-motion by simply never constructing Lenis, which leaves
// the browser's native (instant) scroll behavior untouched.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
