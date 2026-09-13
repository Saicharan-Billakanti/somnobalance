// Temporary placeholder for the brand/concept video the client is
// preparing (storyboard mentioned but not yet delivered). Replace the
// contents of this component with a real <video>/embed once the final
// file arrives — the surrounding section markup on the homepage can
// stay as-is.
export function VideoPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-3xl border border-mauve/10 bg-white/40">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mauve/90 text-white shadow-sm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/40">{label}</p>
      </div>
    </div>
  );
}
