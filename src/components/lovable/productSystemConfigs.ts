// Per-product config for ProductSystemPage.tsx, one entry per product beyond
// the Roll-on (which keeps its own bespoke RollOnPdp.tsx). System-role
// labels, ritual sequences and "next companion" lines are taken directly
// from the client's briefing (SomnoBalance_Produktseiten_Design_Content_
// Briefing.docx, sections 3–11) — not invented. Body copy (description,
// details, ingredients) always comes from products.ts, never duplicated
// here, per the briefing's instruction not to freehand product facts.
import { Bed, Cloud, Droplet, Moon, Sparkles, Sun, Wind } from "lucide-react";
import type { ProductSystemConfig } from "@/components/lovable/ProductSystemPage";

// Plain string-key set, safe to import from a Server Component (page.tsx)
// to decide routing without pulling in the icon components below, which
// can't cross the server/client prop boundary.
export const PRODUCT_SYSTEM_SLUGS = new Set([
  "somnobalance-oil-blend",
  "somnobalance-room-spray",
  "somnobalance-regeneration-tea",
  "somnobalance-regeneration-cards",
  "somnobalance-starter-set",
  "somnobalance-neck-pillow",
  "somnobalance-mattress",
]);

export function hasProductSystemConfig(slug: string) {
  return PRODUCT_SYSTEM_SLUGS.has(slug);
}

