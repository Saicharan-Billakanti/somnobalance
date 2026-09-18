// Purely decorative lotus-flower motifs scattered behind the landing
// page's content, drawn from the site's own mauve/teal/sand palette
// rather than a photo, so they read as background pattern, not imagery.
function LotusMotif({ color, accent }: { color: string; accent: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {petals.map((angle, i) => (
        <path
          key={angle}
          d="M50 50 C 40 32, 42 10, 50 0 C 58 10, 60 32, 50 50 Z"
          fill={i % 2 === 0 ? color : accent}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="var(--color-sand)" />
    </svg>
  );
}

const FLOWERS: {
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  opacity: number;
}[] = [
  { top: "2%", left: "-3%", size: 220, rotate: -12, opacity: 0.16 },
  { top: "22%", right: "-4%", size: 260, rotate: 20, opacity: 0.14 },
  { top: "46%", left: "-5%", size: 180, rotate: 8, opacity: 0.12 },
  { top: "64%", right: "-3%", size: 220, rotate: -18, opacity: 0.15 },
  { top: "86%", left: "-4%", size: 240, rotate: 15, opacity: 0.13 },
  { top: "100%", right: "-2%", size: 200, rotate: -6, opacity: 0.14 },
];

export function LotusField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {FLOWERS.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: f.top,
            left: f.left,
            right: f.right,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            transform: `rotate(${f.rotate}deg)`,
          }}
        >
          <LotusMotif
            color={i % 2 === 0 ? "var(--color-mauve)" : "var(--color-teal)"}
            accent={i % 2 === 0 ? "var(--color-teal)" : "var(--color-mauve)"}
          />
        </div>
      ))}
    </div>
  );
}
