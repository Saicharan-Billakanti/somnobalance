import type { ProductSpecs } from "@/lib/products";

export function ProductSpecRow({ specs }: { specs: ProductSpecs }) {
  const items = [
    { icon: <LeafIcon />, label: specs.format },
    { icon: <BottleIcon />, label: specs.type },
    { icon: <SproutIcon />, label: specs.usage },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-mauve/10 py-4 text-sm text-ink/70">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className="text-mauve-dark/70">{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 20c8-1 13-6 15-15C10 6 5 11 4 20z" />
      <path d="M8 16c3-3 6-6 9-9" />
    </svg>
  );
}

function BottleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 2h4v3.5l2 3V21a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8.5l2-3z" />
      <path d="M9 12h6" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21V10" />
      <path d="M12 10C12 6 9 4 5 4c0 4 2 7 7 6z" />
      <path d="M12 13c0-3.5 2.5-5.5 6-5.5-.2 3.3-2.3 5.8-6 5.5z" />
    </svg>
  );
}
