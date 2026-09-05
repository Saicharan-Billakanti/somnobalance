export type ProductVariant = {
  label: string;
  price: number;
  priceNote?: string;
};

export type Product = {
  slug: string;
  name: string;
  category: "Sleep" | "Ritual" | "Care";
  price?: number;
  variants?: ProductVariant[];
  tagline: string;
  description: string;
  details: string[];
  phase: "REGULATE" | "LET GO" | "PREPARE" | "REGENERATE";
  image: string;
  ingredients?: string;
  legalNote?: string;
  // True when the listed price already includes shipping (e.g. the
  // mattress) — such items never contribute to, or benefit from, the
  // flat-rate/free-shipping threshold applied to the rest of the cart.
  shippingIncluded?: boolean;
};

export const products: Product[] = [
  {
    slug: "somnobalance-roll-on",
    name: "SomnoBalance Roll-on",
    category: "Ritual",
    price: 19,
    tagline: "A scent moment to carry with you, at home or on the go.",
    description:
      "The SomnoBalance Roll-on pairs the brand's signature scent with a simple, targeted application. Lavender, clementine, grapefruit, frankincense and patchouli are blended into a base of sunflower and jojoba oil, applied directly to the skin — easy to fold into a personal pause or ritual, whether at home, travelling, or as part of an evening routine.",
    details: [
      "10 ml roll-on bottle",
      "Base oils: sunflower oil, jojoba oil",
      "Scent: lavender, clementine, grapefruit, frankincense, patchouli",
      "Apply to wrists, temples, neck, or soles of the feet — several times a day as needed",
      "For external use only; discontinue if skin irritation occurs",
    ],
    phase: "REGULATE",
    image: "/products/somnobalance-roll-on.jpg",
    ingredients:
      "Helianthus Annuus Seed Oil, Simmondsia Chinensis Seed Oil, Tocopherol, Lavandula Angustifolia Oil, Citrus Clementina Peel Oil, Citrus Paradisi Peel Oil, Boswellia Sacra Oil, Pogostemon Cablin Oil, D-Limonene, Linalool, Geraniol.",
    legalNote:
      "Mandatory cosmetic declarations shown are taken from the current product label (INCI list above). Confirm against the latest manufacturer documentation before this page is used for real sales.",
  },
  {
    slug: "somnobalance-oil-blend",
    name: "SomnoBalance Oil Blend",
    category: "Ritual",
    price: 19,
    tagline: "A pure essential-oil blend for your diffuser and evening rituals.",
    description:
      "The SomnoBalance Oil Blend brings together lavender, clementine, grapefruit, frankincense and patchouli into the brand's characteristic scent composition. A few drops carry the SomnoBalance scent into the room, making it an easy part of conscious evening and rest rituals.",
    details: [
      "10 ml, 100% pure essential oils",
      "Scent: lavender, clementine, grapefruit, frankincense, patchouli",
      "Add 3–8 drops to the water of a suitable oil burner or diffuser",
      "Follow the instructions of your specific device",
      "Not for skin application — avoid eye contact, keep out of reach of children",
    ],
    phase: "LET GO",
    image: "/products/somnobalance-oil-blend.jpg",
    legalNote:
      "This is a concentrated essential-oil blend, not for direct skin contact. Mandatory hazard and safety declarations must be copied verbatim from the current German product labelling before this page is used for real sales — not yet added here.",
  },
  {
    slug: "somnobalance-room-spray",
    name: "SomnoBalance Room Spray",
    category: "Ritual",
    price: 19,
    tagline: "The SomnoBalance scent, for a considered room and sleep environment.",
    description:
      "The SomnoBalance Room Spray brings the brand's scent composition into a space with a few sprays — as part of an evening ritual, before a conscious pause, or when transitioning from an active day into a quieter environment. Formulated, per the product label, on a base of alcohol, water and a blend of essential oils.",
    details: [
      "Base: alcohol, water, blend of essential oils (per label)",
      "Scent: lavender, clementine, grapefruit, frankincense, patchouli",
      "Shake well before use and spray into the room as needed",
      "Not for consumption or skin application — avoid eye and skin contact",
    ],
    phase: "PREPARE",
    image: "/products/somnobalance-room-spray.jpg",
    legalNote:
      "This product carries hazard labelling (including flammability). The binding German warning and safety text must be copied verbatim from the current product labelling before this page is used for real sales — not yet added here.",
  },
  {
    slug: "somnobalance-regeneration-tea",
    name: "SomnoBalance Regeneration Tea",
    category: "Ritual",
    price: 12,
    tagline: "A herb and spice blend for a conscious moment of rest.",
    description:
      "SomnoBalance Regeneration Tea brings together selected herbs, blossoms, fruit and spices into a finely balanced blend. Lemon balm and orange blossom meet sweet blackberry and raspberry leaves, rounded out with liquorice root, cardamom, fennel and anise — a warm companion for conscious pauses, in the evening or in quiet moments during the day.",
    details: [
      "80 g loose leaf",
      "Lemon balm, orange blossom, blackberry leaves, raspberry leaves, liquorice root, cardamom, fennel, anise",
      "Use one heaped teaspoon per 200 ml water",
      "Pour over with boiling water and steep for 6–8 minutes",
      "Store dry, away from heat",
    ],
    phase: "LET GO",
    image: "/products/somnobalance-regeneration-tea.jpg",
    legalNote:
      "Mandatory food-law disclosures (nutritional information, allergen labelling, best-before format) must be added from the current manufacturer documentation before this page is used for real sales — not yet added here.",
  },
  {
    slug: "somnobalance-regeneration-cards",
    name: "SomnoBalance Regeneration Cards",
    category: "Ritual",
    price: 24,
    tagline: "13 regeneration points and 10 matching rituals for everyday use.",
    description:
      "The SomnoBalance Regeneration Cards make the SomnoBalance method usable step by step. The set consists of 13 regeneration-point cards and 10 regeneration-ritual cards. The point cards show selected points on the body with position, illustration and instructions; the ritual cards combine several points into set sequences for different everyday situations — among them Finding Calm, Sleeping Well, Gathering New Strength, Inner Balance, Letting Go of Emotions, Letting Go of Thoughts, Finding Inner Steadiness, Gaining Clarity, Moving Through the Day with Ease, and Activating Regeneration.",
    details: [
      "23 cards: 13 regeneration-point cards + 10 regeneration-ritual cards",
      "Choose a single point, or follow a prepared combination as a full ritual",
      "Each point is held gently for about 2–3 minutes with calm, steady breathing",
      "For use at home, in everyday life, as part of an evening routine, or on the go",
    ],
    phase: "REGULATE",
    image: "/products/somnobalance-regeneration-cards.jpg",
  },
  {
    slug: "somnobalance-neck-pillow",
    name: "SomnoBalance Neck Support Pillow",
    category: "Sleep",
    price: 119,
    tagline: "Height-adjustable support, shaped for individual comfort.",
    description:
      "The SomnoBalance Neck Support Pillow combines an ergonomic shape with an individually adjustable height. The open-pore Air-Memory foam core is designed for pleasant ventilation, and two integrated insert plates allow six height settings in total — so the pillow can be adapted to different body types and sleep positions. At roughly 30 × 60 cm, it stays compact; the cover is removable and washable at 30°C, and the foam core can be hand-washed gently.",
    details: [
      "Approx. 30 × 60 cm",
      "Open-pore Air-Memory foam core",
      "2 integrated insert plates — six height settings in total",
      "Cover removable, washable at 30°C",
      "Foam core: gentle hand wash only, air dry — not machine washable or suitable for the dryer",
      "Cover fabric: Vitalize®, a polyester textile with ceramic mineral crystals (far-infrared, per manufacturer)",
    ],
    phase: "PREPARE",
    image: "/products/somnobalance-neck-pillow.jpg",
    legalNote:
      "The Vitalize® cover fabric is described here only as the manufacturer characterises it (reflecting the body's own far-infrared radiation). Manufacturer claims about microcirculation, sleep or wellbeing are deliberately not presented as proven effects.",
  },
  {
    slug: "somnobalance-mattress",
    name: "SomnoBalance Mattress",
    category: "Sleep",
    shippingIncluded: true,
    tagline: "A reversible 7-zone pocket-spring mattress with two firmness levels.",
    description:
      "The SomnoBalance Mattress combines a 7-zone pocket-spring core with a reversible inner core and an integrated Viscogel topper. The spring core — around 500 springs at 100 × 200 cm — is covered on both sides with roughly 3 cm of high-quality cold foam (RG 40). The inner core can be flipped to offer two firmness levels in one mattress: H2/H3 on one side, H3/H4 on the other. A roughly 4 cm topper of pressure-relieving Viscogel (RG 50) sits on top, finished with the Vitalize® cover fabric. A four-sided zip allows the upper cover panel to be removed for access to the inner core, and four embroidered handles help with turning and adjusting firmness. From 160 cm wide, the mattress uses two separate inner cores under one continuous topper and cover, so each side of the bed can be set independently.",
    details: [
      "7-zone pocket-spring core, reversible for two firmness levels (H2/H3 or H3/H4)",
      "Cold foam cover, both sides, approx. 3 cm, RG 40",
      "Viscogel topper, approx. 4 cm, RG 50, pressure-relieving",
      "Cover: Vitalize® textile with ceramic mineral crystals (far-infrared, per manufacturer), HyperSoft quilting, 250 g/m² climate fibre",
      "Four-sided zip, removable upper cover panel",
      "4 embroidered carry handles",
      "160 cm width and above: two independent cores under one continuous topper and cover",
      "Made to order: manufacturing and delivery take approx. 3–4 weeks",
      "Shipped via DHL, Germany only, shipping cost included in the price — 160 cm width and above arrives as 3–4 separate parcels",
      "Allow the mattress 48–72 hours after unpacking to fully expand to its final shape and firmness",
    ],
    phase: "PREPARE",
    image: "/products/somnobalance-mattress.jpg",
    variants: [
      { label: "80 × 200 cm", price: 1295 },
      { label: "90 × 200 cm", price: 1295 },
      { label: "100 × 200 cm", price: 1295 },
      { label: "120 × 200 cm", price: 1495 },
      { label: "140 × 200 cm", price: 1745 },
      { label: "160 × 200 cm", price: 1995, priceNote: "Two independent firmness zones" },
      { label: "180 × 200 cm", price: 2295, priceNote: "Two independent firmness zones" },
      { label: "200 × 200 cm", price: 2295, priceNote: "Two independent firmness zones" },
    ],
    legalNote:
      "Special lengths of 210 cm or 220 cm are available for a 20% surcharge on the base size price — not yet configurable in this demo checkout. The Vitalize® cover is described only as the manufacturer characterises it; claims about microcirculation, sleep or wellbeing are deliberately not presented as proven effects.",
  },
  {
    slug: "somnobalance-starter-set",
    name: "SomnoBalance Starter Set",
    category: "Care",
    price: 55,
    tagline: "Roll-on, oil blend, card set and a printed 21-day guide, together.",
    description:
      "The SomnoBalance Starter Set brings together the Roll-on, the Oil Blend and the Regeneration Cards with a printed 21-day guide — one entry point into the full SomnoBalance ritual, from the phase you're in to the scent and the point that supports it.",
    details: [
      "1× SomnoBalance Roll-on (10 ml)",
      "1× SomnoBalance Oil Blend (10 ml)",
      "1× SomnoBalance Regeneration Cards (23 cards)",
      "1× printed 21-day guide",
      "In stock, ships immediately as a single DHL parcel",
    ],
    phase: "REGULATE",
    image: "/products/somnobalance-starter-set.jpg",
    legalNote:
      "This bundle is referenced in the shipping, returns and about-us policy documents but its retail price was not specified there — the €55 shown is a placeholder only and must be confirmed with SomnoBalance before this page is used for real sales.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantLabel?: string) {
  if (!product.variants) return null;
  return product.variants.find((v) => v.label === variantLabel) ?? product.variants[0];
}

export function getDisplayPrice(product: Product) {
  if (product.variants) {
    const min = Math.min(...product.variants.map((v) => v.price));
    return { price: min, fromPrice: true };
  }
  return { price: product.price ?? 0, fromPrice: false };
}

// Shared by the checkout UI (for display) and the /api/orders route (as the
// authoritative, server-side calculation) so shipping logic can never drift
// between the two. Rejects unknown products/sizes rather than silently
// pricing them at 0.
export type PricedLine = { slug: string; name: string; unitPrice: number; qty: number };

export function priceOrderItems(
  items: { slug: string; qty: number; variant?: string }[]
): { lines: PricedLine[] } | { error: string } {
  const lines: PricedLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) return { error: `Unknown product: ${item.slug}` };

    if (product.variants) {
      const variant = product.variants.find((v) => v.label === item.variant);
      if (!variant) {
        return {
          error: `Unknown size for ${product.name}: ${item.variant ?? "(none given)"}`,
        };
      }
      lines.push({
        slug: product.slug,
        name: `${product.name} (${variant.label})`,
        unitPrice: variant.price,
        qty: item.qty,
      });
    } else {
      lines.push({ slug: product.slug, name: product.name, unitPrice: product.price ?? 0, qty: item.qty });
    }
  }
  return { lines };
}

// Operates on already-priced lines (not raw cart items) so variant pricing
// — e.g. the mattress's per-size price — is never re-derived and can't drift
// from what priceOrderItems() already calculated.
export function computeShipping(lines: PricedLine[]) {
  let otherSubtotal = 0;
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (product?.shippingIncluded) continue;
    otherSubtotal += line.unitPrice * line.qty;
  }
  if (otherSubtotal <= 0) return 0;
  return otherSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BELOW_THRESHOLD_SHIPPING_RATE;
}

const FREE_SHIPPING_THRESHOLD = 59;
const BELOW_THRESHOLD_SHIPPING_RATE = 4.9;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
