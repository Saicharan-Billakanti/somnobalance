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
    howToUseImage: "/products/somnobalance-oil-blend.jpg",
    howToUseSteps: [
      { icon: Droplet, label: "Ankommen" },
      { icon: Wind, label: "Duftimpuls" },
      { icon: Cloud, label: "Loslassen" },
      { icon: Moon, label: "Abend" },
    ],
    howToUseNote: ["Für heute", "ist genug."],
    detailIcons: [FlaskConical, Sparkles, Droplet, infoIcon],
    nextCompanionLabel: "Dein Begleiter für Loslassen & Vorbereiten.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
  },

  "somnobalance-room-spray": {
    systemRoleLabel: "RITUAL · VORBEREITEN",
    galleryTagline: ["Raum schaffen.", "Übergang beginnen."],
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
    nextCompanionLabel: "Dein Begleiter für den Übergang zur Nacht.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
  },

  "somnobalance-regeneration-tea": {
    systemRoleLabel: "RITUAL · LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Zeit nehmen.", "Ankommen."],
    howToUseEyebrow: "Zubereitung",
    howToUseTitle: ["Manchmal beginnt", "Loslassen einfach."],
    howToUseSteps: [
      { icon: Droplet, label: "Aufbrühen" },
      { icon: Cloud, label: "Ankommen" },
      { icon: Sun, label: "Zeit nehmen" },
      { icon: Moon, label: "Vorbereiten" },
    ],
    howToUseNote: ["Ein warmer", "Begleiter."],
    detailIcons: [Leaf, Flower2, Droplet, infoIcon],
    nextCompanionLabel: "Dein Begleiter für ruhigere Abendmomente.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
  },

  "somnobalance-regeneration-cards": {
    systemRoleLabel: "SELBSTREGULATION · REGULIEREN · LOSLASSEN · VORBEREITEN",
    galleryTagline: ["Welche Begleitung", "brauchst du?"],
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
  },

  "somnobalance-starter-set": {
    systemRoleLabel: "DEIN EINSTIEG IN SOMNOBALANCE",
    galleryTagline: ["Drei Wochen.", "Dein Weg."],
    howToUseEyebrow: "21-Tage-Guide",
    howToUseTitle: ["Drei Wochen.", "Dein Regenerationsweg."],
    howToUseSteps: [
      { icon: Sun, label: "Woche 1" },
      { icon: Cloud, label: "Woche 2" },
      { icon: Moon, label: "Woche 3" },
      { icon: Sparkles, label: "Weitergehen" },
    ],
    howToUseNote: ["So greifen deine", "Begleiter ineinander."],
    detailIcons: [Sparkles, FlaskConical, Info, infoIcon],
    nextCompanionLabel: "Regulieren, Loslassen, Vorbereiten — dein Einstieg.",
    soundTitle: ["SomnoBalance", "Sound"],
    soundIntro: ["A quiet atmosphere", "for your moment."],
    soundQuote: ["A little more calm,", "wherever you are."],
    brandCloseTagline: ["A small ritual.", "Wherever you are."],
    brandCloseNote: ["Rest.", "Rebalance.", "Repeat."],
  },

  "somnobalance-neck-pillow": {
    systemRoleLabel: "SCHLAFUMGEBUNG · REGENERIEREN",
    galleryTagline: ["Die Nacht braucht", "andere Bedingungen."],
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Die Nacht braucht", "andere Bedingungen."],
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
  },

  "somnobalance-mattress": {
    systemRoleLabel: "SCHLAFUMGEBUNG · REGENERIEREN",
    galleryTagline: ["Was dich durch", "die Nacht trägt."],
    howToUseEyebrow: "Schlafumgebung",
    howToUseTitle: ["Was dich durch", "die Nacht trägt."],
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
  },
};
