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
    nextCompanionLabel: "Regulieren, Loslassen, Vorbereiten — Ihr Einstieg.",
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "YOUR ENTRY INTO SOMNOBALANCE",
        galleryTagline: ["Three weeks.", "Your path."],
        howToUseEyebrow: "21-Day Guide",
        howToUseTitle: ["Three weeks.", "Your regeneration path."],
        howToUseSteps: ["Week 1", "Week 2", "Week 3", "Move on"],
        howToUseNote: ["How your", "companions interlock."],
        nextCompanionLabel: "Regulate, Let Go, Prepare — your entry.",
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
        nextCompanionLabel: "Regulation and rituals prepare the transition. The sleep environment takes over at night.",
      },
    },
  },

};
