// Binding component per SomnoBalance_Entwickler-Vorgabe.docx §6/§10: a
// numbered 01-04 progress strip for the four-phase model — thin top
// divider (alternating primary/accent color), number, name, one-sentence
// caption. No card background, no icon, no border box. Replaces the old
// 5-stage CycleBar (TAG/REGULATION/LOSLASSEN/VORBEREITUNG/NACHT), which
// used non-canonical station names and icon chips the spec disallows.
const DIVIDER_COLORS = ["var(--color-mauve)", "var(--color-teal)", "var(--color-mauve)", "var(--color-teal)"];

export function PhaseProgressStrip({
  phases,
}: {
  phases: { name: string; caption: string }[];
}) {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 px-4 sm:grid-cols-4 sm:px-6">
      {phases.map((phase, i) => (
        <div key={phase.name} className="pt-3" style={{ borderTop: `2px solid ${DIVIDER_COLORS[i % 4]}` }}>
          <span className="text-xs text-ink-meta">{String(i + 1).padStart(2, "0")}</span>
          <div className="mt-1 text-sm font-medium text-ink">{phase.name}</div>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">{phase.caption}</p>
        </div>
      ))}
    </div>
  );
}
