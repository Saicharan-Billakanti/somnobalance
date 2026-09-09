// The homepage hero's visual translation of the SomnoBalance cycle
// (TAG → REGULATION → LOSLASSEN → VORBEREITUNG → NACHT): a single warm
// gradient panel that moves from bright daylight tone into deep, warm
// dusk — no icons, no numbered steps, no infographic. The five stage
// words sit on top as understated labels; color and typography carry
// the meaning, not shapes.
//
// The gradient direction flips between mobile (top-to-bottom, so a
// vertical stack of labels lines up with the right background colour
// at each point — mirrors the page's own downward scroll) and desktop
// (left-to-right, one continuous horizontal line). Rendered as two
// separate elements (one hidden per breakpoint) rather than one
// conditionally-overridden background, since Tailwind can't vary an
// inline custom-gradient across breakpoints on its own.
function StageLabel({ name, light }: { name: string; light: boolean }) {
  return (
    <span
      className={`text-sm font-medium uppercase tracking-[0.15em] sm:text-[0.65rem] md:text-xs ${
        light ? "text-offwhite/90" : "text-ink/70"
      }`}
    >
      {name}
    </span>
  );
}

export function CycleStrip({
  label,
  stages,
}: {
  label: string;
  stages: { name: string }[];
}) {
  return (
    <div className="relative">
      <p className="mx-auto max-w-6xl px-4 text-center text-xs uppercase tracking-[0.25em] text-ink/40 sm:px-6">
        {label}
      </p>

      {/* Mobile: vertical gradient, stacked labels */}
      <div
        className="relative mt-4 flex w-full flex-col justify-between gap-8 px-6 py-10 sm:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-cycle-day), var(--color-cycle-regulate) 28%, var(--color-cycle-letgo) 55%, var(--color-cycle-prepare) 78%, var(--color-cycle-night))",
        }}
      >
        {stages.map((stage, i) => (
          <StageLabel key={stage.name} name={stage.name} light={i >= stages.length - 2} />
        ))}
      </div>

      {/* Desktop: horizontal gradient, one row of labels */}
      <div
        className="relative mt-4 hidden h-48 w-full sm:block"
        style={{
          background:
            "linear-gradient(to right, var(--color-cycle-day), var(--color-cycle-regulate) 28%, var(--color-cycle-letgo) 55%, var(--color-cycle-prepare) 78%, var(--color-cycle-night))",
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-end justify-between px-10 pb-6">
          {stages.map((stage, i) => (
            <StageLabel key={stage.name} name={stage.name} light={i >= stages.length - 2} />
          ))}
        </div>
      </div>
    </div>
  );
}
