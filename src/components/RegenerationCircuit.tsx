import Image from "next/image";

// Homepage Section 3 — "Der SomnoBalance Regenerationskreislauf"
// Four equal panels, light day tone -> rose -> muted violet -> dark night.
// Panel 02 carries the soft water photo and panel 04 the moon photo (kept at
// the owner's request); the violet is darkened so white text stays readable.
const PHASE_COLORS = [
  "linear-gradient(135deg, #f8f3f4 0%, #eaddd7 100%)",
  "linear-gradient(135deg, #e8cdd6 0%, #d3b0b9 100%)",
  "linear-gradient(135deg, #765a78 0%, #4f3d55 100%)",
  "linear-gradient(135deg, #352a3f 0%, #1c1623 100%)",
];

const PHASE_TEXT_ON_DARK = [false, false, true, true];

// Optional photo per panel, with a tint so the text keeps its contrast.
const PHASE_IMAGES: ({ src: string; tint: string } | null)[] = [
  null,
  { src: "/mockup/phase-pink-caustics.webp", tint: "rgba(224, 185, 188, 0.28)" },
  null,
  { src: "/mockup/phase-moon-night.webp", tint: "rgba(18, 14, 25, 0.45)" },
];

type Phase = {
  number: string;
  name: string;
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
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  phases: Phase[];
  closing: string;
}) {
  return (
    <section className="bg-sand">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-24 sm:px-6 md:flex-row md:items-start md:justify-between lg:pt-32">
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
          const photo = PHASE_IMAGES[i];
          return (
            <div
              key={phase.name}
              className="relative flex min-h-[460px] flex-col overflow-hidden lg:min-h-[560px]"
              style={{ background: PHASE_COLORS[i] }}
            >
              {photo && (
                <>
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: photo.tint }} />
                </>
              )}
              <div className="relative z-10 flex flex-1 flex-col p-8 lg:p-12">
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
            </div>
          );
        })}
      </div>

      <div
        className="flex min-h-[160px] items-center justify-center px-4 text-center sm:px-6"
        style={{ background: "var(--color-circuit-regenerate)" }}
      >
        <div>
          <p className="font-serif text-2xl italic leading-snug text-white md:text-3xl lg:text-4xl">{closing}</p>
        </div>
      </div>
    </section>
  );
}
