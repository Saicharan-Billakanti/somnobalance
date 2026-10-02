// Backend logic for the SomnoBalance Regenerationscheck, implemented from
// the client's spec (SomnoBalance_Regenerationscheck_FINAL_Webdesigner.docx,
// sections 5, 6, and 10). Runs entirely client-side — nothing here is ever
// persisted, matching the doc's privacy guidance (section 13).

export type Locale = "de" | "en";

export type ProfileKey =
  | "ruhe"
  | "schlaf"
  | "kraft"
  | "balance"
  | "emotionen"
  | "gedanken"
  | "halt"
  | "klarheit"
  | "gelassenheit"
  | "regeneration";

export type Answers = Record<string, number>; // "q01".."q20" -> 0..4

export const QUESTION_IDS = Array.from({ length: 20 }, (_, i) => `q${String(i + 1).padStart(2, "0")}`);

// Backend question -> profile assignment (doc section 3). Two questions
// per profile, in fixed pairs.
export const QUESTION_PROFILE: Record<string, ProfileKey> = {
  q01: "ruhe",
  q02: "ruhe",
  q03: "schlaf",
  q04: "schlaf",
  q05: "kraft",
  q06: "kraft",
  q07: "balance",
  q08: "balance",
  q09: "emotionen",
  q10: "emotionen",
  q11: "gedanken",
  q12: "gedanken",
  q13: "halt",
  q14: "halt",
  q15: "klarheit",
  q16: "klarheit",
  q17: "gelassenheit",
  q18: "gelassenheit",
  q19: "regeneration",
  q20: "regeneration",
};

// Tie-break priority, highest first (doc section 6) — used only to make
// the "highest score" pick deterministic when scores are equal, never
// shown to the customer or treated as a medical ranking.
const TIE_BREAK_PRIORITY: ProfileKey[] = [
  "schlaf",
  "balance",
  "ruhe",
  "gedanken",
  "gelassenheit",
  "kraft",
  "emotionen",
  "halt",
  "klarheit",
  "regeneration",
];

export type ScoreResult = {
  scores: Record<ProfileKey, number>;
  primary: ProfileKey;
  secondary: ProfileKey | null;
  showSecondary: boolean;
  elevatedCount: number;
  isLowScoreResult: boolean;
};

export function computeScores(answers: Answers): ScoreResult {
  const scores = {} as Record<ProfileKey, number>;
  for (const key of TIE_BREAK_PRIORITY) scores[key] = 0;

  for (const qid of QUESTION_IDS) {
    const profile = QUESTION_PROFILE[qid];
    const value = answers[qid] ?? 0;
    scores[profile] += value;
  }

  const maxScore = Math.max(...Object.values(scores));
  const isLowScoreResult = maxScore <= 2;

  // Highest score wins; ties broken by TIE_BREAK_PRIORITY order.
  const ranked = [...TIE_BREAK_PRIORITY].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return TIE_BREAK_PRIORITY.indexOf(a) - TIE_BREAK_PRIORITY.indexOf(b);
  });

  const primary = ranked[0];
  const secondaryCandidate = ranked[1];
  const showSecondary =
    scores[secondaryCandidate] >= 5 && scores[primary] - scores[secondaryCandidate] <= 2;

  const elevatedCount = Object.values(scores).filter((s) => s >= 5).length;

  return {
    scores,
    primary,
    secondary: showSecondary ? secondaryCandidate : null,
    showSecondary,
    elevatedCount,
    isLowScoreResult,
  };
}

export type ProductRef = { slug: string; label: string };

// Primary product/addon per profile (doc section 9), overridden by the
// "elevated_count >= 3" rule (section 5/10) which the caller applies.
export const PRIMARY_PRODUCT_MAP: Record<ProfileKey, ProductRef> = {
  ruhe: { slug: "somnobalance-regeneration-cards", label: "SomnoBalance Regenerationskarten" },
  schlaf: { slug: "somnobalance-starter-set", label: "SomnoBalance Ritual Collection / Starter-Set" },
  kraft: { slug: "somnobalance-regeneration-cards", label: "SomnoBalance Regenerationskarten" },
  balance: { slug: "somnobalance-regeneration-cards", label: "SomnoBalance Regenerationskarten" },
  emotionen: { slug: "somnobalance-roll-on", label: "SomnoBalance Roll-on" },
  gedanken: { slug: "somnobalance-regeneration-cards", label: "SomnoBalance Regenerationskarten" },
  halt: { slug: "somnobalance-regeneration-cards", label: "SomnoBalance Regenerationskarten" },
  klarheit: { slug: "somnobalance-regeneration-cards", label: "SomnoBalance Regenerationskarten" },
  gelassenheit: { slug: "somnobalance-roll-on", label: "SomnoBalance Roll-on" },
  regeneration: { slug: "somnobalance-starter-set", label: "SomnoBalance Starter-Set / Ritual Collection" },
};

export const PRIMARY_ADDON_MAP: Record<ProfileKey, ProductRef | ProductRef[]> = {
  ruhe: { slug: "somnobalance-roll-on", label: "Roll-on" },
  schlaf: { slug: "somnobalance-regeneration-tea", label: "Regenerationstee" },
  kraft: [
    { slug: "somnobalance-oil-blend", label: "Ölmischung" },
    { slug: "somnobalance-roll-on", label: "Roll-on" },
  ],
  balance: { slug: "somnobalance-roll-on", label: "Roll-on" },
  emotionen: { slug: "somnobalance-regeneration-cards", label: "Regenerationskarten" },
  gedanken: { slug: "somnobalance-roll-on", label: "Roll-on" },
  halt: { slug: "somnobalance-roll-on", label: "Roll-on" },
  klarheit: { slug: "somnobalance-roll-on", label: "Roll-on" },
  gelassenheit: { slug: "somnobalance-regeneration-cards", label: "Regenerationskarten" },
  regeneration: { slug: "somnobalance-regeneration-cards", label: "Regenerationskarten" },
};

// Elevated-count override (doc section 5/10): 3+ profiles at score >=5
// widens the recommendation regardless of which profile is primary.
export const ELEVATED_PRODUCT: ProductRef = {
  slug: "somnobalance-starter-set",
  label: "SomnoBalance Starter-Set / Ritual Collection",
};
export const ELEVATED_ADDON: ProductRef = {
  slug: "somnobalance-regeneration-cards",
  label: "SomnoBalance Regenerationskarten",
};

export function resolveProduct(result: ScoreResult): { product: ProductRef; addon: ProductRef | ProductRef[] } {
  if (result.elevatedCount >= 3) {
    return { product: ELEVATED_PRODUCT, addon: ELEVATED_ADDON };
  }
  return {
    product: PRIMARY_PRODUCT_MAP[result.primary],
    addon: PRIMARY_ADDON_MAP[result.primary],
  };
}
