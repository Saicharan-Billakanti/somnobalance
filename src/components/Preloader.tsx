"use client";

import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "sb-preloader-seen";
// The clip is 4s; this is the hard ceiling if playback stalls.
const MAX_WAIT_MS = 8000;
const FADE_MS = 600;

// Full-screen intro shown once per browser session. It is rendered in the
// server HTML so the page never flashes before it; the beforeInteractive
// script in the layout sets html[data-preloader="skip"] (return visits in the
// same session, reduced-motion) so globals.css hides it before first paint.
// A CSS failsafe animation also hides it if JS never runs.
export function Preloader() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
    let ended = false;
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
      if (ended && loaded) finish();
    };

    const video = videoRef.current;
    const onEnded = () => {
      ended = true;
      maybeFinish();
    };
    const onLoad = () => {
      loaded = true;
      maybeFinish();
    };

    video?.addEventListener("ended", onEnded);
    video?.addEventListener("error", finish);
    if (!loaded) window.addEventListener("load", onLoad);

    // Autoplay can be refused (e.g. iOS low-power mode): skip rather than block.
    video?.play().catch(finish);

    const cap = window.setTimeout(finish, MAX_WAIT_MS);
    return () => {
      window.clearTimeout(cap);
      video?.removeEventListener("ended", onEnded);
      video?.removeEventListener("error", finish);
      window.removeEventListener("load", onLoad);
      root.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="site-preloader fixed inset-0 z-[200] flex items-center justify-center bg-[#EDDFD0] transition-opacity ease-out"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
      role="status"
      aria-label="Loading"
    >
      <video
        ref={videoRef}
        className="h-auto w-[clamp(300px,42vw,540px)]"
        src="/preloader/lotus-preloader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}
