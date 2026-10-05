export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-mauve/10 bg-white/60 p-5">
      <div className="text-xs uppercase tracking-[0.1em] text-ink/50">{label}</div>
      <div className="mt-2 text-2xl font-medium text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-ink/50">{sub}</div>}
    </div>
  );
}
