/**
 * SomnoBalance® Regenerationscheck Backend Evaluation Engine
 * Pure backend scoring, non-diagnostic wellness self-reflection.
 *
 * SPEC COMPLIANCE:
 * - 20 questions with 5-point scale (0..4).
 * - 10 subscales (0..8).
 * - Tie-break priority: schlaf > balance > ruhe > gedanken > gelassenheit > kraft > emotionen > halt > klarheit > regeneration.
 * - Secondary focus if secondary.score >= 5 and (primary.score - secondary.score) <= 2.
 * - Multi-elevated (>=3 scores >= 5) switches main product to Starter-Set & addon to Regenerationskarten.
 * - Low-score (max <= 2) triggers preventive resource result.
 * - Never returns or leaks numerical scores, rank percentages, or diagnostic terms.
 */

export type ScaleValue = 0 | 1 | 2 | 3 | 4;

export type SubscaleKey =
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

export const TIE_BREAK_PRIORITY: SubscaleKey[] = [
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

export type QuestionDefinition = {
  id: string; // "q01" .. "q20"
  index: number; // 1 .. 20
  subscale: SubscaleKey;
  text: {
    de: string;
    en: string;
  };
};

export const CHECK_QUESTIONS: QuestionDefinition[] = [
  {
    id: "q01",
    index: 1,
    subscale: "ruhe",
    text: {
      de: "Wenn der Tag ruhiger wird, fällt es mir trotzdem schwer, innerlich abzuschalten.",
      en: "When the day winds down, I still find it difficult to mentally switch off.",
    },
  },
  {
    id: "q02",
    index: 2,
    subscale: "ruhe",
    text: {
      de: "Auch wenn außen Ruhe ist, sind meine Gedanken noch lange aktiv.",
      en: "Even when my surroundings are quiet, my thoughts remain active for a long time.",
    },
  },
  {
    id: "q03",
    index: 3,
    subscale: "schlaf",
    text: {
      de: "Am Abend brauche ich lange, bis ich wirklich zur Ruhe komme und einschlafen kann.",
      en: "In the evening, it takes me a long time to truly settle down and fall asleep.",
    },
  },
  {
    id: "q04",
    index: 4,
    subscale: "schlaf",
    text: {
      de: "Am Morgen wünsche ich mir häufiger, erholter und regenerierter aufzuwachen.",
      en: "In the morning, I often wish I would wake up feeling more rested and regenerated.",
    },
  },
  {
    id: "q05",
    index: 5,
    subscale: "kraft",
    text: {
      de: "Im Alltag fehlt mir häufiger die Energie, die ich eigentlich gerne hätte.",
      en: "During everyday life, I often lack the energy I would like to have.",
    },
  },
  {
    id: "q06",
    index: 6,
    subscale: "kraft",
    text: {
      de: "Meine Kraftreserven fühlen sich schneller aufgebraucht an, als mir guttut.",
      en: "My energy reserves feel depleted faster than is good for me.",
    },
  },
  {
    id: "q07",
    index: 7,
    subscale: "balance",
    text: {
      de: "Wenn vieles gleichzeitig auf mich zukommt, verliere ich schnell meine innere Ruhe.",
      en: "When multiple demands hit me at once, I quickly lose my inner calm.",
    },
  },
  {
    id: "q08",
    index: 8,
    subscale: "balance",
    text: {
      de: "Nach anstrengenden Situationen brauche ich länger, bis ich mich wieder ausgeglichener fühle.",
      en: "After demanding situations, it takes me longer to feel balanced again.",
    },
  },
  {
    id: "q09",
    index: 9,
    subscale: "emotionen",
    text: {
      de: "Manche Situationen beschäftigen mich emotional noch lange, nachdem sie eigentlich vorbei sind.",
      en: "Certain situations occupy me emotionally long after they are actually over.",
    },
  },
  {
    id: "q10",
    index: 10,
    subscale: "emotionen",
    text: {
      de: "Es fällt mir schwer, Ärger, Enttäuschungen oder belastende Gefühle innerlich loszulassen.",
      en: "I find it hard to internally let go of anger, disappointment, or heavy emotions.",
    },
  },
  {
    id: "q11",
    index: 11,
    subscale: "gedanken",
    text: {
      de: "Manche Gedanken kehren immer wieder zurück, obwohl ich sie gerne ruhen lassen würde.",
      en: "Some thoughts keep returning even though I would like to lay them to rest.",
    },
  },
  {
    id: "q12",
    index: 12,
    subscale: "gedanken",
    text: {
      de: "Ich ertappe mich dabei, dieselben Situationen, Fragen oder Möglichkeiten immer wieder durchzugehen.",
      en: "I catch myself replaying the same situations, questions, or possibilities over and over.",
    },
  },
  {
    id: "q13",
    index: 13,
    subscale: "halt",
    text: {
      de: "Wenn es schwierig wird, verliere ich schneller mein Gefühl von innerer Sicherheit.",
      en: "When things get tough, I lose my sense of inner groundedness more quickly.",
    },
  },
  {
    id: "q14",
    index: 14,
    subscale: "halt",
    text: {
      de: "Gerade in herausfordernden Momenten wünsche ich mir mehr Stabilität und Vertrauen in mich selbst.",
      en: "Especially in challenging moments, I wish for greater stability and self-trust.",
    },
  },
  {
    id: "q15",
    index: 15,
    subscale: "klarheit",
    text: {
      de: "Wenn viele Gedanken gleichzeitig da sind, fällt es mir schwerer, klare Entscheidungen zu treffen.",
      en: "When many thoughts crowd in simultaneously, making clear decisions becomes harder.",
    },
  },
  {
    id: "q16",
    index: 16,
    subscale: "klarheit",
    text: {
      de: "Bei vielen Informationen oder Möglichkeiten verliere ich manchmal den Blick für das, was gerade wirklich wichtig ist.",
      en: "With abundant information or options, I sometimes lose sight of what is truly essential right now.",
    },
  },
  {
    id: "q17",
    index: 17,
    subscale: "gelassenheit",
    text: {
      de: "Ich habe häufig das Gefühl, innerlich unter Strom zu stehen.",
      en: "I often feel internally wound up or constantly on edge.",
    },
  },
  {
    id: "q18",
    index: 18,
    subscale: "gelassenheit",
    text: {
      de: "Kleine Dinge bringen mich schneller aus meiner Ruhe, als ich es eigentlich möchte.",
      en: "Small disruptions throw me off balance faster than I would like.",
    },
  },
  {
    id: "q19",
    index: 19,
    subscale: "regeneration",
    text: {
      de: "Bewusste Momente nur für meine eigene Regeneration kommen in meinem Alltag häufig zu kurz.",
      en: "Conscious pauses dedicated purely to my own regeneration are often neglected in my routine.",
    },
  },
  {
    id: "q20",
    index: 20,
    subscale: "regeneration",
    text: {
      de: "Ich wünsche mir ein einfaches Ritual, das mir hilft, im Alltag immer wieder bewusst innezuhalten.",
      en: "I wish for a simple ritual that helps me pause with intention throughout the day.",
    },
  },
];

export const ANSWER_OPTIONS = [
  { value: 0, label: { de: "Gar nicht", en: "Not at all" } },
  { value: 1, label: { de: "Selten", en: "Rarely" } },
  { value: 2, label: { de: "Manchmal", en: "Sometimes" } },
  { value: 3, label: { de: "Häufig", en: "Often" } },
  { value: 4, label: { de: "Sehr häufig", en: "Very often" } },
];

export type ProductRecommendation = {
  slug: string;
  name: string;
  subtitle: string;
  url: string;
  image: string;
};

export type ProfileDefinition = {
  key: SubscaleKey;
  name: { de: string; en: string };
  headline: { de: string; en: string };
  narrative: { de: string; en: string };
  ritualName: { de: string; en: string };
  ritualSteps: { de: string[]; en: string[] };
  essence: { de: string; en: string };
  primaryProduct: ProductRecommendation;
  addonProduct: ProductRecommendation;
  ctaButtonText: { de: string; en: string };
  secondaryShortDescription: { de: string; en: string };
};

export const PROFILES: Record<SubscaleKey, ProfileDefinition> = {
  ruhe: {
    key: "ruhe",
    name: { de: "Ruhe finden", en: "Finding Calm" },
    headline: {
      de: "Wenn es außen still wird, aber innen noch viel passiert.",
      en: "When the outside falls quiet, but inside thoughts are still moving.",
    },
    narrative: {
      de: "Ein voller Tag endet nicht immer dann, wenn die Aufgaben erledigt sind. Gedanken bleiben. Eindrücke wirken nach. Der Kopf ist noch unterwegs, obwohl du längst zur Ruhe kommen möchtest. Deine Antworten zeigen, dass bewusstes Abschalten und mentale Ruhe im Moment besonders viel Raum in deinem Alltag einnehmen.",
      en: "A full day doesn't always end when tasks are checked off. Thoughts linger and impressions resonate. Your mind remains in motion even though you wish to settle down. Your responses indicate that conscious unwinding and mental stillness are especially meaningful right now.",
    },
    ritualName: { de: "Ruhe finden", en: "Finding Calm" },
    ritualSteps: {
      de: ["Geist sammeln", "Gedanken beruhigen", "Neue Perspektiven finden"],
      en: ["Centering the mind", "Soothing thoughts", "Finding fresh perspective"],
    },
    essence: {
      de: "Nicht mehr leisten. Nicht mehr lösen. Für einen Augenblick einfach ankommen.",
      en: "No more striving. No more solving. For a moment, simply arrive.",
    },
    primaryProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "13 Regenerationspunkte & 10 geführte Rituale",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    addonProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Aromatischer Duftmoment für unterwegs",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    ctaButtonText: {
      de: "REGENERATIONSKARTEN ENTDECKEN",
      en: "DISCOVER REGENERATION CARDS",
    },
    secondaryShortDescription: {
      de: "Gedanken und inneres Abschalten begleiten dich ebenfalls als wichtiges Thema.",
      en: "Quietening thoughts and mental unwinding are also present as a meaningful focus.",
    },
  },

  schlaf: {
    key: "schlaf",
    name: { de: "Erholsam schlafen", en: "Restful Sleep" },
    headline: {
      de: "Wenn der Tag endet, darf auch das Tun enden.",
      en: "When the day ends, doing may also end.",
    },
    narrative: {
      de: "Manchmal liegt der Körper längst im Bett, während der Tag innerlich noch weitergeht. Gedanken sind noch da. Anspannung klingt nach. Und aus dem Wunsch, endlich schlafen zu müssen, entsteht noch mehr Unruhe. Deine Antworten zeigen, dass der Übergang vom Tag in die Nacht im Moment mehr Aufmerksamkeit bekommen darf.",
      en: "Sometimes your body has arrived in bed, yet your mind is still processing the day. Tensions echo and the pressure to fall asleep creates further restlessness. Your responses show that smoothing the transition from day to night deserves gentle attention.",
    },
    ritualName: { de: "Erholsam schlafen", en: "Restful Sleep" },
    ritualSteps: {
      de: ["Schlaf finden", "Herz beruhigen", "Erdung finden"],
      en: ["Finding sleep", "Calming the heart", "Grounded stillness"],
    },
    essence: {
      de: "Nicht schlafen müssen. Erst einmal nur zur Ruhe kommen.",
      en: "No requirement to force sleep. First, simply ease into stillness.",
    },
    primaryProduct: {
      slug: "somnobalance-starter-set",
      name: "SomnoBalance Starter-Set / Ritual Collection",
      subtitle: "Das vollständige Abendritual für tiefen Schlaf",
      url: "/shop/somnobalance-starter-set",
      image: "/products/somnobalance-starter-set.jpg",
    },
    addonProduct: {
      slug: "somnobalance-regeneration-tea",
      name: "SomnoBalance Regenerationstee",
      subtitle: "Kräuter- & Gewürzmischung für den Abend",
      url: "/shop/somnobalance-regeneration-tea",
      image: "/products/somnobalance-regeneration-tea.jpg",
    },
    ctaButtonText: {
      de: "ABENDRITUAL ENTDECKEN",
      en: "DISCOVER EVENING RITUAL",
    },
    secondaryShortDescription: {
      de: "Der Übergang in eine erholsame Nachtruhe ist ein weiterer spürbarer Schwerpunkt.",
      en: "Transitioning smoothly into restful night sleep is another noticeable focus.",
    },
  },

  kraft: {
    key: "kraft",
    name: { de: "Neue Kraft schöpfen", en: "Gathering Strength" },
    headline: {
      de: "Manchmal braucht neue Kraft zuerst eine Pause.",
      en: "Sometimes new strength requires a mindful pause first.",
    },
    narrative: {
      de: "Wenn der Alltag viel fordert, kann irgendwann das Gefühl entstehen, ständig aus den eigenen Reserven zu leben. Du funktionierst. Du erledigst. Du machst weiter. Deine Antworten zeigen, dass bewusste Regeneration und neue Energie im Moment mehr Raum bekommen dürfen.",
      en: "When daily demands accumulate, you can feel as though you are continually drawing on your reserves. You function, deliver, and push forward. Your responses indicate that conscious regeneration and rebuilding vitality deserve more space.",
    },
    ritualName: { de: "Neue Kraft schöpfen", en: "Gathering Strength" },
    ritualSteps: {
      de: ["Innere Mitte stärken", "Kraft schöpfen", "Erdung finden"],
      en: ["Strengthening the core", "Drawing strength", "Finding groundedness"],
    },
    essence: {
      de: "Ein Moment zum Innehalten. Damit aus Pause wieder Kraft werden darf.",
      en: "A moment to pause, allowing rest to transform into genuine strength.",
    },
    primaryProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Geführte Akupressurpunkte zur Stärkung der inneren Energie",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    addonProduct: {
      slug: "somnobalance-oil-blend",
      name: "SomnoBalance Ölmischung / Roll-on",
      subtitle: "100% reine ätherische Öle für Raum & Diffuser",
      url: "/shop/somnobalance-oil-blend",
      image: "/products/somnobalance-oil-blend.jpg",
    },
    ctaButtonText: {
      de: "REGENERATIONSKARTEN ENTDECKEN",
      en: "DISCOVER REGENERATION CARDS",
    },
    secondaryShortDescription: {
      de: "Das Wiederauffüllen deiner Kraftreserven zeigt sich ebenfalls in deinen Antworten.",
      en: "Replenishing your energy reserves is also clearly reflected in your responses.",
    },
  },

  balance: {
    key: "balance",
    name: { de: "Innere Balance", en: "Inner Balance" },
    headline: {
      de: "Wenn vieles gleichzeitig da ist, darfst du wieder bei dir beginnen.",
      en: "When multiple demands coincide, you may return home to yourself.",
    },
    narrative: {
      de: "Termine. Erwartungen. Entscheidungen. Menschen. Manchmal wird das Außen so laut, dass es schwerer wird, die eigene Mitte noch wahrzunehmen. Deine Antworten zeigen, dass innere Ruhe und Stabilität gerade besonders wichtig für dich sein könnten.",
      en: "Schedules, expectations, decisions, and external stimuli. When external noise peaks, tuning into your own center becomes difficult. Your answers highlight that inner equilibrium and stability are particularly vital for you right now.",
    },
    ritualName: { de: "Innere Balance", en: "Inner Balance" },
    ritualSteps: {
      de: ["Innere Mitte stärken", "Inneren Halt finden", "Gelassenheit finden", "Erdung finden"],
      en: ["Centering the core", "Inner steadying", "Cultivating ease", "Groundedness"],
    },
    essence: {
      de: "Nicht alles gleichzeitig lösen. Erst einmal wieder ankommen.",
      en: "No need to solve everything at once. First, arrive back in your center.",
    },
    primaryProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Schritt-für-Schritt Punkte & Rituale für Ausgeglichenheit",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    addonProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Unterstützung für bewusste Mikropausen im Alltag",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    ctaButtonText: {
      de: "DEIN RITUAL ENTDECKEN",
      en: "DISCOVER YOUR RITUAL",
    },
    secondaryShortDescription: {
      de: "Das Zurückfinden in die eigene Mitte ist ein wichtiger Begleiter deines Profils.",
      en: "Returning to your center is an important complementary aspect of your profile.",
    },
  },

  emotionen: {
    key: "emotionen",
    name: { de: "Emotionen loslassen", en: "Releasing Emotions" },
    headline: {
      de: "Nicht alles, was dich berührt, muss bei dir bleiben.",
      en: "Not everything that touches you needs to stay with you.",
    },
    narrative: {
      de: "Manche Begegnungen sind längst vorbei und wirken trotzdem nach. Ein Gespräch. Eine Enttäuschung. Ein Konflikt. Ein Gefühl, das sich nicht einfach abschütteln lässt. Deine Antworten zeigen, dass emotionales Loslassen im Moment ein wichtiger Regenerationsbereich für dich sein kann.",
      en: "Certain conversations, conflicts, or disappointments remain vivid long after they have passed. Your responses suggest that emotional release and spaciousness can be a profoundly restorative focus for you.",
    },
    ritualName: { de: "Emotionen loslassen", en: "Releasing Emotions" },
    ritualSteps: {
      de: ["Herz beruhigen", "Emotionen loslassen", "Erdung finden"],
      en: ["Soothing the heart", "Releasing emotions", "Grounded integration"],
    },
    essence: {
      de: "Nicht verdrängen. Nicht verändern müssen. Wahrnehmen. Und wieder Raum entstehen lassen.",
      en: "No suppression. No forced change. Simply observe and create space.",
    },
    primaryProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Beruhigende Duftkomposition für emotionale Entlastung",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    addonProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Regenerationspunkte zum Beruhigen des Herzens",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    ctaButtonText: {
      de: "ROLL-ON ENTDECKEN",
      en: "DISCOVER ROLL-ON",
    },
    secondaryShortDescription: {
      de: "Emotionales Loslassen und Raumschaffen ist ein weiterer sichtbarer Aspekt.",
      en: "Letting go of emotional weight and finding space is another visible theme.",
    },
  },

  gedanken: {
    key: "gedanken",
    name: { de: "Gedanken loslassen", en: "Letting Go of Thoughts" },
    headline: {
      de: "Nicht jeder Gedanke braucht eine Antwort.",
      en: "Not every thought requires an answer.",
    },
    narrative: {
      de: "Manche Gedanken kommen einmal. Andere kommen immer wieder. Wir suchen Lösungen, spielen Situationen erneut durch oder versuchen, etwas zu verstehen, das sich gerade vielleicht gar nicht lösen lässt. Deine Antworten zeigen, dass Gedanken und Grübeln im Moment viel Raum einnehmen.",
      en: "Some thoughts arrive briefly, while others loop persistently as we replay situations or seek immediate answers. Your responses show that ruminating and mental loops currently occupy considerable mental bandwidth.",
    },
    ritualName: { de: "Gedanken loslassen", en: "Letting Go of Thoughts" },
    ritualSteps: {
      de: ["Geist sammeln", "Gedanken beruhigen", "Neue Perspektiven finden", "Herz beruhigen"],
      en: ["Centering the mind", "Soothing thoughts", "Finding fresh perspective", "Heart peace"],
    },
    essence: {
      de: "Du musst einen Gedanken nicht festhalten, nur weil er da ist. Manches darf einfach weiterziehen.",
      en: "You don't have to hold on to a thought just because it appeared. Some things may simply pass by.",
    },
    primaryProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Gezielte Punkte zum Unterbrechen kreisender Gedankenschleifen",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    addonProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Gezielter Sinnesimpuls zum Durchatmen",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    ctaButtonText: {
      de: "REGENERATIONSKARTEN ENTDECKEN",
      en: "DISCOVER REGENERATION CARDS",
    },
    secondaryShortDescription: {
      de: "Mentale Ruhe und das Klären wiederkehrender Gedanken begleiten dein Profil.",
      en: "Mental calm and settling recurring thought patterns accompany your profile.",
    },
  },

  halt: {
    key: "halt",
    name: { de: "Inneren Halt finden", en: "Finding Inner Steadiness" },
    headline: {
      de: "Stabilität beginnt nicht immer im Außen.",
      en: "Stability does not always begin from the outside.",
    },
    narrative: {
      de: "Es gibt Zeiten, in denen Gewohntes plötzlich weniger sicher erscheint. Entscheidungen werden schwieriger. Veränderungen verunsichern. Deine Antworten zeigen, dass innere Sicherheit und Vertrauen gerade mehr Aufmerksamkeit bekommen dürfen.",
      en: "There are periods where familiar anchors feel less steady and choices seem difficult. Your responses indicate that nurturing inner safety, trust, and grounded confidence is especially valuable right now.",
    },
    ritualName: { de: "Inneren Halt finden", en: "Finding Inner Steadiness" },
    ritualSteps: {
      de: ["Herz beruhigen", "Inneren Halt finden", "Gelassenheit finden", "Erdung finden"],
      en: ["Soothing the heart", "Inner anchorage", "Finding composure", "Rooting groundedness"],
    },
    essence: {
      de: "Nicht alles im Außen muss sicher sein. Manchmal genügt es, wieder einen festen Punkt in sich selbst zu finden.",
      en: "Not everything external needs to be certain. Often it suffices to find a solid anchor within.",
    },
    primaryProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Erdende Punkte für Vertrauen und innere Stabilität",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    addonProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Sinnliche Verankerung in Momenten der Verunsicherung",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    ctaButtonText: {
      de: "DEINE REGENERATIONSPUNKTE ENTDECKEN",
      en: "DISCOVER REGENERATION POINTS",
    },
    secondaryShortDescription: {
      de: "Innere Sicherheit und Standfestigkeit ist ein weiterer wichtiger Schwerpunkt.",
      en: "Inner security and steadfastness is another meaningful focus.",
    },
  },

  klarheit: {
    key: "klarheit",
    name: { de: "Klarheit gewinnen", en: "Gaining Clarity" },
    headline: {
      de: "Manchmal entsteht Klarheit erst, wenn es ruhiger wird.",
      en: "Sometimes clarity only arises once stillness sets in.",
    },
    narrative: {
      de: "Je mehr Möglichkeiten wir haben, desto schwieriger kann es werden, zu erkennen, was wirklich wichtig ist. Gedanken überlagern sich. Entscheidungen werden vertagt. Deine Antworten zeigen, dass Klarheit und Orientierung gerade einen besonderen Stellenwert für dich haben.",
      en: "With myriad options and stimuli, discerning what is genuinely essential can become difficult. Your answers suggest that clarifying perspective and finding orientation hold a significant place for you right now.",
    },
    ritualName: { de: "Klarheit gewinnen", en: "Gaining Clarity" },
    ritualSteps: {
      de: ["Geist sammeln", "Neue Perspektiven finden", "Klar sehen", "Gelassenheit finden"],
      en: ["Gathering the mind", "Fresh perspective", "Clear sight", "Serene focus"],
    },
    essence: {
      de: "Du musst nicht sofort die ganze Antwort kennen. Manchmal reicht der nächste klare Schritt.",
      en: "You don't need the complete answer immediately. Sometimes the next clear step is enough.",
    },
    primaryProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Punkte zur Klärung des Geistes und Schärfung der Wahrnehmung",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    addonProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Frischer Duftimpuls für Konzentration und Fokus",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    ctaButtonText: {
      de: "RITUAL ENTDECKEN",
      en: "DISCOVER RITUAL",
    },
    secondaryShortDescription: {
      de: "Orientierung und geistige Klarheit bilden einen zweiten spürbaren Aspekt.",
      en: "Orientation and mental clarity form a second notable aspect.",
    },
  },

  gelassenheit: {
    key: "gelassenheit",
    name: { de: "Gelassen durch den Tag", en: "Moving with Ease" },
    headline: {
      de: "Zwischen all dem, was passiert, darf auch Raum für dich bleiben.",
      en: "Amidst all that happens, space for you is allowed to remain.",
    },
    narrative: {
      de: "Ein voller Kalender. Viele Reize. Menschen, die etwas brauchen. Dinge, die erledigt werden wollen. Irgendwann entsteht das Gefühl: Ich bin ständig unter Strom. Deine Antworten zeigen, dass Anspannung und Gelassenheit im Alltag momentan ein wichtiger Schwerpunkt für dich sind.",
      en: "A packed calendar, continuous sensory inputs, and endless obligations can leave you feeling constantly on edge. Your responses reveal that releasing daytime tension and cultivating ease are primary priorities.",
    },
    ritualName: { de: "Gelassen durch den Tag", en: "Moving with Ease" },
    ritualSteps: {
      de: ["Geist sammeln", "Gelassenheit finden", "Neue Leichtigkeit", "Erdung finden"],
      en: ["Gathering the mind", "Finding ease", "New lightness", "Grounding"],
    },
    essence: {
      de: "Du musst nicht warten, bis alles erledigt ist. Ruhe darf auch zwischendurch stattfinden.",
      en: "You don't have to wait until everything is done. Calm can happen in between.",
    },
    primaryProduct: {
      slug: "somnobalance-roll-on",
      name: "SomnoBalance Roll-on",
      subtitle: "Dein aromatischer Begleiter für Gelassenheit im Alltag",
      url: "/shop/somnobalance-roll-on",
      image: "/products/somnobalance-roll-on.jpg",
    },
    addonProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "Schnelle 2-Minuten Punkte für Zwischendurch",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    ctaButtonText: {
      de: "ROLL-ON ENTDECKEN",
      en: "DISCOVER ROLL-ON",
    },
    secondaryShortDescription: {
      de: "Gelassenheit und Leichtigkeit im Alltag zeigen sich als weiterer Schwerpunkt.",
      en: "Calm composure and lightness in daily routines show as another key focus.",
    },
  },

  regeneration: {
    key: "regeneration",
    name: { de: "Regeneration aktivieren", en: "Activating Regeneration" },
    headline: {
      de: "Zeit für dich ist kein Gegenpol zum Alltag. Sie gehört dazu.",
      en: "Time for yourself is not the opposite of daily life. It is an essential part of it.",
    },
    narrative: {
      de: "Oft warten wir mit Erholung, bis alles andere erledigt ist. Nur ist selten alles erledigt. Deine Antworten zeigen deshalb weniger ein einzelnes Thema als einen Wunsch: Regeneration wieder bewusster in deinen Alltag zu integrieren.",
      en: "We often delay rest until everything else is handled, yet life rarely empties out. Your responses show a comprehensive wish: to weave conscious, nourishing regeneration back into everyday life.",
    },
    ritualName: { de: "Regeneration aktivieren", en: "Activating Regeneration" },
    ritualSteps: {
      de: ["Innere Mitte stärken", "Kraft schöpfen", "Herz beruhigen", "Erdung finden"],
      en: ["Strengthening center", "Drawing energy", "Soothing the heart", "Grounding"],
    },
    essence: {
      de: "Ein paar Minuten. Ein wiederkehrender Moment. Etwas, das nur dir gehört.",
      en: "A few minutes. A recurring pause. Something that belongs solely to you.",
    },
    primaryProduct: {
      slug: "somnobalance-starter-set",
      name: "SomnoBalance Starter-Set / Ritual Collection",
      subtitle: "Das harmonische Komplettset für ganzheitliche Erholung",
      url: "/shop/somnobalance-starter-set",
      image: "/products/somnobalance-starter-set.jpg",
    },
    addonProduct: {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: "13 Punkte und 10 Rituale für jede Lebenslage",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    },
    ctaButtonText: {
      de: "STARTER-SET ENTDECKEN",
      en: "DISCOVER STARTER SET",
    },
    secondaryShortDescription: {
      de: "Das Verankern wiederkehrender Erholungsmomente ist ein weiterer Begleiter.",
      en: "Anchoring recurring restful pauses is another visible companion.",
    },
  },
};

