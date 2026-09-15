// Visual shell only — matches the reference design's layout and copy.
// The real Web Audio playback (play/pause, progress, volume) is a
// follow-up pass; this button is intentionally inert for now.
export function SoundPanel({
  title,
  intro,
  quote,
}: {
  title: string;
  intro: string;
  quote: string;
}) {
  return (
    <aside className="self-start rounded-md border border-mauve/10 bg-white/60 px-6 py-8 lg:min-h-[530px]">
      <h2 className="font-serif text-xl text-ink">
        {title.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </h2>
      <p className="mt-2 text-[10px] leading-5 text-ink/60">
        {intro.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>

      <button
        type="button"
        disabled
        aria-label="Sound coming soon"
        className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-sand text-ink/60"
      >
        <PlayIcon />
      </button>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-mauve/10">
          <div className="h-px w-1/3 bg-mauve-dark" />
        </div>
        <VolumeIcon />
      </div>
      <p className="mt-2 text-[9px] text-ink/50">00:00 / 02:00</p>

      <div className="my-10 h-px w-9 bg-mauve/10" />
      <p className="rotate-[-7deg] text-center font-serif text-2xl italic leading-tight text-mauve-dark/60">
        {quote.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </aside>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M19 5a11 11 0 0 1 0 14M15.5 8.5a6 6 0 0 1 0 7" />
    </svg>
  );
}
