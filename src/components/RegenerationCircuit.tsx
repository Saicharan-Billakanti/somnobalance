import Image from "next/image";

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
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  phases: Phase[];
  closing: string;
  closingSub?: string;
}) {
  return (
    <section className="bg-[#f7f5ef]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 pb-12 pt-24 sm:px-6 md:flex-row md:items-start md:justify-between md:px-12 lg:pt-32">
        <div className="md:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{eyebrow}</p>
          <h2 className="mt-5 max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {headline}
          </h2>
        </div>
        <div className="md:w-5/12 md:pt-10">
          <p className="max-w-xl text-base leading-relaxed text-ink/75 lg:text-lg lg:leading-loose">
            {intro}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase, i) => {
          // Phase 01: Sand ripple background
          // Phase 02: Pink water caustics image
          // Phase 03: Twilight lavender gradient
          // Phase 04: Crescent moon starry night sky
          const isDark = i >= 2;
          const bgImage =
            i === 1
              ? "/mockup/phase-pink-caustics.webp"
              : i === 3
              ? "/mockup/phase-moon-night.webp"
              : null;

          return (
            <div
              key={phase.name}
              className="relative flex min-h-[480px] flex-col overflow-hidden p-8 lg:min-h-[580px] lg:p-12"
              style={{
                background:
                  i === 0
                    ? "linear-gradient(135deg, #eae2d8 0%, #dbccc2 100%)"
                    : i === 2
                    ? "linear-gradient(135deg, #67556b 0%, #46374a 100%)"
                    : undefined,
              }}
            >
              {bgImage && (
                <>
                  <Image
                    src={bgImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor:
                        i === 1 ? "rgba(224, 185, 188, 0.28)" : "rgba(18, 14, 25, 0.45)",
                    }}
                  />
                </>
              )}

              <div className="relative z-10 flex h-full flex-col">
                <span
                  className="font-serif text-lg lg:text-xl font-normal"
                  style={{ color: isDark ? "rgba(255,255,255,0.9)" : "var(--color-ink)" }}
                >
                  {phase.number}
                </span>
                <p
                  className="mt-4 font-sans text-xs uppercase tracking-[0.25em] font-semibold"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.85)" : "rgba(36,31,41,0.75)",
                  }}
                >
                  {phase.name}
                </p>
                <h3
                  className="mt-4 font-serif text-2xl sm:text-3xl italic leading-tight"
                  style={{ color: isDark ? "#ffffff" : "var(--color-ink)" }}
                >
                  {phase.headline}
                </h3>
                <p
                  className="mt-6 text-sm leading-relaxed lg:text-base lg:leading-relaxed"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.85)" : "rgba(36,31,41,0.78)",
                  }}
                >
                  {phase.body}
                </p>
                <div className="mt-auto flex flex-col gap-2 pt-12 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
                  {phase.orientation.split(" · ").map((word) => (
                    <span
                      key={word}
                      style={{
                        color: isDark ? "rgba(255,255,255,0.7)" : "rgba(36,31,41,0.6)",
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sunrise panoramic horizon banner */}
      <div className="relative min-h-[220px] sm:min-h-[260px] w-full overflow-hidden flex items-center justify-center px-6 py-12 text-center">
        <Image
          src="/mockup/sunrise-horizon.webp"
          alt="Sunrise landscape"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#44334f]/70 via-[#543b59]/50 to-[#3c2947]/70" />
        <div className="relative z-10 max-w-3xl">
          <p className="font-serif text-2xl italic leading-snug text-white sm:text-3xl lg:text-4xl drop-shadow-md">
            {closing}
          </p>
        </div>
      </div>
    </section>
  );
}
