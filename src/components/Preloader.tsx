"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";

const SEEN_KEY = "sb-preloader-seen";
// Total time the lotus takes to draw itself, plus a short hold.
const DRAW_MS = 3900;
// Hard ceiling in case the page never reports as loaded.
const MAX_WAIT_MS = 8000;
const FADE_MS = 600;

// Left half of the lotus (mirrored for the right half). Coordinates are in
// a 1190x720 space. [path, delay-s, duration-s]
const LEFT_PETALS: [string, number, number][] = [
  ["M125 450 C80 465 45 483 20 500 C80 610 200 685 330 685 C420 685 500 650 560 613", 0, 1.1],
  ["M446 388 C360 300 200 290 85 318 C110 470 250 590 350 610 C430 625 500 615 562 602", 0.55, 1.1],
  ["M291 290 C279 240 280 160 297 106 C370 118 425 155 458 194", 1.05, 0.9],
];
const CENTRE_PETAL = [
  "M595 600 C480 505 440 400 447 300 C455 180 520 80 598 15",
  "M595 600 C710 505 750 400 743 300 C735 180 670 80 598 15",
];

function Lotus() {
  const stroke = (d: string, delay: number, dur: number, key: string) => (
    <path
      key={key}
      d={d}
      pathLength={1}
      className="lotus-stroke"
      style={{ ["--d" as string]: `${delay}s`, ["--t" as string]: `${dur}s` }}
    />
  );

  return (
    <svg
      viewBox="-8 -4 1206 728"
      className="h-auto w-[clamp(170px,16vw,240px)]"
      aria-hidden="true"
    >
      <g fill="none" stroke="#6F5784" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {LEFT_PETALS.map(([d, delay, dur], i) => stroke(d, delay, dur, `l${i}`))}
        <g transform="translate(1190 0) scale(-1 1)">
          {LEFT_PETALS.map(([d, delay, dur], i) => stroke(d, delay, dur, `r${i}`))}
        </g>
        {CENTRE_PETAL.map((d, i) => stroke(d, 1.5, 1.1, `c${i}`))}
      </g>
      <g fill="none" stroke="#669999" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
        {stroke(
          "M595 368 C570 335 520 335 500 355 C480 380 505 402 535 398 C565 394 585 380 595 368 C605 380 625 394 655 398 C685 402 710 380 690 355 C670 335 620 335 595 368Z",
          2.5,
          0.8,
          "inf"
        )}
        {stroke("M570 400 C570 420 578 432 591 437 C604 432 612 420 613 400", 3.1, 0.5, "chin")}
      </g>
      <g fill="#669999">
        {[
          [541, 317, 3.0],
          [595, 304, 3.15],
          [651, 317, 3.3],
        ].map(([cx, cy, delay]) => (
          <circle
            key={cx}
            cx={cx}
            cy={cy}
            r="15"
            className="lotus-dot"
            style={{ ["--d" as string]: `${delay}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

// Full-screen intro shown once per browser session. It is rendered in the
// server HTML so the page never flashes before it; the beforeInteractive
// script in the layout sets html[data-preloader="skip"] (return visits in the
// same session, reduced-motion) so globals.css hides it before first paint.
// A CSS failsafe animation also hides it if JS never runs.
export function Preloader() {
  const { tx } = useLang();
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-preloader") === "skip") {
      setGone(true);
      return;
    }

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    root.style.overflow = "hidden";
    let drawn = false;
    let loaded = document.readyState === "complete";
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      root.style.overflow = "";
      setFading(true);
      window.setTimeout(() => setGone(true), FADE_MS);
    };
    const maybeFinish = () => {
      if (drawn && loaded) finish();
    };
    const onLoad = () => {
      loaded = true;
      maybeFinish();
    };

    if (!loaded) window.addEventListener("load", onLoad);
    const drawTimer = window.setTimeout(() => {
      drawn = true;
      maybeFinish();
    }, DRAW_MS);
    const cap = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      window.clearTimeout(drawTimer);
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
      root.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="site-preloader fixed inset-0 z-[200] flex items-center justify-center bg-[#F8F3F1] transition-opacity ease-out"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
      role="status"
      aria-label={tx("Loading", "Wird geladen")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, #6F5784 14%, transparent), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">
        <Lotus />
      </div>
    </div>
  );
}
