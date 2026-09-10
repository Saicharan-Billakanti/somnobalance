export function HeroVideo({
  src,
  poster,
  caption,
  journeyLabel,
}: {
  src: string;
  poster?: string;
  caption: string;
  journeyLabel: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-teal/30 via-mauve/10 to-mauve/30" />
      <div className="relative aspect-[4/5] -rotate-3 overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-25px_rgba(43,37,48,0.45)]">
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">{journeyLabel}</div>
          <div className="mt-1 font-serif text-xl text-white">{caption}</div>
        </div>
      </div>
    </div>
  );
}
