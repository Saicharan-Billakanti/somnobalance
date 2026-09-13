// A flat, quiet strip of the SomnoBalance cycle stage names, used as a
// section header (not the hero) — plain text labels over a warm tan bar,
// no gradient/photo, distinct from the hero's own visual language.
export function CycleBar({ label, stages }: { label: string; stages: { name: string }[] }) {
  return (
    <div className="bg-sand/70 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 sm:px-6">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/40">{label}</span>
      </div>
      <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-4 px-4 text-[0.65rem] uppercase tracking-[0.15em] text-ink/50 sm:gap-8 sm:px-6">
        {stages.map((stage, i) => (
          <span key={stage.name} className="flex items-center gap-4 sm:gap-8">
            {stage.name}
            {i < stages.length - 1 && <span className="text-ink/20">—</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
