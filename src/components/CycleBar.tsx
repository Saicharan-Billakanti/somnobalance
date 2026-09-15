// A flat, quiet strip of the SomnoBalance cycle stages, used as a section
// header (not the hero) — icon, name and caption stacked per stage over a
// warm tan bar, no gradient/photo, distinct from the hero's own visual
// language.
const icons = [SunIcon, LeafIcon, LeafIcon, LotusIcon, MoonIcon];

export function CycleBar({
  label,
  stages,
}: {
  label: string;
  stages: { name: string; caption?: string }[];
}) {
  return (
    <div className="bg-sand/70 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 sm:px-6">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/40">{label}</span>
      </div>
      <div className="mx-auto mt-4 grid max-w-4xl grid-cols-5 gap-2 px-4 sm:px-6">
        {stages.map((stage, i) => {
          const Icon = icons[i] ?? SunIcon;
          return (
            <div key={stage.name} className="flex flex-col items-center gap-1.5 text-center">
              <Icon />
              <span className="text-[0.6rem] uppercase tracking-[0.1em] text-ink/60 sm:text-[0.65rem]">
                {stage.name}
              </span>
              {stage.caption && (
                <span className="hidden text-[0.7rem] text-ink/40 sm:block">{stage.caption}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-mauve-dark/70" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-mauve-dark/70" aria-hidden="true">
      <path d="M4 20c8-1 13-6 15-15C10 6 5 11 4 20z" />
      <path d="M8 16c3-3 6-6 9-9" />
    </svg>
  );
}

function LotusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-mauve-dark/70" aria-hidden="true">
      <path d="M12 20c-4-1-6-4-6-7 2 1.5 4 2 6 2s4-.5 6-2c0 3-2 6-6 7z" />
      <path d="M12 15c0-4 1.5-7 4-9-3 0-5 1.5-6 4-1-2.5-3-4-6-4 2.5 2 4 5 4 9" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-mauve-dark/70" aria-hidden="true">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  );
}