export const LOW_SCORE_PREVENTIVE_PROFILE = {
  isLowScore: true,
  name: { de: "Deine Balance bewusst bewahren", en: "Consciously Preserving Your Balance" },
  headline: {
    de: "Manchmal geht es nicht darum, etwas zu verändern. Sondern darum, das zu bewahren, was bereits trägt.",
    en: "Sometimes it is not about changing anything, but about preserving what already supports you.",
  },
  narrative: {
    de: "Deine Antworten zeigen aktuell keinen einzelnen Bereich, der deutlich im Vordergrund steht. Das kann ein guter Moment sein, Regeneration nicht erst dann Raum zu geben, wenn der Alltag zu viel wird, sondern sie als selbstverständlichen Teil deines Tages zu pflegen.",
    en: "Your responses do not indicate any single acute stress area standing out. This is a wonderful moment to nurture regeneration not as a remedy when overwhelmed, but as an intuitive daily habit of self-care.",
  },
  essence: {
    de: "Regeneration als vorbeugende Freude und Quelle der Gelassenheit.",
    en: "Regeneration as proactive nourishment and a steady source of ease.",
  },
  primaryProduct: {
    slug: "somnobalance-regeneration-cards",
    name: "SomnoBalance Regenerationskarten",
    subtitle: "Inspiration für kleine, frei gewählte Regenerationsmomente",
    url: "/shop/somnobalance-regeneration-cards",
    image: "/products/somnobalance-regeneration-cards.jpg",
  },
  ctaButtonText: {
    de: "REGENERATION ENTDECKEN",
    en: "DISCOVER REGENERATION",
  },
};

