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
      "/products/gallery/oil-blend-4.webp",
      "/products/gallery/oil-rollon-pair.webp",
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
    cycleSection: {
      "eyebrow": "IM SOMNOBALANCE-KREISLAUF",
      "headline": "Duft als Teil Ihrer Rituale.",
      "activePhases": [
        true,
        true,
        true,
        false
      ],
      "body": "Die SomnoBalance Ölmischung begleitet persönliche Rituale und Duftmomente – über Diffuser oder Duftlampe im Tagesverlauf, beim Loslassen und bei der Vorbereitung auf den Abend.",
      "note": "Die Phasen geben Orientierung. Wann Sie die Ölmischung in Ihren Tagesrhythmus integrieren, bleibt individuell."
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
          "slug": "somnobalance-room-spray",
          "blurb": "Ein Duftimpuls für Ihren Raum und bewusste Übergänge."
        },
        {
          "slug": "somnobalance-starter-set",
          "blurb": "Ihr Einstieg in die SomnoBalance-Welt – für bewusste Regenerationsmomente vom aktiven Tag bis in die Nacht."
        },
        { "slug": "somnobalance-regeneration-tea", "blurb": "Ein bewusstes Ritual für ruhigere Momente und den Übergang in den Abend." },
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "Fragrance as part of your rituals.",
          "activePhases": [
            true,
            true,
            true,
            false
          ],
          "body": "The SomnoBalance Oil Blend accompanies personal rituals and fragrance moments – through a diffuser or oil burner during the day, while letting go and when preparing for the evening.",
          "note": "The phases provide guidance. When you integrate the oil blend into your daily rhythm remains an individual choice."
        },
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "More companions for your rhythm of regeneration.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful fragrance cue for on the go and at home."
            },
            {
              "slug": "somnobalance-room-spray",
              "blurb": "A fragrance cue for your space and for mindful transitions."
            },
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your introduction to the SomnoBalance world, for mindful moments of regeneration from the active day into the night."
            },
            { "slug": "somnobalance-regeneration-tea", "blurb": "A mindful ritual for calmer moments and the transition into the evening." },
          ]
        },
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
    // Client order: 1 bottle (original label) · 2 spray used naturally in a
    // room · 3 everyday transition from activity to a quieter moment ·
    // 4 warm room atmosphere for the evening.
    galleryImages: [
      "/products/somnobalance-room-spray.webp",
      "/products/room-spray-curtain.webp",
      "/products/gallery/room-spray-transition.webp",
      "/products/gallery/room-spray-evening.webp",
      "/products/room-spray-bottle.webp",
      "/products/room-spray-hand.webp",
      "/products/gallery/room-spray-on-pillow.webp",
      "/products/gallery/room-spray-pillow-bed.webp",
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
    howToUseNote: ["", ""],
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
        },
        { "slug": "somnobalance-starter-set", "blurb": "Ihr Einstieg in die SomnoBalance-Welt – für bewusste Regenerationsmomente vom aktiven Tag bis in die Nacht." },
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
          "Notice what kind of atmosphere you would like to create for the moment ahead.",
          "Shake thoroughly before use, spray into the room, and allow the fragrance to disperse.",
          "Use the fragrance as a recurring cue for a mindful shift between activity and quieter moments.",
          "If desired, integrate the room spray into your personal transition into the evening."
        ],
        statement: "Sometimes a transition begins with the atmosphere of a room.",
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "Atmosphere for mindful transitions.",
          "activePhases": [
            false,
            true,
            true,
            false
          ],
          "body": "The SomnoBalance Room Spray primarily accompanies the phases of letting go and preparing. With a few sprays, the atmosphere of a room can be consciously changed, and a recurring fragrance cue can be integrated into personal transitions and rituals.",
          "note": "The phases provide guidance. When you integrate the room spray into your personal daily rhythm remains an individual choice."
        },
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "More companions for your rhythm of regeneration.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful fragrance cue for on the go and at home."
            },
            {
              "slug": "somnobalance-oil-blend",
              "blurb": "A fragrance cue for mindful moments of regeneration and personal rituals."
            },
            {
              "slug": "somnobalance-regeneration-tea",
              "blurb": "A mindful ritual for quieter moments and the transition into the evening."
            },
            { "slug": "somnobalance-starter-set", "blurb": "Your introduction to the SomnoBalance world, for mindful moments of regeneration from an active day into the night." },
          ]
        },
        systemRoleLabel: "LET GO · PREPARE",
        galleryTagline: ["Create space.", "Begin transition."],
        howToUseEyebrow: "Application",
        howToUseSteps: ["Notice the room", "Add a fragrance cue", "Shape the transition", "Prepare for the evening"],
        howToUseNote: ["", ""],
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
      "/products/gallery/tea-pouring.webp",
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
        },
        { "slug": "somnobalance-oil-blend", "blurb": "Ein Duftimpuls für bewusste Regenerationsmomente und persönliche Rituale." },
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "More companions for your rhythm of regeneration.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-regeneration-cards",
              "blurb": "Regeneration points and rituals as prompts for everyday life."
            },
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful fragrance cue for on the go and at home."
            },
            {
              "slug": "somnobalance-room-spray",
              "blurb": "A fragrance cue for your space and for mindful transitions."
            },
            { "slug": "somnobalance-oil-blend", "blurb": "A fragrance cue for mindful moments of regeneration and personal rituals." },
          ]
        },
        cycleSection: {
          "eyebrow": "WITHIN THE SOMNOBALANCE CYCLE",
          "headline": "A ritual for mindful transitions.",
          "activePhases": [
            false,
            true,
            true,
            false
          ],
          "body": "SomnoBalance Regeneration Tea can accompany the phases of Letting Go and Preparing. A thoughtfully prepared cup of tea can create a moment to pause the active day and approach calmer phases mindfully.",
          "note": "The phases provide guidance. When you integrate the tea into your personal daily rhythm remains an individual choice."
        },
        howToUseStepDescriptions: [
          "Use 1 heaped teaspoon of tea per 200 ml of water.",
          "Pour boiling water over the tea.",
          "Leave to steep for 6–8 minutes.",
          "Make the cup of tea a mindful moment or a transition within your own daily rhythm."
        ],
        howToUseSteps: [
          "Prepare",
          "Pour",
          "Allow to steep",
          "Enjoy mindfully"
        ],
        howToUseNote: [
          "One cup.",
          "One mindful moment."
        ],
        howToUseTitle: [
          "Sometimes letting go",
          "begins with something very simple."
        ],
        systemRoleLabel: "LET GO · PREPARE",
        galleryTagline: ["Take time.", "Arrive."],
        howToUseEyebrow: "Preparation",
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
      "/products/gallery/cards-in-use.webp",
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
        },
        { "slug": "somnobalance-room-spray", "blurb": "Ein Duftimpuls für Ihren Raum und bewusste Übergänge." },
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "More companions for your rhythm of regeneration.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your introduction to the world of SomnoBalance."
            },
            {
              "slug": "somnobalance-roll-on",
              "blurb": "A mindful fragrance cue for on the go and at home."
            },
            {
              "slug": "somnobalance-regeneration-tea",
              "blurb": "A mindful ritual for calmer moments and the transition into the evening."
            },
            { "slug": "somnobalance-room-spray", "blurb": "A fragrance cue for your space and for mindful transitions." },
          ]
        },
        cycleSection: {
          "eyebrow": "WITHIN THE SOMNOBALANCE CYCLE",
          "headline": "Prompts for different moments throughout your day.",
          "activePhases": [
            true,
            true,
            true,
            false
          ],
          "body": "The SomnoBalance Regeneration Cards can accompany you through different phases of the day. Choose a suitable prompt during an active day, while letting go, or as part of your personal preparation for the evening.",
          "note": "The phases provide guidance. The choice of which prompt to use and when remains personal."
        },
        explainerSections: [
          {
            "eyebrow": "TWO TYPES OF CARDS",
            "headline": "Choose a point – or follow a ritual.",
            "body": "13 REGENERATION-POINT CARDS\nEach shows one selected regeneration point with its position or orientation and instructions.\n\n10 REGENERATION-RITUAL CARDS\nThey combine several prompts into a prepared sequence for different situations and moments.\n\nYou can either choose an individual regeneration point or follow a prepared regeneration ritual. The 2–3 minutes apply only to one individual regeneration point."
          },
          {
            "eyebrow": "NO FIXED SYSTEM",
            "headline": "Not every card. Not every day. Just what suits you right now.",
            "body": "The Regeneration Cards offer guidance and concrete prompts. You decide which card you bring into your everyday life, and when."
          }
        ],
        howToUseStepDescriptions: [
          "Choose an individual regeneration point or a ritual that suits your moment.",
          "Follow the instructions or sequence on the selected card.",
          "Gently hold an individual regeneration point for approximately 2–3 minutes.",
          "Carry the moment with you consciously and continue your day at your own pace."
        ],
        howToUseSteps: [
          "Choose a card",
          "Apply the prompt",
          "Take your time",
          "Return to everyday life"
        ],
        howToUseNote: [
          "A prompt that",
          "suits your moment."
        ],
        howToUseTitle: [
          "Choose a card.",
          "Apply the prompt."
        ],
        systemRoleLabel: "REGULATE · LET GO · PREPARE",
        galleryTagline: ["Which companion", "do you need right now?"],
        howToUseEyebrow: "Application",
        nextCompanionLabel: "Regulate & Let Go — for every moment in daily life.",
      },
    },
  },

  "somnobalance-starter-set": {
    systemRoleLabel: "IHR EINSTIEG IN SOMNOBALANCE",
    howToUseImage: "/products/gallery/starter-set-guide-table.webp",
    galleryTagline: ["Drei Wochen.", "Ihr Weg."],
    galleryImages: [
      "/products/somnobalance-starter-set.webp",
      "/products/starter-set-components.webp",
      "/products/starter-set-guide-cards.webp",
      "/products/gallery/starter-set-guide-rollon.webp",
      "/products/gallery/starter-set-guide-table.webp",
      "/products/gallery/starter-set-bag-large.webp",
      "/products/gallery/starter-set-cards-fan.webp",
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
        { "slug": "somnobalance-regeneration-tea", "blurb": "Ein bewusstes Ritual für ruhigere Momente und den Übergang in den Abend." },
      ],
    },
    statement: "Hier beginne ich, SomnoBalance in meinen eigenen Alltag zu integrieren.",
    brandCloseTagline: ["Die Phasen sind fest —", "die Anwendung ist individuell."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        statement: "This is where I begin integrating SomnoBalance into my everyday life.",
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "What can complement your rhythm of regeneration.",
          "body": "SomnoBalance accompanies regeneration throughout the day and into the night. Discover more products to support mindful moments of regeneration and a sleep environment designed to support rest.",
          "cta": "Explore all products →",
          "items": [
            {
              "slug": "somnobalance-neck-pillow",
              "blurb": "Adjustable support for a thoughtfully designed sleep environment."
            },
            {
              "slug": "somnobalance-room-spray",
              "blurb": "A fragrance cue for your space and for mindful transitions."
            },
            {
              "slug": "somnobalance-mattress",
              "blurb": "Customisable lying comfort for a thoughtfully designed sleep environment."
            },
            { "slug": "somnobalance-regeneration-tea", "blurb": "A mindful ritual for calmer moments and the transition into the evening." },
          ]
        },
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "activePhases": [
            true,
            true,
            true,
            false
          ],
          "body": "The Starter Set particularly supports you through the phases of regulating, letting go, and preparing. The phases provide guidance; when you use each prompt remains a personal choice.",
          "note": "The phases are fixed – the way they are used is individual."
        },
        timeline: {
          "eyebrow": "YOUR REGENERATION JOURNEY",
          "headline": "21 days. Your own rhythm.",
          "intro": "The 21-day guide takes you through the SomnoBalance concept step by step. The aim is not to do as much as possible every day. Small, consciously chosen prompts help you discover what fits naturally into your everyday life.",
          "steps": [
            {
              "number": "01",
              "title": "WEEK 1 – NOTICE",
              "body": "Pay closer attention to your everyday life and notice the moments when a brief regeneration prompt might be helpful."
            },
            {
              "number": "02",
              "title": "WEEK 2 – EXPLORE MORE DEEPLY",
              "body": "Explore different regeneration prompts and discover which ones suit you and your everyday life."
            },
            {
              "number": "03",
              "title": "WEEK 3 – INTEGRATE",
              "body": "Connect selected prompts with recurring moments in your day and use them to develop your personal rhythm of regeneration."
            },
            {
              "number": "04",
              "title": "MOVING FORWARD – FIND YOUR RHYTHM",
              "body": "Keep what feels right for you. SomnoBalance provides guidance – you decide which prompts you want to continue using over the long term."
            }
          ]
        },
        bundleContents: [
          {
            "title": "21-Day Guide",
            "subtitle": "Your guiding thread for the first 21 days.",
            "body": "Small prompts and rituals help you incorporate mindful moments of regeneration into your everyday life and gradually develop your personal rhythm."
          },
          {
            "title": "Regeneration Card Set",
            "subtitle": "A prompt for the moment you’re in.",
            "body": "Choose a regeneration point or ritual that suits your current needs. The cards offer practical, easy-to-follow prompts for mindful moments in everyday life, for letting go, and for preparing for the night."
          },
          {
            "title": "SomnoBalance Roll-on",
            "subtitle": "A fragrance cue for when you’re out and about or at home.",
            "body": "When applied and experienced mindfully, the roll-on can become a personal companion for brief moments of regeneration and intentional transitions."
          },
          {
            "title": "SomnoBalance Oil Blend",
            "subtitle": "Scent as part of your personal ritual.",
            "body": "A fragrance cue for mindful moments of regeneration and personal rituals. A few drops in a diffuser create a pleasant fragrance atmosphere and can accompany you as you let go and prepare for the evening."
          }
        ],
        dailyMoments: {
          "eyebrow": "SOMNOBALANCE IN EVERYDAY LIFE",
          "headline": "Small prompts. Suited to your moment.",
          "intro": "You do not need to use every component every day. Choose what suits the moment and your personal need for regeneration.",
          "cards": [
            {
              "title": "IN THE MIDDLE OF THE DAY",
              "headline": "A brief moment to pause.",
              "body": "For example, choose a regeneration card or use the roll-on as a mindful fragrance cue for a brief moment of regeneration."
            },
            {
              "title": "LETTING GO",
              "headline": "Let the busy day gradually grow quieter.",
              "body": "A selected regeneration prompt, the roll-on, or the oil blend can accompany an intentional transition from activity to rest."
            },
            {
              "title": "IN THE EVENING",
              "headline": "Make intentional space for the night.",
              "body": "Use a selected prompt or a familiar scent as part of your personal evening routine and create a calm transition into the night."
            }
          ]
        },
        togetherSection: {
          "eyebrow": "DESIGNED TO WORK TOGETHER",
          "headline": "Guidance, prompts, and rituals for your everyday life.",
          "body": "The 21-day guide provides direction. The Regeneration Cards help you choose suitable prompts. The roll-on and oil blend can accompany mindful moments and transitions with a familiar scent.\n\nYou decide what to use and when. SomnoBalance does not follow a rigid sequence – it follows your personal rhythm of regeneration."
        },
        systemRoleLabel: "YOUR INTRODUCTION TO SOMNOBALANCE",
        galleryTagline: ["Three weeks.", "Your path."],
        howToUseEyebrow: "21-Day Guide",
        howToUseTitle: ["Three weeks.", "Your regeneration path."],
        howToUseSteps: ["Week 1", "Week 2", "Week 3", "Move on"],
        howToUseNote: ["How your", "companions interlock."],
        nextCompanionLabel: "Regulate, Let Go, Prepare — your entry.",
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
      "/products/gallery/neck-pillow-3.webp",
      "/products/gallery/neck-pillow-4.webp",
      "/products/gallery/neck-pillow-spray.webp",
      "/products/gallery/mattress-lifestyle.webp",
    ],
    galleryCaptions: {
      1: "Wendbare Form mit zwei unterschiedlich hohen Nackenrollen.",
      2: "Schaumstoffkern mit Einlegeplatten.",
      3: "Sechs Höheneinstellungen: Kissen wenden für höhere oder niedrigere Nackenrolle, dazu 0, 1 oder 2 Einlegeplatten — von ca. 8 cm bis ca. 15 cm.",
    },
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Die Nacht braucht andere", "Bedingungen als der Tag."],
    howToUseImage: "/products/neck-pillow-height-settings.webp",
    howToUseSteps: [
      { icon: Moon, label: "Höhe einstellen", description: "Wählen Sie mithilfe der wendbaren Form und der Einlegeplatten die passende Höhe." },
      { icon: Bed, label: "Liegeposition finden", description: "Probieren Sie aus, welche Einstellung sich für Ihre bevorzugte Schlafposition angenehm anfühlt." },
      { icon: Cloud, label: "Schlafumgebung vorbereiten", description: "Integrieren Sie das Kissen als individuell angepassten Bestandteil Ihrer Schlafumgebung." },
      { icon: Sun, label: "Gute Voraussetzungen schaffen", description: "Eine passende Schlafumgebung schafft den Rahmen für Komfort und Regeneration während der Nacht." },
    ],
    howToUseNote: ["So individuell wie", "Ihre Liegeposition."],
    vitalizeImage: "/products/neck-pillow-detail-corner.webp",
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
        },
        { "slug": "somnobalance-room-spray", "blurb": "Ein Duftimpuls für Ihren Raum und bewusste Übergänge." },
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "Rethink your sleep environment.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-mattress",
              "blurb": "Individually adjustable lying comfort for a thoughtfully designed sleep environment."
            },
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your introduction to the SomnoBalance world, for mindful moments of regeneration from an active day into the night."
            },
            {
              "slug": "somnobalance-regeneration-cards",
              "blurb": "Regeneration points and rituals as prompts for everyday life."
            },
            { "slug": "somnobalance-room-spray", "blurb": "A fragrance cue for your space and for mindful transitions." },
          ]
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
          "body": "SomnoBalance begins during the day with mindful moments of regeneration and accompanies the transition into the evening. At night, the sleep environment takes centre stage.\n\nThe SomnoBalance Neck Support Pillow can be individually adjusted to different lying preferences, making it part of a thoughtfully designed sleep environment.",
          "note": "SomnoBalance connects mindful moments of regeneration during the day with good conditions for regeneration at night."
        },
        keyFeatures: [
          {
            "title": "6 height settings",
            "text": "approx. 8–15 cm"
          },
          {
            "title": "Reversible shape",
            "text": "two neck rolls of different heights"
          },
          {
            "title": "Air Memory foam",
            "text": "open-cell foam core"
          },
          {
            "title": "Vitalize® cover",
            "text": "Far-Infrared Technology"
          }
        ],
        howToUseStepDescriptions: [
          "Use the reversible shape and insert plates to choose a suitable height.",
          "Try which setting feels comfortable for your preferred sleeping position.",
          "Integrate the pillow as an individually adjusted part of your sleep environment.",
          "A suitable sleep environment provides the setting for comfort and regeneration during the night."
        ],
        howToUseSteps: [
          "Adjust the height",
          "Find your lying position",
          "Prepare the sleep environment",
          "Create the right conditions"
        ],
        howToUseTitle: [
          "The night needs different",
          "conditions than the day."
        ],
        howToUseNote: [
          "As individual as",
          "your lying position."
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
        systemRoleLabel: "PREPARE · REGENERATE",
        galleryTagline: ["The night needs", "different conditions."],
        galleryCaptions: {
          1: "Reversible shape with two neck rolls of different heights.",
          2: "Foam core with insert plates.",
          3: "Six height settings: flip the pillow for a higher or lower neck roll, then add 0, 1 or 2 insert plates — from approx. 8 cm to approx. 15 cm.",
        },
        howToUseEyebrow: "Sleep Environment",
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
      "/products/mattress-detail-edge.webp",
      "/products/mattress-detail-handle.webp",
      "/products/mattress-detail-workmanship.webp",
      "/products/gallery/mattress-lifestyle.webp",
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
    howToUseImage: "/products/mattress-detail-handle.webp",
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
        },
        { "slug": "somnobalance-room-spray", "blurb": "Ein Duftimpuls für Ihren Raum und bewusste Übergänge." },
      ]
    },
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        discoverMore: {
          "eyebrow": "DISCOVER MORE OF SOMNOBALANCE",
          "headline": "Continue shaping your sleep environment.",
          "cta": "Discover all products →",
          "items": [
            {
              "slug": "somnobalance-neck-pillow",
              "blurb": "Individually adjustable support for a thoughtfully designed sleep environment."
            },
            {
              "slug": "somnobalance-starter-set",
              "blurb": "Your introduction to the SomnoBalance world, for mindful moments of regeneration from an active day into the night."
            },
            {
              "slug": "somnobalance-regeneration-cards",
              "blurb": "Regeneration points and rituals as prompts for everyday life."
            },
            { "slug": "somnobalance-room-spray", "blurb": "A fragrance cue for your space and for mindful transitions." },
          ]
        },
        cycleSection: {
          "eyebrow": "IN THE SOMNOBALANCE CYCLE",
          "headline": "The right conditions for the night.",
          "activePhases": [
            false,
            false,
            true,
            true
          ],
          "body": "SomnoBalance supports mindful moments during the day and the transition into the evening; at night, the sleep environment takes centre stage. The mattress can be adjusted to different comfort needs and provides an individually tailored basis for the night.",
          "note": "SomnoBalance connects mindful moments of regeneration during the day with the right conditions for regeneration at night."
        },
        afterUnpacking: {
          "title": "After unpacking",
          "body": "After unpacking, please allow the mattress approximately 48–72 hours to reach its full shape and height."
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
            "title": "Integrated visco-gel topper",
            "text": "Comfort within one system"
          },
          {
            "title": "Flexibly adjustable",
            "text": "Different sizes and firmness combinations"
          }
        ],
        consult: {
          "question": "Unsure about size or firmness?",
          "label": "Request a personal consultation →"
        },
        firmnessNote: "The reversible inner core provides two different firmness levels within one mattress. Turn the inner core over to adjust the feel.",
        howToUseStepDescriptions: [
          "Choose between H2/H3 and H3/H4.",
          "Turn the inner core to switch between firmness levels.",
          "Align the mattress, pillow and sleep environment with personal needs.",
          "A suitable sleep environment provides the setting for comfort and regeneration during the night."
        ],
        howToUseSteps: [
          "Choose firmness",
          "Adjust lying comfort",
          "Prepare the sleep environment",
          "Create the right conditions"
        ],
        systemRoleLabel: "PREPARE · REGENERATE",
        galleryTagline: ["What carries you", "through the night."],
        galleryCaptions: {
          1: "H2/H3 edition, H2 side: visco-gel topper (blue/white marbled) · H2 turquoise · core · H3 anthracite",
          2: "H2/H3 edition, H3 side (flipped): visco-gel topper (blue/white marbled) · H3 anthracite · core · H2 turquoise",
          3: "H3/H4 edition, H3 side: visco-gel topper (blue/white marbled) · H3 anthracite · core · H4 lilac",
          4: "H3/H4 edition, H4 side (flipped): visco-gel topper (blue/white marbled) · H4 lilac · core · H3 anthracite",
        },
        howToUseEyebrow: "Sleep Environment",
        howToUseTitle: ["What carries you", "through the night."],
        howToUseNote: ["The night needs", "its own conditions."],
        explainerSections: [
          {
            eyebrow: "Individually adjustable",
            headline: "One mattress. Two firmness levels.",
            body: "The SomnoBalance Mattress is available in two editions: H2/H3 or H3/H4. Both combine two different firmness levels within a single mattress.\n\nTo change the feel, simply turn the inner core — comfort adapts to different needs without replacing the whole mattress.\n\nH2 ↔ H3  or  H3 ↔ H4\nTurn the inner core → adjust the feel of the mattress.",
          },
          {
            eyebrow: "Mattress construction",
            headline: "Comfort, layer by layer.",
            body: "Inside works a high-quality 7-zone pocket-spring core with around 500 springs at 100 × 200 cm. The spring core is covered on both sides with approx. 3 cm of cold foam, RG 40.\n\nThe two sides carry different firmness levels — turning the inner core switches between H2 and H3, or H3 and H4, depending on the edition.",
          },
          {
            eyebrow: "Integrated system",
            headline: "Topper and mattress as one unit.",
            body: "A roughly 4 cm visco-gel topper (RG 50) sits on the reversible inner core. Inner core and topper sit together inside the SomnoBalance mattress cover.\n\nThis combines the comfort of an additional topper with the benefits of a closed mattress solution — the topper stays integrated into the whole system, and separate sliding is avoided.",
          },
          {
            eyebrow: "Adjust comfort",
            headline: "In just a few steps.",
            body: "The four-sided zip allows the upper part of the cover to be opened. The visco-gel topper is then removed, the inner core is turned and the topper is placed back on the core. Afterwards the cover is closed again.",
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
