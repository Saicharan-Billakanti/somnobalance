"use client";

import { useConsent } from "@/components/CookieConsent";

export function SpotifyEmbed({ title, src }: { title: string; src: string }) {
  const consent = useConsent();

  if (consent !== "all") {
    return (
      <div className="flex h-[152px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-mauve/30 bg-sand/50 p-4 text-center text-sm text-ink/70">
        <p>“{title}” is hidden until you accept third-party cookies.</p>
        <p className="text-xs text-ink/50">See our Cookie Policy to change your choice at any time.</p>
      </div>
    );
  }

  return (
    <iframe
      title={title}
      style={{ borderRadius: 12 }}
      src={src}
      width="100%"
      height="152"
      frameBorder={0}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
