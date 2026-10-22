"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";

const SEEN_KEY = "sb-preloader-seen";
// Total time the lotus takes to appear, plus a short hold.
const DRAW_MS = 3000;
// Hard ceiling in case the page never reports as loaded.
const MAX_WAIT_MS = 8000;
const FADE_MS = 600;

// The original SomnoBalance lotus (from the brand logo file), revealed from
// the base upwards. `multiply` lets the white of the artwork take on the
// preloader background colour.
function Lotus() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/lotus.webp"
      alt=""
      width={720}
      height={420}
      className="lotus-reveal h-auto w-[clamp(220px,22vw,340px)] mix-blend-multiply"
      aria-hidden="true"
    />
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
    // The html[data-preloader="skip"] attribute is set by a
    // beforeInteractive script, which only runs once per real page load —
    // not on a client-side navigation into a different [lang] segment
    // (e.g. the locale switcher's router.push + router.refresh), which
    // remounts this component without that script re-running. Checking
    // sessionStorage directly here as well closes that gap, so the
    // preloader doesn't reappear after switching languages mid-session.
    let alreadySeen = root.getAttribute("data-preloader") === "skip";
    if (!alreadySeen) {
      try {
        alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}
    }
    if (alreadySeen) {
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
