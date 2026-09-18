// Static botanical sprigs scattered down the page edges as background
// decoration. Not animated; sits behind nothing interactive.
function Sprig({ color }: { color: string }) {
  const leaves = [
    { y: 200, side: -1, s: 1 },
    { y: 165, side: 1, s: 1 },
    { y: 130, side: -1, s: 0.9 },
    { y: 96, side: 1, s: 0.85 },
    { y: 64, side: -1, s: 0.75 },
    { y: 36, side: 1, s: 0.65 },
  ];
  return (
    <svg viewBox="0 0 120 240" className="h-full w-full" aria-hidden="true">
      <path d="M60 236 C 58 170, 62 90, 60 12" stroke={color} strokeWidth="2" fill="none" />
      {leaves.map((l, i) => (
        <path
          key={i}
          d="M0 0 C 14 -12, 34 -12, 46 0 C 34 12, 14 12, 0 0 Z"
          fill={color}
          transform={`translate(60 ${l.y}) rotate(${l.side < 0 ? 200 : -20}) scale(${l.s})`}
        />
      ))}
      <path
        d="M0 0 C 8 -8, 18 -8, 26 0 C 18 8, 8 8, 0 0 Z"
        fill={color}
        transform="translate(60 12) rotate(-90)"
      />
    </svg>
  );
}

const SPRIGS: {
  top: string;
  left?: string;
  right?: string;
  w: number;
  h: number;
  rotate: number;
  opacity: number;
  color: string;
}[] = [
  { top: "1%", left: "-1%", w: 150, h: 300, rotate: 18, opacity: 0.22, color: "#7d8f5c" },
  { top: "12%", right: "-2%", w: 170, h: 340, rotate: -22, opacity: 0.2, color: "#a9835f" },
  { top: "30%", left: "-2%", w: 140, h: 280, rotate: -14, opacity: 0.2, color: "#8a9a6a" },
  { top: "47%", right: "-1%", w: 160, h: 320, rotate: 26, opacity: 0.22, color: "#7d8f5c" },
  { top: "64%", left: "-1%", w: 170, h: 340, rotate: 12, opacity: 0.2, color: "#a9835f" },
  { top: "80%", right: "-2%", w: 150, h: 300, rotate: -18, opacity: 0.2, color: "#8a9a6a" },
];

export function LeafBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {SPRIGS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.w,
            height: s.h,
            opacity: s.opacity,
            transform: `rotate(${s.rotate}deg)`,
          }}
        >
          <Sprig color={s.color} />
        </div>
      ))}
    </div>
  );
}
