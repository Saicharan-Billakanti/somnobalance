// Homepage Section 3 — "Der SomnoBalance Regenerationskreislauf"
const PHASE_GRADIENTS = [
  "linear-gradient(135deg, #eaddd7 0%, #d8c8c2 100%)",
  "linear-gradient(135deg, #d3bab7 0%, #c4a19d 100%)",
  "linear-gradient(135deg, #6c596b 0%, #4b3e4d 100%)",
  "linear-gradient(135deg, #2c2535 0%, #17131d 100%)",
];

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
    <section className="bg-sand">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 pb-12 pt-24 sm:px-6 md:flex-row md:items-start md:justify-between md:px-12 lg:pt-32">
        <div className="md:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{eyebrow}</p>
          <h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {headline}
          </h2>
        </div>
        <div className="md:w-5/12 md:pt-10">
          <p className="max-w-xl text-base leading-relaxed text-ink/70 lg:text-lg lg:leading-loose">
            {intro}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase, i) => {
          const isDark = PHASE_TEXT_ON_DARK[i];
          return (
            <div
              key={phase.name}
              className="flex min-h-[460px] flex-col p-8 lg:min-h-[560px] lg:p-12"
              style={{ background: PHASE_GRADIENTS[i] }}
            >
              <span
                className="font-serif text-lg lg:text-xl"
                style={{ color: isDark ? "rgba(255,255,255,0.9)" : "var(--color-ink)" }}
              >
                {phase.number}
              </span>
              <p
                className="mt-4 font-serif text-sm uppercase tracking-widest"
                style={{
                  color: isDark ? "rgba(255,255,255,0.9)" : "var(--color-ink)",
                }}
              >
                {phase.name}
              </p>
              <h3
                className="mt-4 font-serif text-3xl italic leading-tight"
                style={{ color: isDark ? "#fff" : "var(--color-ink)" }}
              >
                {phase.headline}
              </h3>
              <p
                className="mt-6 text-sm leading-relaxed lg:text-base lg:leading-relaxed"
                style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(36,31,41,0.8)" }}
              >
                {phase.body}
              </p>
              <div className="mt-auto flex flex-col gap-2 pt-12 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
                {phase.orientation.split(" · ").map((word) => (
                  <span key={word} style={{ color: isDark ? "rgba(255,255,255,0.7)" : "var(--color-ink-meta)" }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex min-h-[160px] items-center justify-center bg-gradient-to-r from-[#594d65] to-[#3a3153] px-4 text-center sm:px-6"
      >
        <div>
          <p className="font-serif text-2xl italic leading-snug text-white md:text-3xl lg:text-4xl">{closing}</p>
        </div>
      </div>
    </section>
  );
}
