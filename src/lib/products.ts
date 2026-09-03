export type Product = {
  slug: string;
  name: string;
  category: "Sleep" | "Ritual" | "Care";
  price: number;
  priceNote?: string;
  tagline: string;
  description: string;
  details: string[];
  phase: "REGULATE" | "LET GO" | "PREPARE" | "REGENERATE";
  image: string;
};

export const products: Product[] = [
  {
    slug: "balance-mattress-topper",
    name: "Balance Mattress Topper",
    category: "Sleep",
    price: 249,
    tagline: "A softer transition into the night.",
    description:
      "A natural-fibre topper designed to ease the body into rest, not just support it. Part of the regeneration system, not a mattress replacement.",
    details: [
      "Natural wool and organic cotton fill",
      "Breathable, temperature-balancing",
      "Removable, washable cover",
      "140–200 cm widths available",
    ],
    phase: "PREPARE",
    image: "/products/balance-mattress-topper.jpg",
  },
  {
    slug: "regeneration-pillow",
    name: "Regeneration Pillow",
    category: "Sleep",
    price: 89,
    tagline: "Support that holds you, not just your head.",
    description:
      "Contoured for a calmer resting posture, developed with over 35 years of sleep-environment craftsmanship behind it.",
    details: [
      "Adaptive natural latex core",
      "Organic cotton casing",
      "Two firmness options",
    ],
    phase: "PREPARE",
    image: "/products/regeneration-pillow.jpg",
  },
  {
    slug: "calming-oil-blend",
    name: "SomnoBalance Oil Blend",
    category: "Ritual",
    price: 34,
    tagline: "Your ritual companion for evenings at home.",
    description:
      "A pulse-point oil blend for the moments before sleep — one of the three SomnoBalance companions, alongside the Roll-On and the Ritual Card Set.",
    details: [
      "Lavender, clary sage, sweet almond oil",
      "30 ml dropper bottle, for use at home",
      "For pulse points, temples, or pillow",
    ],
    phase: "LET GO",
    image: "/products/calming-oil-blend.jpg",
  },
  {
    slug: "somnobalance-roll-on",
    name: "SomnoBalance Roll-On",
    category: "Ritual",
    price: 19,
    tagline: "Your scent impulse for on the go.",
    description:
      "The travel-size companion to the Oil Blend — a scent impulse for anytime in between, when your head fills up and you want a short, conscious pause.",
    details: [
      "Same blend as the Oil Blend, in a 10 ml roll-on",
      "Fits any bag or pocket",
      "For pulse points and temples",
    ],
    phase: "REGULATE",
    image: "/products/somnobalance-roll-on.jpg",
  },
  {
    slug: "ritual-tea-evening-blend",
    name: "Ritual Tea — Evening Blend",
    category: "Ritual",
    price: 18,
    tagline: "A pause you can hold in both hands.",
    description:
      "Chamomile, lemon balm and valerian root, blended to support the wind-down phase of the evening.",
    details: ["30 g loose leaf, approx. 15 servings", "Caffeine-free", "Organic ingredients"],
    phase: "LET GO",
    image: "/products/ritual-tea-evening-blend.jpg",
  },
  {
    slug: "ritual-cards-four-phases",
    name: "Ritual Cards — The Four Phases",
    category: "Ritual",
    price: 24,
    tagline: "Regeneration points and rituals for your day.",
    description:
      "One prompt or ritual per card, organised across the four phases of the SomnoBalance Regeneration Circle: Regulate, Let Go, Prepare, Regenerate.",
    details: ["40 cards + stand", "Pairs with the SomnoBalance playlists", "Printed in Germany"],
    phase: "REGULATE",
    image: "/products/ritual-cards-four-phases.jpg",
  },
  {
    slug: "sleep-sanctuary-set",
    name: "Sleep Sanctuary Set",
    category: "Care",
    price: 169,
    priceNote: "Save vs. buying separately",
    tagline: "The full evening ritual, in one set.",
    description:
      "Regeneration Pillow, Oil Blend and Ritual Tea together — one entry point into the SomnoBalance system.",
    details: [
      "1x Regeneration Pillow",
      "1x SomnoBalance Oil Blend",
      "1x Ritual Tea — Evening Blend",
    ],
    phase: "REGENERATE",
    image: "/products/sleep-sanctuary-set.jpg",
  },
  {
    slug: "regeneration-starter-kit",
    name: "21-Day Regeneration Starter Kit",
    category: "Care",
    price: 59,
    priceNote: "Save vs. buying separately",
    tagline: "Roll-On, Oil Blend, Card Set — and your printed 21-day guide.",
    description:
      "Everything to begin the SomnoBalance Regeneration Circle: the Roll-On, the Oil Blend, the Ritual Card Set, and a printed 21-day guide that gives you one small impulse a day.",
    details: [
      "1x SomnoBalance Roll-On",
      "1x SomnoBalance Oil Blend",
      "1x Ritual Cards — The Four Phases",
      "1x printed 21-Day Regeneration Guide",
    ],
    phase: "REGULATE",
    image: "/products/regeneration-starter-kit.jpg",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
