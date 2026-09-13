// A compact, recurring version of the homepage's cycle strip (brief §14):
// "the visitor should always understand where they are within the
// SomnoBalance principle." Highlights the one stage a given product phase
// maps to along the same TAG → REGULATION → LOSLASSEN → VORBEREITUNG →
// NACHT sequence used in the hero, so the motif reappears as an
// orientation cue rather than existing only once on the homepage.
//
// The brand's 4 product phases don't map one-to-one onto the 5-stage
// cycle (there's no product "for" TAG — it's the problem state, not a
// ritual phase), so REGENERATE is treated as sitting at the NACHT end
// since regeneration is what happens during the night phase, not a
// separate 6th stage.
import type { Product } from "@/lib/products";

const PHASE_TO_STAGE_INDEX: Record<Product["phase"], number> = {
  REGULATE: 1,
  "LET GO": 2,
  PREPARE: 3,
  REGENERATE: 4,
};

export function CyclePosition({
  phase,
  stages,
}: {
  phase: Product["phase"];
  stages: { name: string }[];
}) {
  const activeIndex = PHASE_TO_STAGE_INDEX[phase];

  return (
    <div className="flex items-center gap-1.5" aria-label={stages[activeIndex]?.name}>
      {stages.map((stage, i) => (
        <span
          key={stage.name}
          className={`h-1 rounded-full transition-all ${
            i === activeIndex ? "w-5 bg-mauve" : "w-1.5 bg-mauve/20"
          }`}
        />
      ))}
      <span className="ml-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-ink/40">
        {stages[activeIndex]?.name}
      </span>
    </div>
  );
}
