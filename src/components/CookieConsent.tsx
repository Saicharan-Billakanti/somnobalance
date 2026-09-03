"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";

type Consent = "unset" | "essential-only" | "all";
const ConsentContext = createContext<{ consent: Consent }>({ consent: "unset" });
const STORAGE_KEY = "somnobalance-cookie-consent";

export function useConsent() {
  return useContext(ConsentContext).consent;
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent>("unset");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (stored) setConsent(stored);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const choose = (value: Consent) => {
    setConsent(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  return (
    <ConsentContext.Provider value={{ consent }}>
      {children}
      {ready && consent === "unset" && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-mauve/20 bg-offwhite/98 px-4 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ink">
              We use essential cookies to run this site, and — only with your consent — embedded
              Spotify players for our ritual playlists, which may set third-party cookies. See our{" "}
              <Link href="/legal/cookies" className="underline text-teal-dark">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => choose("essential-only")}
                className="rounded-full border border-mauve px-4 py-2 text-sm text-mauve-dark hover:bg-sand"
              >
                Essential only
              </button>
              <button
                onClick={() => choose("all")}
                className="rounded-full bg-mauve px-4 py-2 text-sm text-white hover:bg-mauve-dark"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </ConsentContext.Provider>
  );
}
