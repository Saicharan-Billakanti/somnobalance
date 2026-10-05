"use client";

// Homepage Section 3 — "Der SomnoBalance Regenerationskreislauf", per
// SomnoBalance_Startseite_Abschnitte-2-5.docx (2026-09-30). Four phases
// experienced one after another while scrolling, background color/light
// shifting through the brief's mandatory four-tone scale (light at
// REGULIEREN, deepest at REGENERIEREN, lightening again at the closing
// line). Restyled as four stacked full-width bands (numbered circle +
// two-column text) to match the client's latest homepage mockup layout,
// while keeping the binding color scale and avoiding photography the
// brief doesn't have real assets for — per the brief: "überwiegend
// Typografie + Fläche + Licht + Farbwelt", which this still honors; the
// mockup's per-phase photo bands aren't backed by real brand photography,
// so color/typography carries the section instead of substituting
// AI-generated imagery.
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
    <section className="relative" style={{ background: "var(--color-circuit-regulate)" }}>
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-20 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-teal-dark">{eyebrow}</p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl">{headline}</h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted">{intro}</p>
      </div>

      {/* Connecting rail: a thin vertical line threading through every
          band's numbered circle, so the four bands read as one journey
          rather than four unrelated blocks. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-ink/10 md:block"
          style={{ maxWidth: "min(100% - 2rem, 72rem)" }}
        />
        {phases.map((phase, i) => {
          const isDark = PHASE_TEXT_ON_DARK[i];
          return (
            <div
              key={phase.name}
              className="relative overflow-hidden transition-colors duration-700 ease-out"
              style={{ background: PHASE_COLORS[i] }}
            >
              <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-14 sm:px-6 md:grid-cols-[auto_1fr_auto] md:gap-12 md:py-20">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-serif text-lg transition-colors duration-700"
                  style={{
                    borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(36,31,41,0.2)",
                    color: isDark ? "#fff" : "var(--color-ink)",
                  }}
                >
                  {phase.number}
                </div>

                <div>
                  <div
                    className="text-xs uppercase tracking-[0.2em] transition-colors duration-700"
                    style={{ color: isDark ? "rgba(255,255,255,0.6)" : "var(--color-teal-dark)" }}
                  >
                    {phase.name} · {phase.time}
                  </div>
                  <h3
                    className="mt-2 font-serif text-2xl italic leading-snug transition-colors duration-700 md:text-3xl"
                    style={{ color: isDark ? "#fff" : "var(--color-ink)" }}
                  >
                    {phase.headline}
                  </h3>
                  <p
                    className="mt-3 max-w-md leading-relaxed transition-colors duration-700"
                    style={{ color: isDark ? "rgba(255,255,255,0.8)" : "var(--color-ink-muted)" }}
                  >
                    {phase.body}
                  </p>
                </div>

                <div
                  className="flex shrink-0 flex-col gap-1.5 text-right text-xs uppercase tracking-[0.1em] transition-colors duration-700 md:text-left"
                  style={{ color: isDark ? "rgba(255,255,255,0.55)" : "var(--color-ink-meta)" }}
                >
                  {phase.orientation.split(" · ").map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="px-4 py-20 text-center transition-colors duration-700 sm:px-6"
        style={{ background: PHASE_COLORS[phases.length - 1] }}
      >
        <p className="font-serif text-xl italic leading-snug text-white">{closing}</p>
        <p className="mt-2 text-sm text-white/60">{closingSub}</p>
      </div>
    </section>
  );
}
