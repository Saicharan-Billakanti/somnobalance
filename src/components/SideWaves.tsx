// Purely decorative wave ribbons anchored to the page's outer edges — the
// wide gutter beside the centered max-w-6xl content on large screens
// otherwise sits empty. Hidden below lg since there's no gutter to hold
// them. Built from a small repeating SVG pattern (not one path stretched
// over the whole page) so the curve reads as an actual wave at any scroll
// position, regardless of how tall the page is.
function WaveColumn({ flip }: { flip?: boolean }) {
  const id = flip ? "side-wave-right" : "side-wave-left";
  return (
    <svg
      width="96"
      height="100%"
      className={flip ? "scale-x-[-1]" : ""}
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="96" height="240" patternUnits="userSpaceOnUse">
          <path
            d="M60 0 C 20 30, 20 30, 60 60 C 100 90, 100 90, 60 120 C 20 150, 20 150, 60 180 C 100 210, 100 210, 60 240"
            fill="none"
            stroke="var(--color-mauve)"
            strokeOpacity="0.35"
            strokeWidth="3"
          />
          <path
            d="M30 0 C -10 30, -10 30, 30 60 C 70 90, 70 90, 30 120 C -10 150, -10 150, 30 180 C 70 210, 70 210, 30 240"
            fill="none"
            stroke="var(--color-teal)"
            strokeOpacity="0.3"
            strokeWidth="2.5"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width="96" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function SideWaves() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-0 hidden lg:block" aria-hidden="true">
      <div className="absolute inset-y-0 left-0">
        <WaveColumn />
      </div>
      <div className="absolute inset-y-0 right-0">
        <WaveColumn flip />
      </div>
    </div>
  );
}
