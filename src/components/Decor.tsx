export function RingMotif({
  className = "",
  tone = "mauve",
}: {
  className?: string;
  tone?: "mauve" | "teal";
}) {
  const ring = tone === "mauve" ? "border-mauve/25" : "border-teal/30";
  const ring2 = tone === "mauve" ? "border-teal/25" : "border-mauve/20";
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className="relative h-[520px] w-[520px]">
        <div className={`absolute inset-0 rounded-full border ${ring}`} />
        <div className={`absolute inset-[13%] rounded-full border ${ring}`} />
        <div className={`absolute inset-[26%] rounded-full border ${ring2}`} />
        <div className={`absolute inset-[39%] rounded-full border ${ring2}`} />
      </div>
    </div>
  );
}

export function Blobs() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full bg-teal/25 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-32 h-[380px] w-[380px] rounded-full bg-mauve/25 blur-[100px]"
        aria-hidden="true"
      />
    </>
  );
}

export function PageEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-mauve/25 bg-white/80 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-teal-dark shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-teal" />
      {children}
    </span>
  );
}

export const TINTS = ["mauve", "teal", "ink"] as const;
export type Tint = (typeof TINTS)[number];

export function tintClasses(tint: Tint) {
  switch (tint) {
    case "mauve":
      return {
        border: "border-mauve/15",
        bg: "bg-mauve/5 hover:bg-mauve/10",
        bar: "bg-mauve",
        icon: "bg-mauve/10 text-mauve-dark group-hover:bg-mauve group-hover:text-white",
      };
    case "teal":
      return {
        border: "border-teal/15",
        bg: "bg-teal/5 hover:bg-teal/10",
        bar: "bg-teal",
        icon: "bg-teal/10 text-teal-dark group-hover:bg-teal group-hover:text-white",
      };
    case "ink":
      return {
        border: "border-ink/10",
        bg: "bg-ink/[0.03] hover:bg-ink/[0.06]",
        bar: "bg-ink/40",
        icon: "bg-ink/[0.06] text-ink/70 group-hover:bg-ink/70 group-hover:text-white",
      };
  }
}
