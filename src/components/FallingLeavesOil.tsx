import type { CSSProperties } from "react";

// Decorative ambient layer: leaves drifting down and golden oil drops
// falling slowly. Fixed to the viewport so it stays visible while scrolling,
// non-interactive, and hidden for reduced-motion users (see globals.css).
// Parameters are fixed constants (not random) so server and client render
// identically.
const LEAVES = [
  { left: 4, size: 26, dur: 22, delay: -3, sway: 6, color: "#7d8f5c" },
  { left: 13, size: 20, dur: 27, delay: -14, sway: 7, color: "#a9835f" },
  { left: 24, size: 30, dur: 25, delay: -8, sway: 8, color: "#8a9a6a" },
  { left: 37, size: 22, dur: 30, delay: -20, sway: 6, color: "#b08a5c" },
  { left: 49, size: 28, dur: 24, delay: -11, sway: 7, color: "#7d8f5c" },
  { left: 61, size: 21, dur: 29, delay: -5, sway: 8, color: "#a9835f" },
  { left: 72, size: 27, dur: 23, delay: -17, sway: 6, color: "#8a9a6a" },
  { left: 83, size: 23, dur: 28, delay: -9, sway: 7, color: "#b08a5c" },
  { left: 92, size: 29, dur: 26, delay: -22, sway: 8, color: "#7d8f5c" },
];

const DROPS = [
  { left: 8, size: 14, dur: 16, delay: -4, sway: 5 },
  { left: 19, size: 11, dur: 19, delay: -12, sway: 6 },
  { left: 31, size: 16, dur: 17, delay: -8, sway: 5 },
  { left: 44, size: 12, dur: 21, delay: -15, sway: 6 },
  { left: 56, size: 15, dur: 18, delay: -2, sway: 5 },
  { left: 67, size: 11, dur: 20, delay: -10, sway: 6 },
  { left: 78, size: 14, dur: 17, delay: -6, sway: 5 },
  { left: 89, size: 13, dur: 22, delay: -18, sway: 6 },
];

function vars(dur: number, delay: number, sway: number): CSSProperties {
  return {
    ["--dur" as string]: `${dur}s`,
    ["--delay" as string]: `${delay}s`,
    ["--sway" as string]: `${sway}s`,
  };
}

function Leaf({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 2 C 26 8, 27 22, 16 30 C 5 22, 6 8, 16 2 Z"
        fill={color}
        fillOpacity="0.55"
      />
      <path
        d="M16 4 L16 29 M16 12 L21 9 M16 17 L22 14 M16 22 L21 19 M16 12 L11 9 M16 17 L10 14 M16 22 L11 19"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
}

function Drop({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 20 27" aria-hidden="true">
      <defs>
        <linearGradient id="oil-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0c060" />
          <stop offset="1" stopColor="#b8741f" />
        </linearGradient>
      </defs>
      <path
        d="M10 1 C 10 1, 1 12, 1 18 A 9 9 0 0 0 19 18 C 19 12, 10 1, 10 1 Z"
        fill="url(#oil-drop)"
        fillOpacity="0.7"
      />
      <ellipse cx="6.5" cy="17" rx="2" ry="3.2" fill="#fff" fillOpacity="0.55" />
    </svg>
  );
}

export function FallingLeavesOil() {
  return (
    <div
      className="fall-layer pointer-events-none fixed inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      {LEAVES.map((l, i) => (
        <div
          key={`leaf-${i}`}
          className="fall-item"
          style={{ left: `${l.left}%`, ...vars(l.dur, l.delay, l.sway) }}
        >
          <div className="fall-leaf" style={vars(l.dur, l.delay, l.sway)}>
            <Leaf size={l.size} color={l.color} />
          </div>
        </div>
      ))}
      {DROPS.map((d, i) => (
        <div
          key={`drop-${i}`}
          className="fall-item"
          style={{ left: `${d.left}%`, ...vars(d.dur, d.delay, d.sway) }}
        >
          <div className="fall-drop" style={vars(d.dur, d.delay, d.sway)}>
            <Drop size={d.size} />
          </div>
        </div>
      ))}
    </div>
  );
}
