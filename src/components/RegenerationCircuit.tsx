// Homepage Section 3 — "Der SomnoBalance Regenerationskreislauf", rebuilt
// to match the client's Lovable reference build (ui-ux-landing-page): a
// 4-across grid of phase cards (number, label, headline, tags), each
// tinted with the brief's mandatory four-tone color scale, closing with a
// "sunrise" strip. The reference build colors each card with an AI-
// generated photo background; we keep color/typography only, since no
// real per-phase photography exists and the client's standing instruction
// rules out substituting AI-generated imagery.
const PHASE_COLORS = [
  "var(--color-circuit-regulate)",
  "var(--color-circuit-letgo)",
  "var(--color-circuit-prepare)",
  "var(--color-circuit-regenerate)",
];

// Phase 03/04 backgrounds are dark enough that body copy needs to flip to
// a light ink tone; 01/02 stay on the normal dark-on-light text color.
const PHASE_TEXT_ON_DARK = [false, false, true, true];

type Phase = {
  number: string;
  name: string;
  time: string;
  headline: string;
  body: string;
  orientation: string;
};

export function RegenerationCircuit({
  eyebrow,
  headline,
  intro,
  phases,
  closing,
  closingSub,
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  phases: Phase[];
  closing: string;
  closingSub: string;
}) {
  return (
    <section style={{ background: "var(--color-sand)" }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-20 sm:px-6 md:grid-cols-[1fr_1.5fr] md:gap-[8%]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">{eyebrow}</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">{headline}</h2>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-ink-muted">{intro}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase, i) => {
          const isDark = PHASE_TEXT_ON_DARK[i];
          return (
            <div
              key={phase.name}
              className="flex min-h-[420px] flex-col border-r border-white/20 p-8"
              style={{ background: PHASE_COLORS[i] }}
            >
              <span
                className="font-serif text-lg"
                style={{ color: isDark ? "#fff" : "var(--color-ink)" }}
              >
                {phase.number}
              </span>
              <p
                className="mt-2 border-t pt-2 font-serif text-base"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(36,31,41,0.2)",
                  color: isDark ? "#fff" : "var(--color-ink)",
                }}
              >
                {phase.name} · {phase.time}
              </p>
              <h3
                className="mt-3 min-h-[4.5rem] font-serif text-2xl italic leading-snug"
                style={{ color: isDark ? "#fff" : "var(--color-ink)" }}
              >
                {phase.headline}
              </h3>
              <p
                className="min-h-[5rem] text-sm leading-relaxed"
                style={{ color: isDark ? "rgba(255,255,255,0.8)" : "var(--color-ink-muted)" }}
              >
                {phase.body}
              </p>
              <div className="mt-auto flex flex-col gap-1.5 pt-6 text-xs uppercase tracking-[0.15em]">
                {phase.orientation.split(" · ").map((word) => (
                  <span key={word} style={{ color: isDark ? "rgba(255,255,255,0.6)" : "var(--color-ink-meta)" }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex min-h-[86px] items-center justify-center px-4 text-center sm:px-6"
        style={{ background: PHASE_COLORS[phases.length - 1] }}
      >
        <div>
          <p className="font-serif text-xl italic leading-snug text-white">{closing}</p>
          <p className="mt-1 text-xs text-white/60">{closingSub}</p>
        </div>
      </div>
    </section>
  );
}
