"use client";

// Homepage Section 3 — "Der SomnoBalance Regenerationskreislauf", per
// SomnoBalance_Startseite_Abschnitte-2-5.docx (2026-09-30). Four phases
// experienced one after another while scrolling, with the background
// color/light shifting through the brief's mandatory four-tone scale
// (light at REGULIEREN, deepest at REGENERIEREN, lightening again at the
// closing line). Deliberately no four-card grid, no icons, no photos —
// per the brief: "überwiegend Typografie + Fläche + Licht + Farbwelt".
// Desktop keeps a sticky phase strip while the active phase is driven by
// IntersectionObserver as each phase block crosses the viewport center;
// mobile gets the same stacked blocks with no sticky strip, scrolling
// straight through — both read identically, just without the side rail.
import { useEffect, useRef, useState } from "react";

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
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActive(index);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isDark = PHASE_TEXT_ON_DARK[active];

  return (
    <section
      className="relative transition-colors duration-700 ease-out"
      style={{ background: PHASE_COLORS[active] }}
    >
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p
          className="text-xs uppercase tracking-[0.2em] transition-colors duration-700"
          style={{ color: isDark ? "rgba(255,255,255,0.6)" : "var(--color-teal-dark)" }}
        >
          {eyebrow}
        </p>
        <h2
          className="mt-4 max-w-2xl font-serif text-3xl leading-tight transition-colors duration-700 md:text-4xl"
          style={{ color: isDark ? "#fff" : "var(--color-ink)" }}
        >
          {headline}
        </h2>
        <p
          className="mt-6 max-w-xl text-base leading-relaxed transition-colors duration-700"
          style={{ color: isDark ? "rgba(255,255,255,0.75)" : "var(--color-ink-muted)" }}
        >
          {intro}
        </p>
      </div>

      {/* Sticky phase rail — desktop only; mobile relies on the stacked
          blocks reading top to bottom with no side navigation. */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-16">
        <div className="hidden lg:block">
          <div className="sticky top-32 flex flex-col gap-6">
            {phases.map((phase, i) => (
              <div key={phase.name} className="flex items-center gap-3">
                <span
                  className="h-px flex-1 max-w-6 transition-colors duration-700"
                  style={{
                    background: i === active
                      ? isDark ? "#fff" : "var(--color-mauve)"
                      : isDark ? "rgba(255,255,255,0.25)" : "rgba(36,31,41,0.2)",
                  }}
                />
                <span
                  className="text-xs uppercase tracking-[0.15em] transition-colors duration-700"
                  style={{
                    color: i === active
                      ? isDark ? "#fff" : "var(--color-ink)"
                      : isDark ? "rgba(255,255,255,0.45)" : "var(--color-ink-meta)",
                    fontWeight: i === active ? 600 : 400,
                  }}
                >
                  {phase.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-28 lg:gap-40">
          {phases.map((phase, i) => (
            <div
              key={phase.name}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className="min-h-[50vh] max-w-xl"
            >
              <div
                className="text-xs uppercase tracking-[0.2em] transition-colors duration-700"
                style={{ color: PHASE_TEXT_ON_DARK[i] ? "rgba(255,255,255,0.55)" : "var(--color-ink-meta)" }}
              >
                {phase.number} · {phase.name} · {phase.time}
              </div>
              <h3
                className="mt-4 font-serif text-2xl leading-snug transition-colors duration-700 md:text-3xl"
                style={{ color: PHASE_TEXT_ON_DARK[i] ? "#fff" : "var(--color-ink)" }}
              >
                {phase.headline}
              </h3>
              <p
                className="mt-4 leading-relaxed transition-colors duration-700"
                style={{ color: PHASE_TEXT_ON_DARK[i] ? "rgba(255,255,255,0.8)" : "var(--color-ink-muted)" }}
              >
                {phase.body}
              </p>
              <p
                className="mt-5 text-xs uppercase tracking-[0.15em] transition-colors duration-700"
                style={{ color: PHASE_TEXT_ON_DARK[i] ? "rgba(255,255,255,0.5)" : "var(--color-ink-meta)" }}
              >
                {phase.orientation}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-4 text-center sm:px-6">
        <p
          className="font-serif text-xl italic leading-snug transition-colors duration-700"
          style={{ color: isDark ? "#fff" : "var(--color-mauve)" }}
        >
          {closing}
        </p>
        <p
          className="mt-2 text-sm transition-colors duration-700"
          style={{ color: isDark ? "rgba(255,255,255,0.6)" : "var(--color-ink-muted)" }}
        >
          {closingSub}
        </p>
      </div>
    </section>
  );
}
