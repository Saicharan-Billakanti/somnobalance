// Per-product config for ProductSystemPage.tsx, one entry per product beyond
// the Roll-on (which keeps its own bespoke RollOnPdp.tsx). System-role
// labels, ritual sequences and "next companion" lines are taken directly
// from the client's briefing (SomnoBalance_Produktseiten_Design_Content_
// Briefing.docx, sections 3–11) — not invented. Body copy (description,
// details, ingredients) always comes from products.ts, never duplicated
// here, per the briefing's instruction not to freehand product facts.
import {
  Bed,
  Cloud,
  Droplet,
  FlaskConical,
  Flower2,
  Info,
  Leaf,
  Moon,
  Sparkles,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { ProductSystemConfig } from "@/components/lovable/ProductSystemPage";

const infoIcon: LucideIcon = Info;

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
    systemRoleLabel: "RITUAL · LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Loslassen.", "Vorbereiten."],
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Wenn der Tag", "leiser werden darf."],
    howToUseSteps: [
      { icon: Droplet, label: "Diffusor befüllen" },
      { icon: Wind, label: "3–8 Tropfen zugeben" },
      { icon: Cloud, label: "Einschalten" },
      { icon: Moon, label: "Wirken lassen" },
    ],
    howToUseNote: ["Für heute", "ist genug."],
    detailIcons: [FlaskConical, Sparkles, Droplet, infoIcon],
    nextCompanionLabel: "Ihr Begleiter für Loslassen & Vorbereiten.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "RITUAL · LET GO · PREPARE",
        galleryTagline: ["Let go.", "Prepare."],
        howToUseEyebrow: "Application",
        howToUseTitle: ["When the day", "starts to quiet down."],
        howToUseSteps: ["Fill the diffuser", "Add 3–8 drops", "Switch on", "Let it work"],
        howToUseNote: ["That is enough", "for today."],
        nextCompanionLabel: "Your companion for letting go & preparing.",
      },
    },
  },

  "somnobalance-room-spray": {
    systemRoleLabel: "RITUAL · VORBEREITEN",
    galleryTagline: ["Raum schaffen.", "Übergang beginnen."],
    howToUseImage: "/products/spray.webp",
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Beginne", "mit dem Raum."],
    howToUseSteps: [
      { icon: Wind, label: "Raum schaffen" },
      { icon: Sparkles, label: "Duftimpuls" },
      { icon: Cloud, label: "Ruhiger werden" },
      { icon: Moon, label: "Vorbereiten" },
    ],
    howToUseNote: ["Verändere nicht den", "ganzen Abend."],
    detailIcons: [FlaskConical, Sparkles, Droplet, infoIcon],
    nextCompanionLabel: "Ihr Begleiter für den Übergang zur Nacht.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "RITUAL · PREPARE",
        galleryTagline: ["Create space.", "Begin transition."],
        howToUseEyebrow: "Application",
        howToUseTitle: ["Begin", "with the room."],
        howToUseSteps: ["Create space", "Scent impulse", "Calm down", "Prepare"],
        howToUseNote: ["Do not change the", "whole evening."],
        nextCompanionLabel: "Your companion for the transition to night.",
      },
    },
  },

  "somnobalance-regeneration-tea": {
    systemRoleLabel: "RITUAL · LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Zeit nehmen.", "Ankommen."],
    howToUseEyebrow: "Zubereitung",
    howToUseTitle: ["Manchmal beginnt Loslassen", "mit etwas ganz Einfachem."],
    howToUseSteps: [
      { icon: Droplet, label: "Aufbrühen" },
      { icon: Cloud, label: "Ankommen" },
      { icon: Sun, label: "Zeit nehmen" },
      { icon: Moon, label: "Vorbereiten" },
    ],
    howToUseNote: ["Ein warmer", "Begleiter."],
    detailIcons: [Leaf, Flower2, Droplet, infoIcon],
    nextCompanionLabel: "Ihr Begleiter für ruhigere Abendmomente.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "RITUAL · LET GO · PREPARE",
        galleryTagline: ["Take time.", "Arrive."],
        howToUseEyebrow: "Preparation",
        howToUseTitle: ["Sometimes letting go", "starts with something simple."],
        howToUseSteps: ["Brew", "Arrive", "Take time", "Prepare"],
        howToUseNote: ["A warm", "companion."],
        nextCompanionLabel: "Your companion for quieter evening moments.",
      },
    },
  },

  "somnobalance-regeneration-cards": {
    systemRoleLabel: "SELBSTREGULATION · REGULIEREN · LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Welche Begleitung", "brauchen Sie gerade?"],
    howToUseEyebrow: "Anwendung",
    howToUseTitle: ["Karte wählen.", "Impuls anwenden."],
    howToUseSteps: [
      { icon: Sparkles, label: "Karte wählen" },
      { icon: Droplet, label: "Impuls anwenden" },
      { icon: Cloud, label: "2–3 Minuten" },
      { icon: Sun, label: "Weitergehen" },
    ],
    howToUseNote: ["Mehr als eine", "Aromaprodukt-Marke."],
    detailIcons: [Sparkles, Info, infoIcon],
    nextCompanionLabel: "Regulieren & Loslassen — für jeden Moment im Alltag.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "SELF-REGULATION · REGULATE · LET GO · PREPARE",
        galleryTagline: ["Which companion", "do you need right now?"],
        howToUseEyebrow: "Application",
        howToUseTitle: ["Choose a card.", "Apply impulse."],
        howToUseSteps: ["Choose card", "Apply impulse", "2–3 minutes", "Move on"],
        howToUseNote: ["More than an", "aroma product brand."],
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
    detailIcons: [Sparkles, FlaskConical, Info, infoIcon],
    nextCompanionLabel: "Regulieren, Loslassen, Vorbereiten — Ihr Einstieg.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
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
    systemRoleLabel: "SCHLAFUMGEBUNG · REGENERIEREN",
    galleryTagline: ["Die Nacht braucht", "andere Bedingungen."],
    galleryImages: [
      "/products/somnobalance-neck-pillow.webp",
      "/products/neck-pillow-detail-top.webp",
      "/products/neck-pillow-detail-corner.webp",
    ],
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Die Nacht braucht andere", "Bedingungen als der Tag."],
    howToUseImage: "/products/pillow.webp",
    howToUseSteps: [
      { icon: Moon, label: "Höhe einstellen" },
      { icon: Bed, label: "Position finden" },
      { icon: Cloud, label: "Zur Ruhe kommen" },
      { icon: Sun, label: "Regenerieren" },
    ],
    howToUseNote: ["Premium und", "Klarheit."],
    detailIcons: [Bed, Info, infoIcon],
    nextCompanionLabel: "Regulation und Rituale bereiten vor — die Schlafumgebung übernimmt in der Nacht.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "SLEEP ENVIRONMENT · REGENERATE",
        galleryTagline: ["The night needs", "different conditions."],
        howToUseEyebrow: "Sleep Environment",
        howToUseTitle: ["The night needs different", "conditions than the day."],
        howToUseSteps: ["Adjust height", "Find position", "Settle down", "Regenerate"],
        howToUseNote: ["Premium and", "clarity."],
        nextCompanionLabel: "Regulation and rituals prepare — the sleep environment takes over at night.",
      },
    },
  },

  "somnobalance-mattress": {
    systemRoleLabel: "SCHLAFUMGEBUNG · REGENERIEREN",
    galleryTagline: ["Was Sie durch", "die Nacht trägt."],
    galleryImages: [
      "/products/somnobalance-mattress.webp",
      "/products/mattress-detail-quilting.webp",
      "/products/mattress-detail-vitalize.webp",
      "/products/mattress-detail-handle.webp",
    ],
    howToUseImage: "/products/bed.webp",
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Was Sie durch", "die Nacht trägt."],
    howToUseSteps: [
      { icon: Bed, label: "Härtegrad wählen" },
      { icon: Moon, label: "Wenden möglich" },
      { icon: Cloud, label: "Zur Ruhe kommen" },
      { icon: Sun, label: "Regenerieren" },
    ],
    howToUseNote: ["Regeneration endet", "nicht mit dem Abend."],
    detailIcons: [Bed, Info, infoIcon],
    nextCompanionLabel: "Regulation und Rituale bereiten den Übergang vor. Die Schlafumgebung übernimmt in der Nacht.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
    translations: {
      en: {
        systemRoleLabel: "SLEEP ENVIRONMENT · REGENERATE",
        galleryTagline: ["What carries you", "through the night."],
        howToUseEyebrow: "Sleep Environment",
        howToUseTitle: ["What carries you", "through the night."],
        howToUseSteps: ["Choose firmness", "Can be flipped", "Settle down", "Regenerate"],
        howToUseNote: ["Regeneration doesn't", "end with the evening."],
        nextCompanionLabel: "Regulation and rituals prepare the transition. The sleep environment takes over at night.",
      },
    },
  },

};
