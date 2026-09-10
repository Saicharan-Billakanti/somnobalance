export function JourneyStrip({ steps }: { steps: string[] }) {
  return (
    <div className="mt-14 border-t border-mauve/10 pt-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-x-2 sm:gap-x-3">
            <span
              className={`text-[11px] uppercase tracking-[0.2em] ${
                i === 0 || i === steps.length - 1 ? "text-mauve-dark" : "text-ink/40"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-teal/50" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
