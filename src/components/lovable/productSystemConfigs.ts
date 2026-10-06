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
    galleryTagline: ["Loslassen.", "Vorbereiten."],
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
    howToUseImage: "/products/spray.webp",
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Beginnen Sie", "mit dem Raum."],
    howToUseSteps: [
      { icon: Wind, label: "Raum wahrnehmen" },
      { icon: Sparkles, label: "Duftimpuls setzen" },
      { icon: Cloud, label: "Übergang gestalten" },
      { icon: Moon, label: "Auf den Abend vorbereiten" },
    ],
    howToUseNote: ["Verändere nicht den", "ganzen Abend."],
    nextCompanionLabel: "Ihr Begleiter für den Übergang zur Nacht.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "LET GO · PREPARE",
        galleryTagline: ["Create space.", "Begin transition."],
        howToUseEyebrow: "Application",
        howToUseTitle: ["Begin", "with the room."],
        howToUseSteps: ["Notice the room", "Set a scent impulse", "Shape the transition", "Prepare for the evening"],
        howToUseNote: ["Do not change the", "whole evening."],
        nextCompanionLabel: "Your companion for the transition to night.",
      },
    },
  },

  "somnobalance-regeneration-tea": {
    systemRoleLabel: "LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Zeit nehmen.", "Ankommen."],
    howToUseEyebrow: "Zubereitung",
    howToUseTitle: ["Manchmal beginnt Loslassen", "mit etwas ganz Einfachem."],
    howToUseSteps: [
      { icon: Droplet, label: "1 TL pro 200 ml aufgießen" },
      { icon: Cloud, label: "Ziehen lassen, 6–8 Min." },
      { icon: Sun, label: "Zeit nehmen" },
      { icon: Moon, label: "Bewusst genießen" },
    ],
    howToUseNote: ["Eine Tasse.", "Ein bewusster Moment."],
    nextCompanionLabel: "Ihr Begleiter für ruhigere Abendmomente.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "LET GO · PREPARE",
        galleryTagline: ["Take time.", "Arrive."],
        howToUseEyebrow: "Preparation",
        howToUseTitle: ["Sometimes letting go", "starts with something simple."],
        howToUseSteps: ["Steep 1 tsp per 200 ml", "Let steep, 6–8 min.", "Take time", "Enjoy mindfully"],
        howToUseNote: ["A cup.", "A mindful moment."],
        nextCompanionLabel: "Your companion for quieter evening moments.",
      },
    },
  },

  "somnobalance-regeneration-cards": {
    systemRoleLabel: "REGULIEREN · LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Welche Begleitung", "brauchen Sie gerade?"],
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Karte wählen.", "Impuls anwenden."],
    howToUseSteps: [
      { icon: Sparkles, label: "Karte wählen" },
      { icon: Droplet, label: "Impuls anwenden" },
      { icon: Cloud, label: "2–3 Minuten je Regenerationspunkt" },
      { icon: Sun, label: "Weitergehen" },
    ],
    howToUseNote: ["Ein Impuls passend", "zu Ihrem Moment."],
    nextCompanionLabel: "Regulieren & Loslassen — für jeden Moment im Alltag.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "REGULATE · LET GO · PREPARE",
        galleryTagline: ["Which companion", "do you need right now?"],
        howToUseEyebrow: "Application",
        howToUseTitle: ["Choose a card.", "Apply impulse."],
        howToUseSteps: ["Choose card", "Apply impulse", "2–3 minutes per regeneration point", "Move on"],
        howToUseNote: ["An impulse for", "your moment."],
        nextCompanionLabel: "Regulate & Let Go — for every moment in daily life.",
      },
    },
  },

  "somnobalance-starter-set": {
    systemRoleLabel: "IHR EINSTIEG IN SOMNOBALANCE",
    galleryTagline: ["Drei Wochen.", "Ihr Weg."],
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
        brandCloseTagline: ["The phases are fixed —", "the application is individual."],
      },
    },
  },

  "somnobalance-neck-pillow": {
    systemRoleLabel: "VORBEREITEN · REGENERIEREN",
    galleryTagline: ["Die Nacht braucht", "andere Bedingungen."],
    galleryImages: [
      "/products/somnobalance-neck-pillow.webp",
      "/products/neck-pillow-detail-top.webp",
      "/products/neck-pillow-detail-corner.webp",
      "/products/neck-pillow-height-settings.webp",
    ],
    galleryCaptions: {
      3: "Sechs Höheneinstellungen: Kissen wenden für höhere oder niedrigere Nackenrolle, dazu 0, 1 oder 2 Einlegeplatten — von ca. 8 cm bis ca. 15 cm.",
    },
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["So individuell wie", "Ihre Liegeposition."],
    howToUseImage: "/products/pillow.webp",
    howToUseSteps: [
      { icon: Moon, label: "Höhe einstellen" },
      { icon: Bed, label: "Liegeposition finden" },
      { icon: Cloud, label: "Schlafumgebung vorbereiten" },
      { icon: Sun, label: "Gute Voraussetzungen schaffen" },
    ],
    howToUseNote: ["So individuell wie", "Ihre Liegeposition."],
    vitalizeImage: "/products/neck-pillow-detail-top.webp",
    nextCompanionLabel: "Regulation und Rituale bereiten vor — die Schlafumgebung übernimmt in der Nacht.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "PREPARE · REGENERATE",
        galleryTagline: ["The night needs", "different conditions."],
        galleryCaptions: {
          3: "Six height settings: flip the pillow for a higher or lower neck roll, then add 0, 1 or 2 insert plates — from approx. 8 cm to approx. 15 cm.",
        },
        howToUseEyebrow: "Sleep Environment",
        howToUseTitle: ["As individual as", "your sleeping position."],
        howToUseSteps: ["Adjust height", "Find sleeping position", "Prepare sleep environment", "Create good conditions"],
        howToUseNote: ["As individual as", "your sleeping position."],
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
      { icon: Bed, label: "Festigkeit wählen" },
      { icon: Moon, label: "Liegekomfort anpassen" },
      { icon: Cloud, label: "Schlafumgebung vorbereiten" },
      { icon: Sun, label: "Gute Voraussetzungen schaffen" },
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
        eyebrow: "Für zwei",
        headline: "Individueller Komfort auf beiden Bettseiten.",
        body: "Bei Matratzen ab 160 cm Breite kommen zwei separat wendbare Innenkerne unter einem durchgehenden Topper und einem gemeinsamen Bezug zum Einsatz.\n\nDadurch kann jede Bettseite unabhängig auf die gewünschte Festigkeit eingestellt werden, während Topper und Bezug eine durchgehende Oberfläche bilden.",
      },
    ],
    nextCompanionLabel: "Regulation und Rituale bereiten den Übergang vor. Die Schlafumgebung übernimmt in der Nacht.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
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