export type EvaluationResult = {
  isLowScore: boolean;
  primaryKey: SubscaleKey | "balance_preserve";
  title: string;
  headline: string;
  narrative: string;
  ritualName?: string;
  ritualSteps?: string[];
  essence: string;
  primaryProduct: ProductRecommendation;
  addonProduct?: ProductRecommendation;
  ctaButtonText: string;
  showSecondary: boolean;
  secondarySnippet?: {
    key: SubscaleKey;
    name: string;
    description: string;
  };
  isMultiElevated: boolean;
};

/**
 * Pure evaluation function according to exact specifications in Section 10 of document.
 * Never outputs numerical scores to the resulting object.
 */
export function evaluateRegenerationCheck(
  rawAnswers: Record<string, number> | number[],
  lang: string = "de"
): EvaluationResult {
  const isDe = lang === "de";

  // Normalize answers into q01..q20
  const ansMap: Record<string, number> = {};
  if (Array.isArray(rawAnswers)) {
    rawAnswers.forEach((val, idx) => {
      const qNum = String(idx + 1).padStart(2, "0");
      ansMap[`q${qNum}`] = Math.max(0, Math.min(4, Number(val) || 0));
    });
  } else {
    for (let i = 1; i <= 20; i++) {
      const qKey = `q${String(i).padStart(2, "0")}`;
      ansMap[qKey] = Math.max(0, Math.min(4, Number(rawAnswers[qKey]) || 0));
    }
  }

  // Exact subscale calculations (Section 5)
  const scores: Record<SubscaleKey, number> = {
    ruhe: (ansMap["q01"] || 0) + (ansMap["q02"] || 0),
    schlaf: (ansMap["q03"] || 0) + (ansMap["q04"] || 0),
    kraft: (ansMap["q05"] || 0) + (ansMap["q06"] || 0),
    balance: (ansMap["q07"] || 0) + (ansMap["q08"] || 0),
    emotionen: (ansMap["q09"] || 0) + (ansMap["q10"] || 0),
    gedanken: (ansMap["q11"] || 0) + (ansMap["q12"] || 0),
    halt: (ansMap["q13"] || 0) + (ansMap["q14"] || 0),
    klarheit: (ansMap["q15"] || 0) + (ansMap["q16"] || 0),
    gelassenheit: (ansMap["q17"] || 0) + (ansMap["q18"] || 0),
    regeneration: (ansMap["q19"] || 0) + (ansMap["q20"] || 0),
  };

  // Sort by score DESC, then tie-break priority index ASC
  const sorted = [...TIE_BREAK_PRIORITY].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return TIE_BREAK_PRIORITY.indexOf(a) - TIE_BREAK_PRIORITY.indexOf(b);
  });

  const primaryKey = sorted[0];
  const primaryScore = scores[primaryKey];

  const secondaryKey = sorted[1];
  const secondaryScore = scores[secondaryKey];

  // Logic condition checks
  const maxScore = Math.max(...Object.values(scores));
  const isLowScore = maxScore <= 2;
  const elevatedCount = Object.values(scores).filter((s) => s >= 5).length;
  const isMultiElevated = elevatedCount >= 3;

  const showSecondary =
    !isLowScore && secondaryScore >= 5 && primaryScore - secondaryScore <= 2;

  // Case 1: Low-score preventive resource result
  if (isLowScore) {
    return {
      isLowScore: true,
      primaryKey: "balance_preserve",
      title: isDe ? LOW_SCORE_PREVENTIVE_PROFILE.name.de : LOW_SCORE_PREVENTIVE_PROFILE.name.en,
      headline: isDe
        ? LOW_SCORE_PREVENTIVE_PROFILE.headline.de
        : LOW_SCORE_PREVENTIVE_PROFILE.headline.en,
      narrative: isDe
        ? LOW_SCORE_PREVENTIVE_PROFILE.narrative.de
        : LOW_SCORE_PREVENTIVE_PROFILE.narrative.en,
      essence: isDe
        ? LOW_SCORE_PREVENTIVE_PROFILE.essence.de
        : LOW_SCORE_PREVENTIVE_PROFILE.essence.en,
      primaryProduct: LOW_SCORE_PREVENTIVE_PROFILE.primaryProduct,
      ctaButtonText: isDe
        ? LOW_SCORE_PREVENTIVE_PROFILE.ctaButtonText.de
        : LOW_SCORE_PREVENTIVE_PROFILE.ctaButtonText.en,
      showSecondary: false,
      isMultiElevated: false,
    };
  }

  // Case 2: Standard primary profile
  const profile = PROFILES[primaryKey];

  // Multi-elevated product override (Section 10)
  let primaryProduct = profile.primaryProduct;
  let addonProduct: ProductRecommendation | undefined = profile.addonProduct;

  if (isMultiElevated) {
    primaryProduct = {
      slug: "somnobalance-starter-set",
      name: "SomnoBalance Starter-Set / Ritual Collection",
      subtitle: isDe
        ? "Das umfassende Set für vielschichtige Regeneration"
        : "Comprehensive set for multifaceted regeneration",
      url: "/shop/somnobalance-starter-set",
      image: "/products/somnobalance-starter-set.jpg",
    };
    addonProduct = {
      slug: "somnobalance-regeneration-cards",
      name: "SomnoBalance Regenerationskarten",
      subtitle: isDe ? "13 Regenerationspunkte & 10 Rituale" : "13 Regeneration Points & 10 Rituals",
      url: "/shop/somnobalance-regeneration-cards",
      image: "/products/somnobalance-regeneration-cards.jpg",
    };
  }

  const result: EvaluationResult = {
    isLowScore: false,
    primaryKey,
    title: isDe ? profile.name.de : profile.name.en,
    headline: isDe ? profile.headline.de : profile.headline.en,
    narrative: isDe ? profile.narrative.de : profile.narrative.en,
    ritualName: isDe ? profile.ritualName.de : profile.ritualName.en,
    ritualSteps: isDe ? profile.ritualSteps.de : profile.ritualSteps.en,
    essence: isDe ? profile.essence.de : profile.essence.en,
    primaryProduct,
    addonProduct,
    ctaButtonText: isDe ? profile.ctaButtonText.de : profile.ctaButtonText.en,
    showSecondary,
    isMultiElevated,
  };

  if (showSecondary) {
    const secProfile = PROFILES[secondaryKey];
    result.secondarySnippet = {
      key: secondaryKey,
      name: isDe ? secProfile.name.de : secProfile.name.en,
      description: isDe
        ? secProfile.secondaryShortDescription.de
        : secProfile.secondaryShortDescription.en,
    };
  }

  return result;
}