export const productSystemConfigs: Record<string, ProductSystemConfig> = {
  "somnobalance-oil-blend": {
    systemRoleLabel: "REGULIEREN · LOSLASSEN · VORBEREITEN",
    howToUseImage: "/products/oil-blend-diffuser.webp",
    galleryTagline: ["Loslassen.", "Vorbereiten."],
    galleryImages: [
      "/products/somnobalance-oil-blend.webp",
      "/products/oil-blend-stone.webp",
      "/products/oil-blend-diffuser.webp",
      "/products/oil-blend-ingredients.webp",
    ],
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Wenn der Tag", "leiser werden darf."],
    howToUseSteps: [
      { icon: Droplet, label: "Diffuser/Duftlampe vorbereiten" },
      { icon: Wind, label: "5–8 Tropfen zugeben" },
      { icon: Cloud, label: "Anwenden" },
      { icon: Moon, label: "Duft bewusst wahrnehmen" },
    ],
    howToUseNote: ["Ein Impuls passend", "zu Ihrem Moment."],
    nextCompanionLabel: "Ihr Begleiter für Loslassen & Vorbereiten.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "REGULATE · LET GO · PREPARE",
        galleryTagline: ["Let go.", "Prepare."],
        howToUseEyebrow: "Application",
        howToUseTitle: ["When the day", "starts to quiet down."],
        howToUseSteps: ["Prepare diffuser", "Add 5–8 drops", "Apply", "Notice the scent"],
        howToUseNote: ["An impulse for", "your moment."],
        nextCompanionLabel: "Your companion for letting go & preparing.",
      },
    },
  },

  "somnobalance-room-spray": {
    systemRoleLabel: "LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Raum schaffen.", "Übergang beginnen."],
    galleryImages: [
      "/products/room-spray-bottle.webp",
      "/products/room-spray-hand.webp",
      "/products/room-spray-curtain.webp",
      "/products/somnobalance-room-spray.webp",
    ],
    howToUseImage: "/products/room-spray-curtain.webp",
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Beginnen Sie", "mit dem Raum."],
    howToUseSteps: [
      { icon: Wind, label: "Raum wahrnehmen", description: "Nehmen Sie bewusst wahr, welche Atmosphäre Sie für den kommenden Moment schaffen möchten." },
      { icon: Sparkles, label: "Duftimpuls setzen", description: "Vor Gebrauch gründlich schütteln, in den Raum sprühen und verteilen." },
      { icon: Cloud, label: "Übergang gestalten", description: "Nutzen Sie den Duft als wiederkehrenden Impuls für einen bewussten Wechsel zwischen Aktivität und ruhigeren Momenten." },
      { icon: Moon, label: "Auf den Abend vorbereiten", description: "Integrieren Sie das Raumspray nach Bedarf in Ihren persönlichen Übergang in den Abend." },
    ],
    howToUseNote: ["Verändere nicht den", "ganzen Abend."],
    nextCompanionLabel: "Ihr Begleiter für den Übergang zur Nacht.",
    statement: "Manchmal beginnt ein Übergang mit der Atmosphäre eines Raumes.",
    cycleSection: {
      "eyebrow": "IM SOMNOBALANCE-KREISLAUF",
      "headline": "Atmosphäre für bewusste Übergänge.",
      "activePhases": [
        false,
        true,
        true,
        false
      ],
      "body": "Das SomnoBalance Raumspray begleitet insbesondere die Phasen des Loslassens und Vorbereitens. Mit wenigen Sprühstößen lässt sich die Atmosphäre eines Raumes bewusst verändern und ein wiederkehrender Duftimpuls in persönliche Übergänge und Rituale integrieren.",
      "note": "Die Phasen geben Orientierung. Wann Sie das Raumspray in Ihren persönlichen Tagesrhythmus integrieren, bleibt individuell."
    },
    discoverMore: {
      "eyebrow": "SOMNOBALANCE WEITERENTDECKEN",
      "headline": "Weitere Begleiter für Ihren Regenerationsrhythmus.",
      "cta": "Alle Produkte entdecken →",
      "items": [
        {
          "slug": "somnobalance-roll-on",
          "blurb": "Ein bewusster Duftimpuls für unterwegs und zu Hause."
        },
        {
          "slug": "somnobalance-oil-blend",
          "blurb": "Ein Duftimpuls für bewusste Regenerationsmomente und persönliche Rituale."
        },
        {
          "slug": "somnobalance-regeneration-tea",
          "blurb": "Ein bewusstes Ritual für ruhigere Momente und den Übergang in den Abend."
        }
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        howToUseTitle: [
          "Begin",
          "with the room."
        ],
        howToUseStepDescriptions: [
          "Notice consciously which atmosphere you would like to create for the coming moment.",
          "Shake well before use, spray into the room and distribute.",
          "Use the scent as a recurring impulse for a conscious change between activity and quieter moments.",
          "Integrate the room spray into your personal transition into the evening as needed."
        ],
        statement: "Sometimes a transition begins with the atmosphere of a room.",
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "Atmosphere for conscious transitions.",
          "activePhases": [
            false,
            true,
            true,
            false
          ],
          "body": "The SomnoBalance Room Spray accompanies the phases of letting go and preparing in particular. With a few sprays the atmosphere of a room can be changed consciously, and a recurring scent impulse can be integrated into personal transitions and rituals.",
          "note": "The phases give orientation. When you integrate the room spray into your personal daily rhythm remains individual."
        },
        discoverMore: {
          "eyebrow": "KEEP DISCOVERING SOMNOBALANCE",
          "headline": "More companions for your regeneration rhythm.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful scent impulse for on the go and at home."
            },
            {
              "slug": "somnobalance-oil-blend",
              "blurb": "A scent impulse for mindful moments of regeneration and personal rituals."
            },
            {
              "slug": "somnobalance-regeneration-tea",
              "blurb": "A mindful ritual for calmer moments and the transition into the evening."
            }
          ]
        },
        systemRoleLabel: "LET GO · PREPARE",
        galleryTagline: ["Create space.", "Begin transition."],
        howToUseEyebrow: "Application",
        howToUseSteps: ["Notice the room", "Set a scent impulse", "Shape the transition", "Prepare for the evening"],
        howToUseNote: ["Do not change the", "whole evening."],
        nextCompanionLabel: "Your companion for the transition to night.",
      },
    },
  },

  "somnobalance-regeneration-tea": {
    systemRoleLabel: "LOSLASSEN · VORBEREITEN",
    howToUseImage: "/products/tea-lifestyle-cup.webp",
    galleryTagline: ["Zeit nehmen.", "Ankommen."],
    galleryImages: [
      "/products/tea-lifestyle-cup.webp",
      "/products/tea-lifestyle-cloth.webp",
      "/products/tea-blend-bowl.webp",
      "/products/somnobalance-regeneration-tea.webp",
    ],
    howToUseEyebrow: "Zubereitung",
    howToUseTitle: ["Manchmal beginnt Loslassen", "mit etwas ganz Einfachem."],
    howToUseSteps: [
      { icon: Droplet, label: "Zubereiten", description: "1 gehäuften Teelöffel Tee pro 200 ml Wasser verwenden." },
      { icon: Cloud, label: "Aufbrühen", description: "Mit kochendem Wasser übergießen." },
      { icon: Sun, label: "Zeit geben", description: "6–8 Minuten ziehen lassen." },
      { icon: Moon, label: "Bewusst genießen", description: "Die Tasse Tee als bewussten Moment oder Übergang in den eigenen Tagesrhythmus integrieren." },
    ],
    howToUseNote: ["Eine Tasse.", "Ein bewusster Moment."],
    nextCompanionLabel: "Ihr Begleiter für ruhigere Abendmomente.",
    cycleSection: {
      "eyebrow": "IM SOMNOBALANCE-KREISLAUF",
      "headline": "Ein Ritual für bewusste Übergänge.",
      "activePhases": [
        false,
        true,
        true,
        false
      ],
      "body": "Der SomnoBalance Regenerationstee kann insbesondere die Phasen des Loslassens und Vorbereitens begleiten. Eine bewusst zubereitete Tasse Tee schafft einen Moment, in dem der aktive Tag unterbrochen und der Übergang in ruhigere Phasen bewusst gestaltet werden kann.",
      "note": "Die Phasen geben Orientierung. Wann Sie den Tee in Ihren persönlichen Tagesrhythmus integrieren, bleibt individuell."
    },
    discoverMore: {
      "eyebrow": "SOMNOBALANCE WEITERENTDECKEN",
      "headline": "Weitere Begleiter für Ihren Regenerationsrhythmus.",
      "cta": "Alle Produkte entdecken →",
      "items": [
        {
          "slug": "somnobalance-regeneration-cards",
          "blurb": "Regenerationspunkte und Rituale als Impulse für Ihren Alltag."
        },
        {
          "slug": "somnobalance-roll-on",
          "blurb": "Ein bewusster Duftimpuls für unterwegs und zu Hause."
        },
        {
          "slug": "somnobalance-room-spray",
          "blurb": "Ein Duftimpuls für Ihren Raum und bewusste Übergänge."
        }
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        howToUseSteps: [
          "Prepare",
          "Brew",
          "Give it time",
          "Enjoy mindfully"
        ],
        howToUseStepDescriptions: [
          "Use 1 heaped teaspoon of tea per 200 ml of water.",
          "Pour over with boiling water.",
          "Let steep for 6–8 minutes.",
          "Integrate the cup of tea as a mindful moment or transition into your own daily rhythm."
        ],
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "A ritual for conscious transitions.",
          "activePhases": [
            false,
            true,
            true,
            false
          ],
          "body": "The SomnoBalance Regeneration Tea can accompany the phases of letting go and preparing in particular. A mindfully prepared cup of tea creates a moment in which the active day is interrupted and the transition into quieter phases can be shaped consciously.",
          "note": "The phases give orientation. When you integrate the tea into your personal daily rhythm remains individual."
        },
        discoverMore: {
          "eyebrow": "KEEP DISCOVERING SOMNOBALANCE",
          "headline": "More companions for your regeneration rhythm.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-regeneration-cards",
              "blurb": "Regeneration points and rituals as impulses for your everyday life."
            },
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful scent impulse for on the go and at home."
            },
            {
              "slug": "somnobalance-room-spray",
              "blurb": "A scent impulse for your room and conscious transitions."
            }
          ]
        },
        systemRoleLabel: "LET GO · PREPARE",
        galleryTagline: ["Take time.", "Arrive."],
        howToUseEyebrow: "Preparation",
        howToUseTitle: ["Sometimes letting go", "starts with something simple."],
        howToUseNote: ["A cup.", "A mindful moment."],
        nextCompanionLabel: "Your companion for quieter evening moments.",
      },
    },
  },

  "somnobalance-regeneration-cards": {
    systemRoleLabel: "REGULIEREN · LOSLASSEN · VORBEREITEN",
    howToUseImage: "/products/cards-hand.webp",
    galleryTagline: ["Welche Begleitung", "brauchen Sie gerade?"],
    galleryImages: [
      "/products/somnobalance-regeneration-cards.webp",
      "/products/cards-front-pair.webp",
      "/products/cards-hand.webp",
      "/products/cards-front-back.webp",
      "/products/cards-back-detail.webp",
      "/products/cards-point-back.webp",
      "/products/cards-single.webp",
    ],
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Karte wählen.", "Impuls anwenden."],
    howToUseSteps: [
      { icon: Sparkles, label: "Karte auswählen", description: "Wählen Sie einen einzelnen Regenerationspunkt oder ein Ritual passend zu Ihrem Moment." },
      { icon: Droplet, label: "Impuls anwenden", description: "Folgen Sie der Anwendung bzw. Abfolge auf der ausgewählten Karte." },
      { icon: Cloud, label: "Zeit geben", description: "Ein Regenerationspunkt wird etwa 2–3 Minuten sanft gehalten." },
      { icon: Sun, label: "In den Alltag zurückkehren", description: "Nehmen Sie den Moment bewusst mit und setzen Sie Ihren Tag in Ihrem eigenen Rhythmus fort." },
    ],
    howToUseNote: ["Ein Impuls passend", "zu Ihrem Moment."],
    nextCompanionLabel: "Regulieren & Loslassen — für jeden Moment im Alltag.",
    explainerSections: [
      {
        "eyebrow": "ZWEI KARTENTYPEN",
        "headline": "Einen Punkt wählen – oder einem Ritual folgen.",
        "body": "13 REGENERATIONSPUNKT-KARTEN\nSie zeigen jeweils einen ausgewählten Regenerationspunkt mit Lage bzw. Orientierung und Anwendung.\n\n10 REGENERATIONSRITUAL-KARTEN\nSie verbinden mehrere Impulse zu einer vorbereiteten Abfolge für unterschiedliche Situationen und Momente.\n\nSie können entweder einen einzelnen Regenerationspunkt auswählen oder einem vorbereiteten Regenerationsritual folgen. Die Angabe von 2–3 Minuten bezieht sich nur auf einen einzelnen Regenerationspunkt."
      },
      {
        "eyebrow": "KEIN STARRES SYSTEM",
        "headline": "Nicht jede Karte. Nicht jeden Tag. Sondern das, was gerade zu Ihnen passt.",
        "body": "Die Regenerationskarten geben Orientierung und konkrete Impulse. Sie entscheiden selbst, welche Karte Sie wann in Ihren Alltag integrieren möchten."
      }
    ],
    cycleSection: {
      "eyebrow": "IM SOMNOBALANCE-KREISLAUF",
      "headline": "Impulse für unterschiedliche Momente Ihres Tages.",
      "activePhases": [
        true,
        true,
        true,
        false
      ],
      "body": "Die SomnoBalance Regenerationskarten können Sie durch unterschiedliche Phasen Ihres Tages begleiten. Wählen Sie einen passenden Impuls mitten im aktiven Alltag, beim Loslassen oder als Teil Ihrer persönlichen Vorbereitung auf den Abend.",
      "note": "Die Phasen geben Orientierung. Welchen Impuls Sie wann auswählen, bleibt individuell."
    },
    discoverMore: {
      "eyebrow": "SOMNOBALANCE WEITERENTDECKEN",
      "headline": "Weitere Begleiter für Ihren Regenerationsrhythmus.",
      "cta": "Alle Produkte entdecken →",
      "items": [
        {
          "slug": "somnobalance-starter-set",
          "blurb": "Ihr Einstieg in die SomnoBalance-Welt."
        },
        {
          "slug": "somnobalance-roll-on",
          "blurb": "Ein bewusster Duftimpuls für unterwegs und zu Hause."
        },
        {
          "slug": "somnobalance-regeneration-tea",
          "blurb": "Ein bewusstes Ritual für ruhigere Momente und den Übergang in den Abend."
        }
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        howToUseSteps: [
          "Choose a card",
          "Apply the impulse",
          "Give it time",
          "Return to everyday life"
        ],
        howToUseStepDescriptions: [
          "Choose a single regeneration point or a ritual that fits your moment.",
          "Follow the application or sequence on the chosen card.",
          "A regeneration point is held gently for about 2–3 minutes.",
          "Take the moment with you consciously and continue your day at your own rhythm."
        ],
        explainerSections: [
          {
            "eyebrow": "TWO TYPES OF CARDS",
            "headline": "Choose a point – or follow a ritual.",
            "body": "13 REGENERATION-POINT CARDS\nEach shows one selected regeneration point with its position or orientation and application.\n\n10 REGENERATION-RITUAL CARDS\nThey combine several impulses into a prepared sequence for different situations and moments.\n\nYou can either choose a single regeneration point or follow a prepared regeneration ritual. The 2–3 minutes refer to a single regeneration point only."
          },
          {
            "eyebrow": "NOT A RIGID SYSTEM",
            "headline": "Not every card. Not every day. Just what suits you right now.",
            "body": "The regeneration cards give orientation and concrete impulses. You decide for yourself which card you integrate into your everyday life and when."
          }
        ],
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "Impulses for different moments of your day.",
          "activePhases": [
            true,
            true,
            true,
            false
          ],
          "body": "The SomnoBalance Regeneration Cards can accompany you through different phases of your day. Choose a fitting impulse in the middle of the active day, while letting go, or as part of your personal preparation for the evening.",
          "note": "The phases give orientation. Which impulse you choose when remains individual."
        },
        discoverMore: {
          "eyebrow": "KEEP DISCOVERING SOMNOBALANCE",
          "headline": "More companions for your regeneration rhythm.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your entry into the SomnoBalance world."
            },
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful scent impulse for on the go and at home."
            },
            {
              "slug": "somnobalance-regeneration-tea",
              "blurb": "A mindful ritual for calmer moments and the transition into the evening."
            }
          ]
        },
        systemRoleLabel: "REGULATE · LET GO · PREPARE",
        galleryTagline: ["Which companion", "do you need right now?"],
        howToUseEyebrow: "Application",
        howToUseTitle: ["Choose a card.", "Apply impulse."],
        howToUseNote: ["An impulse for", "your moment."],
        nextCompanionLabel: "Regulate & Let Go — for every moment in daily life.",
      },
    },
  },

  "somnobalance-starter-set": {
    systemRoleLabel: "IHR EINSTIEG IN SOMNOBALANCE",
    howToUseImage: "/products/starter-set-guide-cards.webp",
    galleryTagline: ["Drei Wochen.", "Ihr Weg."],
    galleryImages: [
      "/products/somnobalance-starter-set.webp",
      "/products/starter-set-components.webp",
      "/products/starter-set-guide-cards.webp",
      "/products/oil-blend-diffuser.webp",
    ],
    howToUseEyebrow: "21-Tage-Guide",
    howToUseTitle: ["Drei Wochen.", "Ihr Regenerationsweg."],
    howToUseSteps: [
      { icon: Sun, label: "Woche 1" },
      { icon: Cloud, label: "Woche 2" },
      { icon: Moon, label: "Woche 3" },
      { icon: Sparkles, label: "Weitergehen" },
    ],
    howToUseNote: ["So greifen Ihre", "Begleiter ineinander."],
    timeline: {
      eyebrow: "IHR REGENERATIONSWEG",
      headline: "21 Tage. Ihr eigener Rhythmus.",
      intro:
        "Der 21-Tage-Guide führt Sie Schritt für Schritt durch das SomnoBalance-Konzept. Dabei geht es nicht darum, jeden Tag möglichst viel umzusetzen. Kleine, bewusst gewählte Impulse helfen Ihnen dabei herauszufinden, was sich gut in Ihren Alltag integrieren lässt.",
      steps: [
        {
          number: "01",
          title: "WOCHE 1 – WAHRNEHMEN",
          body: "Beobachten Sie Ihren Alltag bewusster und entdecken Sie die Momente, in denen Ihnen ein kurzer Regenerationsimpuls guttun kann.",
        },
        {
          number: "02",
          title: "WOCHE 2 – VERTIEFEN",
          body: "Lernen Sie unterschiedliche Regenerationsimpulse kennen und finden Sie heraus, welche davon gut zu Ihnen und Ihrem Alltag passen.",
        },
        {
          number: "03",
          title: "WOCHE 3 – INTEGRIEREN",
          body: "Verbinden Sie ausgewählte Impulse mit wiederkehrenden Momenten Ihres Tages und entwickeln Sie daraus Ihren persönlichen Regenerationsrhythmus.",
        },
        {
          number: "04",
          title: "WEITERGEHEN – IHREN RHYTHMUS FINDEN",
          body: "Nehmen Sie mit, was Ihnen guttut. SomnoBalance gibt Orientierung – Sie entscheiden, welche Impulse Sie langfristig begleiten sollen.",
        },
      ],
    },
    bundleContents: [
      {
        title: "21-Tage-Guide",
        subtitle: "Ihr roter Faden für die ersten 21 Tage.",
        body: "Kleine Impulse und Rituale begleiten Sie dabei, bewusste Regenerationsmomente in Ihren Alltag zu integrieren und Schritt für Schritt Ihren persönlichen Rhythmus zu entwickeln.",
      },
      {
        title: "Regenerationskarten-Set",
        subtitle: "Ein Impuls passend zu Ihrem Moment.",
        body: "Wählen Sie passend zu Ihrem aktuellen Bedürfnis einen Regenerationspunkt oder ein Ritual aus. Die Karten geben Ihnen konkrete, leicht umsetzbare Impulse für bewusste Momente im Alltag, beim Loslassen und bei der Vorbereitung auf die Nacht.",
      },
      {
        title: "SomnoBalance Roll-on",
        subtitle: "Ein Duftimpuls für unterwegs und zu Hause.",
        body: "Bewusst aufgetragen und wahrgenommen, kann der Roll-on zu einem persönlichen Begleiter für kurze Regenerationsmomente und bewusste Übergänge werden.",
      },
      {
        title: "SomnoBalance Ölmischung",
        subtitle: "Duft als Teil Ihres persönlichen Rituals.",
        body: "Ein Duftimpuls für bewusste Regenerationsmomente und persönliche Rituale. Wenige Tropfen im Diffuser schaffen eine angenehme Duftatmosphäre und können Sie beim Loslassen und bei der Vorbereitung auf den Abend begleiten.",
      },
    ],
    togetherSection: {
      eyebrow: "GEMEINSAM GEDACHT",
      headline: "Orientierung, Impulse und Rituale für Ihren Alltag.",
      body: "Der 21-Tage-Guide gibt Ihnen Orientierung. Die Regenerationskarten helfen Ihnen dabei, passende Impulse auszuwählen. Roll-on und Ölmischung können bewusste Momente und Übergänge mit einem wiederkehrenden Duft begleiten.\n\nSie entscheiden selbst, was Sie wann nutzen. Denn SomnoBalance folgt keinem starren Ablauf – sondern Ihrem persönlichen Regenerationsrhythmus.",
    },
    dailyMoments: {
      eyebrow: "SOMNOBALANCE IM ALLTAG",
      headline: "Kleine Impulse. Passend zu Ihrem Moment.",
      intro: "Sie müssen nicht jeden Bestandteil jeden Tag nutzen. Wählen Sie das, was zu Ihrem Moment und Ihrem persönlichen Regenerationsbedarf passt.",
      cards: [
        {
          title: "MITTEN IM TAG",
          headline: "Ein kurzer Moment zum Innehalten.",
          body: "Wählen Sie beispielsweise eine Regenerationskarte oder nutzen Sie den Roll-on als bewussten Duftimpuls für einen kurzen Regenerationsmoment.",
        },
        {
          title: "BEIM LOSLASSEN",
          headline: "Den aktiven Tag langsam leiser werden lassen.",
          body: "Ein ausgewählter Regenerationsimpuls, der Roll-on oder die Ölmischung können einen bewussten Übergang zwischen Aktivität und Ruhe begleiten.",
        },
        {
          title: "AM ABEND",
          headline: "Der Nacht bewusst Raum geben.",
          body: "Nutzen Sie einen ausgewählten Impuls oder einen vertrauten Duft als Teil Ihrer persönlichen Abendroutine und schaffen Sie einen ruhigen Übergang in die Nacht.",
        },
      ],
    },
    nextCompanionLabel: "Regulieren, Loslassen, Vorbereiten — Ihr Einstieg.",
    cycleSection: {
      eyebrow: "IM SOMNOBALANCE-KREISLAUF",
      activePhases: [true, true, true, false],
      body: "Das Starter-Set begleitet Sie insbesondere beim Regulieren, Loslassen und Vorbereiten. Die Phasen geben Orientierung. Welche Impulse Sie wann nutzen, bleibt individuell.",
      note: "Die Phasen sind fest – die Anwendung ist individuell.",
    },
    discoverMore: {
      eyebrow: "SOMNOBALANCE WEITERENTDECKEN",
      headline: "Was Ihren Regenerationsrhythmus ergänzen kann.",
      body: "SomnoBalance begleitet Regeneration über den ganzen Tag hinweg bis in die Nacht. Entdecken Sie weitere Begleiter für bewusste Regenerationsmomente und eine regenerationsfördernde Schlafumgebung.",
      cta: "Alle Produkte entdecken →",
      items: [
        { slug: "somnobalance-neck-pillow", blurb: "Individuell anpassbare Unterstützung für eine bewusst gestaltete Schlafumgebung." },
        { slug: "somnobalance-room-spray", blurb: "Ein Duftimpuls für Ihren Raum und bewusste Übergänge." },
        { slug: "somnobalance-mattress", blurb: "Individuell anpassbarer Liegekomfort für eine bewusst gestaltete Schlafumgebung." },
      ],
    },
    brandCloseTagline: ["Die Phasen sind fest —", "die Anwendung ist individuell."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "YOUR ENTRY INTO SOMNOBALANCE",
        galleryTagline: ["Three weeks.", "Your path."],
        howToUseEyebrow: "21-Day Guide",
        howToUseTitle: ["Three weeks.", "Your regeneration path."],
        howToUseSteps: ["Week 1", "Week 2", "Week 3", "Move on"],
        howToUseNote: ["How your", "companions interlock."],
        timeline: {
          eyebrow: "YOUR REGENERATION PATH",
          headline: "21 days. Your own rhythm.",
          intro:
            "The 21-day guide walks you step by step through the SomnoBalance concept. It's not about doing as much as possible every day. Small, deliberately chosen impulses help you find what fits well into your everyday life.",
          steps: [
            { number: "01", title: "WEEK 1 – NOTICE", body: "Observe your everyday life more consciously and discover the moments where a brief regeneration impulse can help." },
            { number: "02", title: "WEEK 2 – EXPLORE", body: "Get to know different regeneration impulses and find out which ones fit you and your everyday life." },
            { number: "03", title: "WEEK 3 – INTEGRATE", body: "Connect chosen impulses with recurring moments of your day and develop your own personal regeneration rhythm." },
            { number: "04", title: "MOVING ON – FINDING YOUR RHYTHM", body: "Keep what works for you. SomnoBalance gives orientation — you decide which impulses stay with you long-term." },
          ],
        },
        bundleContents: [
          { title: "21-Day Guide", subtitle: "Your thread through the first 21 days.", body: "Small impulses and rituals help you integrate conscious regeneration moments into your everyday life, and develop your personal rhythm step by step." },
          { title: "Regeneration Cards Set", subtitle: "An impulse to match your moment.", body: "Choose a regeneration point or ritual that fits your current need. The cards give you concrete, easy-to-apply impulses for conscious moments in everyday life, for letting go, and for preparing for the night." },
          { title: "SomnoBalance Roll-on", subtitle: "A scent impulse for on the go and at home.", body: "Mindfully applied and noticed, the roll-on can become a personal companion for brief regeneration moments and conscious transitions." },
          { title: "SomnoBalance Oil Blend", subtitle: "Scent as part of your personal ritual.", body: "A scent impulse for conscious regeneration moments and personal rituals. A few drops in the diffuser create a pleasant scent atmosphere and can accompany you while letting go and preparing for the evening." },
        ],
        togetherSection: {
          eyebrow: "THOUGHT TOGETHER",
          headline: "Orientation, impulses and rituals for your everyday life.",
          body: "The 21-day guide gives you orientation. The regeneration cards help you choose fitting impulses. Roll-on and oil blend can accompany conscious moments and transitions with a recurring scent.\n\nYou decide for yourself what to use and when. SomnoBalance doesn't follow a rigid process — it follows your personal regeneration rhythm.",
        },
        dailyMoments: {
          eyebrow: "SOMNOBALANCE IN EVERYDAY LIFE",
          headline: "Small impulses. Matched to your moment.",
          intro: "You don't need to use every component every day. Choose what fits your moment and your personal regeneration needs.",
          cards: [
            { title: "MID-DAY", headline: "A brief moment to pause.", body: "Choose a regeneration card, for example, or use the roll-on as a conscious scent impulse for a brief regeneration moment." },
            { title: "WHILE LETTING GO", headline: "Letting the active day grow quieter.", body: "A chosen regeneration impulse, the roll-on, or the oil blend can accompany a conscious transition between activity and rest." },
            { title: "IN THE EVENING", headline: "Giving the night conscious space.", body: "Use a chosen impulse or a familiar scent as part of your personal evening routine and create a calm transition into the night." },
          ],
        },
        nextCompanionLabel: "Regulate, Let Go, Prepare — your entry.",
        cycleSection: {
          eyebrow: "IN THE SOMNOBALANCE CYCLE",
          activePhases: [true, true, true, false],
          body: "The Starter Set accompanies you especially while regulating, letting go and preparing. The phases give orientation. Which impulses you use when remains individual.",
          note: "The phases are fixed – the application is individual.",
        },
        discoverMore: {
          eyebrow: "KEEP DISCOVERING SOMNOBALANCE",
          headline: "What can complement your regeneration rhythm.",
          body: "SomnoBalance accompanies regeneration throughout the day and into the night. Discover more companions for conscious moments of regeneration and a sleep environment that supports regeneration.",
          cta: "Discover all products →",
          items: [
            { slug: "somnobalance-neck-pillow", blurb: "Individually adjustable support for a consciously designed sleep environment." },
            { slug: "somnobalance-room-spray", blurb: "A scent impulse for your room and conscious transitions." },
            { slug: "somnobalance-mattress", blurb: "Individually adjustable lying comfort for a consciously designed sleep environment." },
          ],
        },
        brandCloseTagline: ["The phases are fixed —", "the application is individual."],
      },
    },
  },

  "somnobalance-neck-pillow": {
    systemRoleLabel: "VORBEREITEN · REGENERIEREN",
    galleryTagline: ["Die Nacht braucht", "andere Bedingungen."],
    galleryImages: [
      "/products/somnobalance-neck-pillow.webp",
      "/products/neck-pillow-form.webp",
      "/products/neck-pillow-insert-plates.webp",
      "/products/neck-pillow-height-settings.webp",
      "/products/neck-pillow-detail-top.webp",
      "/products/neck-pillow-detail-corner.webp",
    ],
    galleryCaptions: {
      1: "Wendbare Form mit zwei unterschiedlich hohen Nackenrollen.",
      2: "Schaumstoffkern mit Einlegeplatten.",
      3: "Sechs Höheneinstellungen: Kissen wenden für höhere oder niedrigere Nackenrolle, dazu 0, 1 oder 2 Einlegeplatten — von ca. 8 cm bis ca. 15 cm.",
    },
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Die Nacht braucht andere", "Bedingungen als der Tag."],
    howToUseImage: "/products/pillow.webp",
    howToUseSteps: [
      { icon: Moon, label: "Höhe einstellen", description: "Wählen Sie mithilfe der wendbaren Form und der Einlegeplatten die passende Höhe." },
      { icon: Bed, label: "Liegeposition finden", description: "Probieren Sie aus, welche Einstellung sich für Ihre bevorzugte Schlafposition angenehm anfühlt." },
      { icon: Cloud, label: "Schlafumgebung vorbereiten", description: "Integrieren Sie das Kissen als individuell angepassten Bestandteil Ihrer Schlafumgebung." },
      { icon: Sun, label: "Gute Voraussetzungen schaffen", description: "Eine passende Schlafumgebung schafft den Rahmen für Komfort und Regeneration während der Nacht." },
    ],
    howToUseNote: ["So individuell wie", "Ihre Liegeposition."],
    vitalizeImage: "/products/neck-pillow-detail-top.webp",
    nextCompanionLabel: "Regulation und Rituale bereiten vor — die Schlafumgebung übernimmt in der Nacht.",
    keyFeatures: [
      {
        "title": "6 Höheneinstellungen",
        "text": "von ca. 8 bis 15 cm"
      },
      {
        "title": "Wendbare Form",
        "text": "zwei unterschiedlich hohe Nackenrollen"
      },
      {
        "title": "Air-Memory-Schaum",
        "text": "offenporiger Schaumstoffkern"
      },
      {
        "title": "Vitalize®-Bezug",
        "text": "mit Far-Infrared-Technologie"
      }
    ],
    explainerSections: [
      {
        "eyebrow": "INDIVIDUELL ANPASSBAR",
        "headline": "Sechs Höhen. Ein Kissen.",
        "body": "Nicht jeder Mensch liegt gleich. Deshalb lässt sich das SomnoBalance Nackenstützkissen flexibel an unterschiedliche Liegebedürfnisse anpassen.\n\nDurch Wenden des Kissens und die Verwendung von 0, 1 oder 2 Einlegeplatten entstehen insgesamt sechs Höheneinstellungen von ca. 8 bis 15 cm."
      },
      {
        "eyebrow": "SO FUNKTIONIERT DIE ANPASSUNG",
        "headline": "Wenden, ergänzen, einstellen.",
        "body": "Kissen wenden – Die unterschiedlich hohen Nackenrollen ermöglichen zwei Grundhöhen.\n\nEinlegeplatten ergänzen – Mit 0, 1 oder 2 Einlegeplatten kann die Höhe zusätzlich verändert werden.\n\nPassende Einstellung finden – So stehen insgesamt sechs unterschiedliche Höhen zur Verfügung."
      },
      {
        "eyebrow": "KOMFORT BEGINNT MIT DEN DETAILS",
        "headline": "Komfort beginnt mit den Details.",
        "body": "Die flexible Höhenanpassung und der Vitalize®-Bezug erfüllen unterschiedliche Aufgaben – gemeinsam machen sie das Nackenstützkissen zu einem bewusst entwickelten Bestandteil der SomnoBalance-Schlafumgebung."
      }
    ],
    cycleSection: {
      "eyebrow": "IM SOMNOBALANCE-KREISLAUF",
      "headline": "Gute Voraussetzungen für die Nacht.",
      "activePhases": [
        false,
        false,
        true,
        true
      ],
      "body": "SomnoBalance beginnt bereits am Tag mit bewussten Regenerationsmomenten und begleitet den Übergang in den Abend. In der Nacht rückt die Schlafumgebung in den Mittelpunkt.\n\nDas SomnoBalance Nackenstützkissen lässt sich individuell an unterschiedliche Liegebedürfnisse anpassen und wird so zu einem Bestandteil einer bewusst gestalteten Schlafumgebung.",
      "note": "SomnoBalance verbindet bewusste Regenerationsmomente am Tag mit guten Voraussetzungen für Regeneration in der Nacht."
    },
    discoverMore: {
      "eyebrow": "SOMNOBALANCE WEITERENTDECKEN",
      "headline": "Ihre Schlafumgebung weiterdenken.",
      "cta": "Alle Produkte entdecken →",
      "items": [
        {
          "slug": "somnobalance-mattress",
          "blurb": "Individuell anpassbarer Liegekomfort für eine bewusst gestaltete Schlafumgebung."
        },
        {
          "slug": "somnobalance-starter-set",
          "blurb": "Ihr Einstieg in die SomnoBalance-Welt – für bewusste Regenerationsmomente vom aktiven Tag bis in die Nacht."
        },
        {
          "slug": "somnobalance-regeneration-cards",
          "blurb": "Regenerationspunkte und Rituale als Impulse für Ihren Alltag."
        }
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        howToUseTitle: [
          "The night needs different",
          "conditions than the day."
        ],
        howToUseNote: [
          "As individual as",
          "your sleeping position."
        ],
        howToUseStepDescriptions: [
          "Use the reversible shape and the insert plates to choose the right height.",
          "Try out which setting feels comfortable for your preferred sleeping position.",
          "Integrate the pillow as an individually adjusted part of your sleep environment.",
          "A suitable sleep environment creates the frame for comfort and regeneration during the night."
        ],
        keyFeatures: [
          {
            "title": "6 height settings",
            "text": "from approx. 8 to 15 cm"
          },
          {
            "title": "Reversible shape",
            "text": "two neck rolls of different heights"
          },
          {
            "title": "Air-Memory foam",
            "text": "open-pore foam core"
          },
          {
            "title": "Vitalize® cover",
            "text": "with far-infrared technology"
          }
        ],
        explainerSections: [
          {
            "eyebrow": "INDIVIDUALLY ADJUSTABLE",
            "headline": "Six heights. One pillow.",
            "body": "Not everyone lies the same way. That is why the SomnoBalance Neck Support Pillow can be flexibly adapted to different lying needs.\n\nBy flipping the pillow and using 0, 1 or 2 insert plates, six height settings from approx. 8 to 15 cm are possible."
          },
          {
            "eyebrow": "HOW THE ADJUSTMENT WORKS",
            "headline": "Flip, add, adjust.",
            "body": "Flip the pillow – the neck rolls of different heights give two basic heights.\n\nAdd insert plates – with 0, 1 or 2 insert plates the height can be changed further.\n\nFind the right setting – this gives six different heights in total."
          },
          {
            "eyebrow": "COMFORT BEGINS WITH THE DETAILS",
            "headline": "Comfort begins with the details.",
            "body": "The flexible height adjustment and the Vitalize® cover serve different purposes – together they make the neck support pillow a deliberately developed part of the SomnoBalance sleep environment."
          }
        ],
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "Good conditions for the night.",
          "activePhases": [
            false,
            false,
            true,
            true
          ],
          "body": "SomnoBalance begins during the day with mindful moments of regeneration and accompanies the transition into the evening. At night, the sleep environment moves into the centre.\n\nThe SomnoBalance Neck Support Pillow can be adapted individually to different lying needs and thus becomes part of a consciously designed sleep environment.",
          "note": "SomnoBalance connects mindful moments of regeneration during the day with good conditions for regeneration at night."
        },
        discoverMore: {
          "eyebrow": "KEEP DISCOVERING SOMNOBALANCE",
          "headline": "Rethink your sleep environment.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-mattress",
              "blurb": "Individually adjustable lying comfort for a consciously designed sleep environment."
            },
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your entry into the SomnoBalance world – for mindful moments of regeneration from the active day into the night."
            },
            {
              "slug": "somnobalance-regeneration-cards",
              "blurb": "Regeneration points and rituals as impulses for your everyday life."
            }
          ]
        },
        systemRoleLabel: "PREPARE · REGENERATE",
        galleryTagline: ["The night needs", "different conditions."],
        galleryCaptions: {
          1: "Reversible shape with two neck rolls of different heights.",
          2: "Foam core with insert plates.",
          3: "Six height settings: flip the pillow for a higher or lower neck roll, then add 0, 1 or 2 insert plates — from approx. 8 cm to approx. 15 cm.",
        },
        howToUseEyebrow: "Sleep Environment",
        howToUseSteps: ["Adjust height", "Find sleeping position", "Prepare sleep environment", "Create good conditions"],
        nextCompanionLabel: "Regulation and rituals prepare — the sleep environment takes over at night.",
      },
    },
  },

  "somnobalance-mattress": {
    systemRoleLabel: "VORBEREITEN · REGENERIEREN",
    galleryTagline: ["Was Sie durch", "die Nacht trägt."],
    galleryImages: [
      "/products/somnobalance-mattress.webp",
      "/products/mattress-layers-h2h3-h2side.webp",
      "/products/mattress-layers-h2h3-h3side.webp",
      "/products/mattress-layers-h3h4-h3side.webp",
      "/products/mattress-layers-h3h4-h4side.webp",
      "/products/mattress-detail-quilting.webp",
      "/products/mattress-detail-vitalize.webp",
      "/products/mattress-detail-handle.webp",
      "/products/mattress-detail-workmanship.webp",
    ],
    // Per the client's reference diagram (SomnoBalance_Produktinformation_
    // Matratze_1Seite.pdf): each Variante is the SAME wendbarer Innenkern
    // shown from both sides, since the whole point is that flipping it
    // swaps the firmness. All 4 reference renders are now covered (both
    // sides of both Varianten).
    galleryCaptions: {
      1: "Variante H2/H3, H2-Seite: Visko-Gel-Topper (blau/weiß marmoriert) · H2 türkisgrün · Kern · H3 anthrazit",
      2: "Variante H2/H3, H3-Seite (gewendet): Visko-Gel-Topper (blau/weiß marmoriert) · H3 anthrazit · Kern · H2 türkisgrün",
      3: "Variante H3/H4, H3-Seite: Visko-Gel-Topper (blau/weiß marmoriert) · H3 anthrazit · Kern · H4 fliederfarben",
      4: "Variante H3/H4, H4-Seite (gewendet): Visko-Gel-Topper (blau/weiß marmoriert) · H4 fliederfarben · Kern · H3 anthrazit",
    },
    howToUseImage: "/products/bed.webp",
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Was Sie durch", "die Nacht trägt."],
    howToUseSteps: [
      { icon: Bed, label: "Festigkeit wählen", description: "Wählen Sie zwischen H2/H3 und H3/H4." },
      { icon: Moon, label: "Liegekomfort anpassen", description: "Durch Wenden des Innenkerns kann zwischen zwei Festigkeiten gewechselt werden." },
      { icon: Cloud, label: "Schlafumgebung vorbereiten", description: "Stimmen Sie Matratze, Kissen und Schlafumgebung auf Ihre persönlichen Bedürfnisse ab." },
      { icon: Sun, label: "Gute Voraussetzungen schaffen", description: "Eine passende Schlafumgebung schafft den Rahmen für Komfort und Regeneration während der Nacht." },
    ],
    howToUseNote: ["Die Nacht braucht", "ihre eigenen Voraussetzungen."],
    vitalizeImage: "/products/mattress-detail-vitalize.webp",
    explainerSections: [
      {
        eyebrow: "Individuell anpassbar",
        headline: "Eine Matratze. Zwei Festigkeiten.",
        body: "Die SomnoBalance Matratze ist in zwei Varianten erhältlich: H2/H3 oder H3/H4. Beide Varianten verbinden zwei unterschiedliche Festigkeiten innerhalb einer Matratze.\n\nSoll sich das Liegegefühl verändern, wird der Innenkern einfach gewendet. So lässt sich der Komfort an unterschiedliche Bedürfnisse anpassen, ohne die gesamte Matratze austauschen zu müssen.\n\nH2 ↔ H3  oder  H3 ↔ H4\nInnenkern wenden → Liegegefühl anpassen",
      },
      {
        eyebrow: "Matratzenaufbau",
        headline: "Komfort, Schicht für Schicht.",
        body: "Im Inneren arbeitet ein hochwertiger 7-Zonen-Taschenfederkern mit rund 500 Federn bei einer Größe von 100 × 200 cm. Der Federkern ist auf beiden Seiten mit jeweils ca. 3 cm Kaltschaum RG 40 abgedeckt.\n\nDie beiden Seiten besitzen unterschiedliche Festigkeiten. Durch Wenden des Innenkerns kann je nach gewählter Variante zwischen H2 und H3 beziehungsweise H3 und H4 gewechselt werden.",
        image: "/products/mattress-detail-quilting.webp",
      },
      {
        eyebrow: "Integriertes System",
        headline: "Topper und Matratze als Einheit.",
        body: "Ein ca. 4 cm starker Visko-Gel-Topper RG 50 liegt auf dem wendbaren Innenkern. Innenkern und Topper befinden sich gemeinsam innerhalb des SomnoBalance Matratzenbezugs.\n\nDadurch verbindet die Matratze den Komfort eines zusätzlichen Toppers mit den Vorteilen einer geschlossenen Matratzenlösung. Der Topper bleibt in das Gesamtsystem integriert, ein separates Verrutschen auf der Matratze wird vermieden.",
      },
      {
        eyebrow: "Komfort anpassen",
        headline: "Mit wenigen Handgriffen.",
        body: "Der vierseitige Reißverschluss ermöglicht das Öffnen des oberen Bezugsteils. Anschließend wird der Visko-Gel-Topper abgenommen, der Innenkern gewendet und der Topper wieder auf den Kern gelegt. Danach wird der Bezug wieder geschlossen.",
      },
      {
        eyebrow: "Für zwei",
        headline: "Individueller Komfort auf beiden Bettseiten.",
        body: "Bei Matratzen ab 160 cm Breite kommen zwei separat wendbare Innenkerne unter einem durchgehenden Topper und einem gemeinsamen Bezug zum Einsatz.\n\nDadurch kann jede Bettseite unabhängig auf die gewünschte Festigkeit eingestellt werden, während Topper und Bezug eine durchgehende Oberfläche bilden.",
      },
    ],
    nextCompanionLabel: "Regulation und Rituale bereiten den Übergang vor. Die Schlafumgebung übernimmt in der Nacht.",
    firmnessNote: "Der wendbare Innenkern bietet zwei unterschiedliche Festigkeiten innerhalb einer Matratze. Durch Wenden des Innenkerns lässt sich das Liegegefühl anpassen.",
    consult: {
      "question": "Unsicher bei Größe oder Festigkeit?",
      "label": "Persönliche Beratung anfragen →"
    },
    keyFeatures: [
      {
        "title": "Zwei Festigkeiten",
        "text": "Wendbarer Innenkern"
      },
      {
        "title": "7-Zonen-Taschenfederkern",
        "text": "Hochwertiger Matratzenaufbau"
      },
      {
        "title": "Integrierter Visko-Gel-Topper",
        "text": "Komfort innerhalb eines Systems"
      },
      {
        "title": "Flexibel anpassbar",
        "text": "Verschiedene Größen und Festigkeitskombinationen"
      }
    ],
    afterUnpacking: {
      "title": "Nach dem Auspacken",
      "body": "Bitte geben Sie der Matratze nach dem Auspacken etwa 48–72 Stunden Zeit, damit sie ihre vollständige Form und Höhe entfalten kann."
    },
    cycleSection: {
      "eyebrow": "IM SOMNOBALANCE-KREISLAUF",
      "headline": "Gute Voraussetzungen für die Nacht.",
      "activePhases": [
        false,
        false,
        true,
        true
      ],
      "body": "SomnoBalance beginnt bereits am Tag mit bewussten Regenerationsmomenten und begleitet den Übergang in den Abend. In der Nacht rückt die Schlafumgebung in den Mittelpunkt. Die SomnoBalance Matratze lässt sich an unterschiedliche Komfortbedürfnisse anpassen und schafft damit eine individuell abgestimmte Grundlage für die Nacht.",
      "note": "SomnoBalance verbindet bewusste Regenerationsmomente am Tag mit guten Voraussetzungen für Regeneration in der Nacht."
    },
    discoverMore: {
      "eyebrow": "SOMNOBALANCE WEITERENTDECKEN",
      "headline": "Ihre Schlafumgebung weiterdenken.",
      "cta": "Alle Produkte entdecken →",
      "items": [
        {
          "slug": "somnobalance-neck-pillow",
          "blurb": "Individuell anpassbare Unterstützung für eine bewusst gestaltete Schlafumgebung."
        },
        {
          "slug": "somnobalance-starter-set",
          "blurb": "Ihr Einstieg in die SomnoBalance-Welt – für bewusste Regenerationsmomente vom aktiven Tag bis in die Nacht."
        },
        {
          "slug": "somnobalance-regeneration-cards",
          "blurb": "Regenerationspunkte und Rituale als Impulse für Ihren Alltag."
        }
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        howToUseStepDescriptions: [
          "Choose between H2/H3 and H3/H4.",
          "Flipping the inner core switches between two firmness levels.",
          "Match mattress, pillow and sleep environment to your personal needs.",
          "A suitable sleep environment creates the frame for comfort and regeneration during the night."
        ],
        firmnessNote: "The reversible inner core offers two different firmness levels within one mattress. Flipping the inner core adjusts how it feels to lie on.",
        consult: {
          "question": "Unsure about size or firmness?",
          "label": "Request personal advice →"
        },
        keyFeatures: [
          {
            "title": "Two firmness levels",
            "text": "Reversible inner core"
          },
          {
            "title": "7-zone pocket-spring core",
            "text": "High-quality mattress construction"
          },
          {
            "title": "Integrated Viscogel topper",
            "text": "Comfort within one system"
          },
          {
            "title": "Flexibly adjustable",
            "text": "Various sizes and firmness combinations"
          }
        ],
        afterUnpacking: {
          "title": "After unpacking",
          "body": "Please allow the mattress about 48–72 hours after unpacking to fully expand to its final shape and height."
        },
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "Good conditions for the night.",
          "activePhases": [
            false,
            false,
            true,
            true
          ],
          "body": "SomnoBalance begins during the day with mindful moments of regeneration and accompanies the transition into the evening. At night, the sleep environment moves into the centre. The SomnoBalance Mattress adapts to different comfort needs and thus provides an individually tuned foundation for the night.",
          "note": "SomnoBalance connects mindful moments of regeneration during the day with good conditions for regeneration at night."
        },
        discoverMore: {
          "eyebrow": "KEEP DISCOVERING SOMNOBALANCE",
          "headline": "Rethink your sleep environment.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-neck-pillow",
              "blurb": "Individually adjustable support for a consciously designed sleep environment."
            },
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your entry into the SomnoBalance world – for mindful moments of regeneration from the active day into the night."
            },
            {
              "slug": "somnobalance-regeneration-cards",
              "blurb": "Regeneration points and rituals as impulses for your everyday life."
            }
          ]
        },
        systemRoleLabel: "PREPARE · REGENERATE",
        galleryTagline: ["What carries you", "through the night."],
        galleryCaptions: {
          1: "H2/H3 edition, H2 side: Viscogel topper (blue/white marbled) · H2 turquoise · core · H3 anthracite",
          2: "H2/H3 edition, H3 side (flipped): Viscogel topper (blue/white marbled) · H3 anthracite · core · H2 turquoise",
          3: "H3/H4 edition, H3 side: Viscogel topper (blue/white marbled) · H3 anthracite · core · H4 lilac",
          4: "H3/H4 edition, H4 side (flipped): Viscogel topper (blue/white marbled) · H4 lilac · core · H3 anthracite",
        },
        howToUseEyebrow: "Sleep Environment",
        howToUseTitle: ["What carries you", "through the night."],
        howToUseSteps: ["Choose firmness", "Adjust comfort", "Prepare sleep environment", "Create good conditions"],
        howToUseNote: ["The night needs", "its own conditions."],
        explainerSections: [
          {
            eyebrow: "Individually adjustable",
            headline: "One mattress. Two firmness levels.",
            body: "The SomnoBalance Mattress is available in two editions: H2/H3 or H3/H4. Both combine two different firmness levels within a single mattress.\n\nTo change the feel, simply flip the inner core — comfort adapts to different needs without replacing the whole mattress.\n\nH2 ↔ H3  or  H3 ↔ H4\nFlip the inner core → adjust the feel",
          },
          {
            eyebrow: "Mattress construction",
            headline: "Comfort, layer by layer.",
            body: "Inside works a high-quality 7-zone pocket-spring core with around 500 springs at 100 × 200 cm. The spring core is covered on both sides with approx. 3 cm of cold foam, RG 40.\n\nThe two sides carry different firmness levels — flipping the inner core switches between H2 and H3, or H3 and H4, depending on the edition.",
          },
          {
            eyebrow: "Integrated system",
            headline: "Topper and mattress as one.",
            body: "A roughly 4 cm Viscogel topper (RG 50) sits on the reversible inner core. Inner core and topper sit together inside the SomnoBalance mattress cover.\n\nThis combines the comfort of an additional topper with the benefits of a closed mattress solution — the topper stays integrated into the whole system, and separate sliding is avoided.",
          },
          {
            eyebrow: "Adjusting comfort",
            headline: "In just a few steps.",
            body: "The four-sided zip allows the upper part of the cover to be opened. The Viscogel topper is then removed, the inner core is flipped and the topper is placed back on the core. Afterwards the cover is closed again.",
          },
          {
            eyebrow: "For two",
            headline: "Individual comfort on both sides of the bed.",
            body: "From 160 cm width, two separately reversible inner cores sit under one continuous topper and one shared cover.\n\nThis lets each side of the bed be set to its own firmness independently, while the topper and cover keep one continuous surface.",
          },
        ],
        nextCompanionLabel: "Regulation and rituals prepare the transition. The sleep environment takes over at night.",
      },
    },
  },

};
