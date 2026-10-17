export type ProductVariant = {
  label: string;
  price: number;
  priceNote?: string;
};

// A second, independent choice alongside size (currently only the
// mattress's firmness edition). No price delta of its own — editions
// change feel, not cost — so it's combined into the variant label the
// cart/order already treat as one opaque string, rather than adding a
// second pricing axis through checkout.
export type ProductEdition = {
  label: string;
  description: string;
};

// Short structured facts shown as an icon row on the PDP (format, product
// type, usage) — short labels, not full sentences. Only set this once the
// values are confirmed for a product; leave it undefined rather than
// guessing from the prose description.
export type ProductSpecs = {
  format: string;
  type: string;
  usage: string;
};

// Storefront-facing text, one set per locale. Order records, the admin
// panel, and priceOrderItems() always use the canonical English `name` on
// Product itself — only what a shopper reads on the site is translated.
export type ProductTranslation = {
  name: string;
  tagline: string;
  description: string;
  details: string[];
  ingredients?: string;
  specs?: ProductSpecs;
  // Customer-facing mandatory disclosure text (GHS/CLP hazard info for
  // cosmetics, food-law disclosures for edibles) — shown in a dedicated
  // accordion on the PDP, never folded into marketing description/details.
  // Distinct from `legalNote` on Product, which is an internal dev-only
  // TODO/caveat and is never rendered to shoppers.
  safetyInfo?: string;
  // Manufacturing/shipping lead time and post-unboxing care notes — shown
  // in their own "Fertigung & Lieferung" block (mattress's spec is
  // explicit these must not sit mixed into the technical details list).
  deliveryInfo?: string;
};

export type ProductPhase = "REGULATE" | "LET GO" | "PREPARE" | "REGENERATE";

// The four phases are a cycle, and one product can belong to several of them
// (same mapping as the homepage product tiles). `Product.phase` stays as the
// primary phase for admin/legacy data; shop filtering and labels use this.
const PRODUCT_PHASES: Record<string, ProductPhase[]> = {
  "somnobalance-regeneration-cards": ["REGULATE", "LET GO", "PREPARE"],
  "somnobalance-roll-on": ["REGULATE", "LET GO", "PREPARE"],
  "somnobalance-oil-blend": ["REGULATE", "LET GO", "PREPARE"],
  "somnobalance-room-spray": ["LET GO", "PREPARE"],
  "somnobalance-regeneration-tea": ["LET GO", "PREPARE"],
  "somnobalance-starter-set": ["REGULATE", "LET GO", "PREPARE"],
  "somnobalance-neck-pillow": ["REGULATE", "PREPARE", "REGENERATE"],
  "somnobalance-mattress": ["REGULATE", "PREPARE", "REGENERATE"],
};

export function getProductPhases(p: { slug: string; phase?: string }): ProductPhase[] {
  return PRODUCT_PHASES[p.slug] ?? (p.phase ? [p.phase as ProductPhase] : []);
}

export type Product = {
  slug: string;
  name: string;
  category: "Sleep" | "Ritual" | "Care";
  price?: number;
  variants?: ProductVariant[];
  editions?: ProductEdition[];
  tagline: string;
  description: string;
  details: string[];
  phase: "REGULATE" | "LET GO" | "PREPARE" | "REGENERATE";
  image: string;
  ingredients?: string;
  legalNote?: string;
  safetyInfo?: string;
  deliveryInfo?: string;
  specs?: ProductSpecs;
  shippingIncluded?: boolean;
  returnPeriodDays?: number;
  refundPolicy?: string;
  returnEligible?: boolean;
  refundRules?: string;
  maxRetailQuantity?: number;
  translations: { de: ProductTranslation };
};

export function getProductText(product: Product, lang: string): ProductTranslation {
  if (lang === "de") return product.translations.de;
  return {
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    details: product.details,
    ingredients: product.ingredients,
    specs: product.specs,
    safetyInfo: product.safetyInfo,
    deliveryInfo: product.deliveryInfo,
  };
}

export const products: Product[] = [
  {
    slug: "somnobalance-roll-on",
    name: "SomnoBalance Roll-on",
    category: "Ritual",
    price: 19,
    tagline: "A mindful scent impulse for on the go, at home and for moments in between.",
    description: "The SomnoBalance Roll-on accompanies mindful moments of regeneration in everyday life. Its handy format makes it easy to use on the go and at home, and it can become a recurring scent impulse for short moments of pausing.\n\nThe composition of lavender, clementine, grapefruit, frankincense and patchouli is embedded in sunflower and jojoba oil and can be applied directly to the skin.",
    details: [
      "Content: 10 ml",
      "Base: sunflower oil · jojoba oil",
      "Scent composition: lavender · clementine · grapefruit · frankincense · patchouli",
      "Application: according to the final approved product labelling",
      "Notes: for external use only. Further required notes follow the final labelling.",
    ],
    phase: "REGULATE",
    image: "/products/SomnoBalance Roll-on.webp",
    specs: { format: "10 ml", type: "Roll-on", usage: "External use" },
    returnPeriodDays: 14,
    refundPolicy: "14-Day Money-Back Guarantee",
    returnEligible: true,
    ingredients:
      "Helianthus Annuus Seed Oil, Simmondsia Chinensis Seed Oil, Tocopherol, Lavandula Angustifolia Oil, Citrus Clementina Peel Oil, Citrus Paradisi Peel Oil, Boswellia Sacra Oil, Pogostemon Cablin Oil, D-Limonene, Linalool, Geraniol.",
    legalNote:
      "Mandatory cosmetic declarations shown are taken from the current product label (INCI list above). Confirm against the latest manufacturer documentation before this page is used for real sales.",
    translations: {
      de: {
        name: "SomnoBalance Roll-on",
        tagline: "Ein bewusster Duftimpuls für unterwegs, zu Hause und für Momente zwischendurch.",
        description: "Der SomnoBalance Roll-on begleitet bewusste Regenerationsmomente im Alltag. Durch sein handliches Format ist er unkompliziert unterwegs und zu Hause einsetzbar und kann zu einem wiederkehrenden Duftimpuls für kurze Momente des Innehaltens werden.\n\nDie Komposition aus Lavendel, Clementine, Grapefruit, Weihrauch und Patchouli ist in Sonnenblumen- und Jojobaöl eingebettet und lässt sich direkt auf die Haut auftragen.",
        details: [
          "Inhalt: 10 ml",
          "Basis: Sonnenblumenöl · Jojobaöl",
          "Duftkomposition: Lavendel · Clementine · Grapefruit · Weihrauch · Patchouli",
          "Anwendung: entsprechend der final freigegebenen Produktkennzeichnung",
          "Hinweise: Nur zur äußerlichen Anwendung. Weitere erforderliche Hinweise entsprechend der finalen Kennzeichnung.",
        ],
        ingredients:
          "Helianthus Annuus Seed Oil, Simmondsia Chinensis Seed Oil, Tocopherol, Lavandula Angustifolia Oil, Citrus Clementina Peel Oil, Citrus Paradisi Peel Oil, Boswellia Sacra Oil, Pogostemon Cablin Oil, D-Limonene, Linalool, Geraniol.",
        specs: { format: "10 ml", type: "Roll-on", usage: "Äußerliche Anwendung" },
      },
    },
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
      "Add 5–8 drops to a diffuser or oil burner",
      "Follow the instructions of your specific device",
      "Not for skin application — avoid eye contact, keep out of reach of children",
    ],
    phase: "LET GO",
    image: "/products/SomnoBalance Oil Blend.webp",
    returnPeriodDays: 14,
    refundPolicy: "14-Day Money-Back Guarantee",
    returnEligible: true,
    legalNote:
      "This is a concentrated essential-oil blend, not for direct skin contact. Mandatory hazard and safety declarations must be copied verbatim from the current German product labelling before this page is used for real sales — not yet added here.",
    translations: {
      de: {
        name: "SomnoBalance Ölmischung",
        tagline: "Ihr Duftimpuls für bewusste Regenerations- und Abendmomente.",
        description:
          "Die SomnoBalance Ölmischung vereint Lavendel, Clementine, Grapefruit, Weihrauch und Patchouli zur charakteristischen Duftkomposition der Marke. Wenige Tropfen tragen den SomnoBalance-Duft in den Raum — ein einfacher Teil bewusster Abend- und Ruherituale.",
        details: [
          "10 ml, 100 % reine ätherische Öle",
          "Duft: Lavendel, Clementine, Grapefruit, Weihrauch, Patchouli",
          "5–8 Tropfen in Diffuser oder Duftlampe geben",
          "Hinweise des jeweiligen Geräts beachten",
          "Nicht zur Hautanwendung — Augenkontakt vermeiden, für Kinder unzugänglich aufbewahren",
        ],
      },
    },
  },
  {
    slug: "somnobalance-room-spray",
    name: "SomnoBalance Room Spray",
    category: "Ritual",
    price: 19,
    tagline: "A scent impulse for your room and conscious transitions.",
    description: "The SomnoBalance Room Spray brings SomnoBalance's characteristic scent composition into the room with just a few sprays. It can help to accompany conscious transitions in everyday life atmospherically – from the active day into quieter moments and the preparation for the evening.\n\nLavender, clementine, grapefruit, frankincense and patchouli combine into a recurring scent impulse that can give your personal moment of regeneration a familiar frame.",
    details: [
      "Content: 100 ml",
      "Base: alcohol · water · blend of essential oils",
      "Scent composition: lavender · clementine · grapefruit · frankincense · patchouli",
      "Application: shake well before use, spray into the room and distribute.",
    ],
    phase: "PREPARE",
    image: "/products/SomnoBalance Room Spray.webp",
    returnPeriodDays: 14,
    refundPolicy: "14-Day Money-Back Guarantee",
    returnEligible: true,
    legalNote:
      "Hazard/GHS data below (UFI, manufacturer address, pictograms) is taken from the client's specification document and must be verified against the final product label before go-live.",
    safetyInfo:
      "GHS02 (flame) and GHS07 (exclamation mark) hazard pictograms apply, per the current product label. Do not ingest. Do not spray directly on skin. Avoid contact with eyes. May cause allergic skin reactions and eye irritation. If in eyes: rinse cautiously with water for several minutes. If eye irritation persists, get medical advice/attention. Keep out of reach of children. DANGER! Keep away from heat, hot surfaces, sparks, open flames and other ignition sources. Harmful to aquatic life with long-lasting effects.\n\nUFI: 7G10-E083-A005-2U4C\nManufacturer: Almara Soap, s.r.o., Ve Žlíbku 1800/77, 193 00 Prague 9, Czech Republic\n\nThese details are provisional, taken from the client's specification document, and must be checked against the final approved label/safety data sheet before this product goes on sale.",
    translations: {
      de: {
        name: "SomnoBalance Raumspray",
        tagline: "Ein Duftimpuls für Ihren Raum und bewusste Übergänge.",
        description: "Das SomnoBalance Raumspray bringt die charakteristische Duftkomposition von SomnoBalance mit wenigen Sprühstößen in den Raum. Es kann dabei helfen, bewusste Übergänge im Alltag atmosphärisch zu begleiten – vom aktiven Tag in ruhigere Momente bis zur Vorbereitung auf den Abend.\n\nLavendel, Clementine, Grapefruit, Weihrauch und Patchouli verbinden sich zu einem wiederkehrenden Duftimpuls, der Ihrem persönlichen Regenerationsmoment einen vertrauten Rahmen geben kann.",
        details: [
          "Inhalt: 100 ml",
          "Basis: Alkohol · Wasser · Mischung ätherischer Öle",
          "Duftkomposition: Lavendel · Clementine · Grapefruit · Weihrauch · Patchouli",
          "Anwendung: Vor Gebrauch gründlich schütteln, in den Raum sprühen und verteilen.",
        ],
        safetyInfo:
          "Gefahrenpiktogramme GHS02 (Flamme) und GHS07 (Ausrufezeichen) gemäß aktuellem Produktetikett. Nicht innerlich anwenden. Nicht direkt auf die Haut sprühen. Augenkontakt vermeiden. Kann allergische Hautreaktionen und Augenreizungen verursachen. Bei Augenkontakt sofort mehrere Minuten lang vorsichtig mit Wasser spülen. Bei anhaltender Augenreizung ärztlichen Rat einholen/ärztliche Hilfe hinzuziehen. Außerhalb der Reichweite von Kindern aufbewahren. GEFAHR! Von Hitze, heißen Oberflächen, Funken, offenen Flammen und anderen Zündquellen fernhalten. Schädlich für Wasserorganismen, mit langfristiger Wirkung.\n\nUFI: 7G10-E083-A005-2U4C\nHersteller: Almara Soap, s.r.o., Ve Žlíbku 1800/77, 193 00 Prag 9, Tschechische Republik\n\nDiese Angaben sind vorläufig, der Spezifikation des Kunden entnommen, und müssen vor dem Verkaufsstart mit dem final freigegebenen Etikett/Sicherheitsdatenblatt abgeglichen werden.",
      },
    },
  },
  {
    slug: "somnobalance-regeneration-tea",
    name: "SomnoBalance Regeneration Tea",
    category: "Ritual",
    price: 12,
    tagline: "A mindful ritual for calmer moments and the transition into the evening.",
    description:
      "SomnoBalance Regeneration Tea brings together lemon balm, orange blossom, sweet blackberry leaves, raspberry leaves, liquorice root, cardamom, fennel and anise into a finely balanced herbal blend. A mindfully prepared cup of tea can become a small ritual — for a pause in between, for letting go after an active day, or as part of your personal preparation for the evening.",
    details: [
      "Content: 80 g loose tea",
      "Ingredients: lemon balm · orange blossom · sweet blackberry leaves · raspberry leaves · liquorice root · cardamom · fennel · anise",
      "Preparation: 1 heaped teaspoon per 200 ml of water; pour over with boiling water; steep for 6–8 minutes.",
      "Storage: per the final packaging – currently store dry and protected from heat.",
    ],
    phase: "LET GO",
    image: "/products/SomnoBalance Regeneration Tea.webp",
    returnPeriodDays: 14,
    refundPolicy: "14-Day Money-Back Guarantee",
    returnEligible: true,
    legalNote:
      "Mandatory food-law disclosures (nutritional information, allergen labelling, best-before format) must be added from the current manufacturer documentation before this page is used for real sales — not yet added here.",
    safetyInfo: "Net quantity: 80 g. Ingredients: lemon balm, orange blossom, sweet blackberry leaves, raspberry leaves, liquorice root, cardamom, fennel, anise. Store dry and protected from heat.",
    translations: {
      de: {
        name: "SomnoBalance Regenerationstee",
        tagline: "Ein bewusstes Ritual für ruhigere Momente und den Übergang in den Abend.",
        description:
          "Der SomnoBalance Regenerationstee verbindet Melisse, Orangenblüte, süße Brombeerblätter, Himbeerblätter, Süßholzwurzel, Kardamom, Fenchel und Anis zu einer fein abgestimmten Kräutermischung. Eine bewusst zubereitete Tasse Tee kann zu einem kleinen Ritual werden — für eine Pause zwischendurch, zum Loslassen nach einem aktiven Tag oder als Teil Ihrer persönlichen Vorbereitung auf den Abend.",
        details: [
          "Inhalt: 80 g loser Tee",
          "Zutaten: Melisse · Orangenblüte · süße Brombeerblätter · Himbeerblätter · Süßholzwurzel · Kardamom · Fenchel · Anis",
          "Zubereitung: 1 gehäufter Teelöffel pro 200 ml Wasser; mit kochendem Wasser übergießen; 6–8 Minuten ziehen lassen.",
          "Lagerung: entsprechend der finalen Verpackungsangabe, aktuell trocken und vor Wärme geschützt.",
        ],
        safetyInfo: "Nettofüllmenge: 80 g. Zutaten: Melisse, Orangenblüte, süße Brombeerblätter, Himbeerblätter, Süßholzwurzel, Kardamom, Fenchel, Anis. Trocken und vor Wärme geschützt lagern.",
      },
    },
  },
  {
    slug: "somnobalance-regeneration-cards",
    name: "SomnoBalance Regeneration Cards Set",
    category: "Ritual",
    price: 24,
    tagline: "Regeneration points and rituals for your everyday life.",
    description: "The SomnoBalance Regeneration Cards Set brings targeted regeneration impulses straight into your everyday life. 13 cards guide you through selected regeneration points, 10 further cards combine several impulses into mindful rituals.\n\nThis way you can choose what should accompany you right now – in the middle of the active day, while letting go, or when preparing for the evening.",
    details: [
      "Scope: 23 cards",
      "Included: 13 regeneration-point cards · 10 regeneration-ritual cards",
      "Application: choose a single regeneration point or a prepared ritual that fits your personal moment and follow the instructions on the card.",
      "Regeneration points: a single regeneration point is held gently for about 2–3 minutes.",
      "For everyday life: for mindful moments of regeneration at home, on the go, or as part of personal transitions and routines.",
    ],
    phase: "REGULATE",
    image: "/products/somnobalance-regeneration-cards.webp",
    returnPeriodDays: 14,
    refundPolicy: "14-Day Money-Back Guarantee",
    returnEligible: true,
    translations: {
      de: {
        name: "SomnoBalance Regenerationskarten-Set",
        tagline: "Regenerationspunkte und Rituale für Ihren Alltag.",
        description: "Das SomnoBalance Regenerationskarten-Set bringt gezielte Regenerationsimpulse direkt in Ihren Alltag. 13 Karten führen durch ausgewählte Regenerationspunkte, 10 weitere Karten verbinden mehrere Impulse zu bewussten Ritualen.\n\nSo können Sie passend zu Ihrem Moment auswählen, was Sie gerade begleiten soll – mitten im aktiven Tag, beim Loslassen oder bei der Vorbereitung auf den Abend.",
        details: [
          "Umfang: 23 Karten",
          "Enthalten: 13 Regenerationspunkt-Karten · 10 Regenerationsritual-Karten",
          "Anwendung: Einen einzelnen Regenerationspunkt oder ein vorbereitetes Ritual passend zum persönlichen Moment auswählen und der jeweiligen Anleitung auf der Karte folgen.",
          "Regenerationspunkte: Ein einzelner Regenerationspunkt wird etwa 2–3 Minuten sanft gehalten.",
          "Für den Alltag: Für bewusste Regenerationsmomente zu Hause, unterwegs oder als Teil persönlicher Übergänge und Routinen.",
        ],
      },
    },
  },
  {
    slug: "somnobalance-neck-pillow",
    name: "SomnoBalance Neck Support Pillow",
    category: "Sleep",
    price: 119,
    tagline: "Individually adjustable support for a consciously designed sleep environment.",
    description: "The SomnoBalance Neck Support Pillow can be adapted to different lying needs through its reversible shape and two insert plates. Six possible height settings in total allow flexible adjustment from approx. 8 to 15 cm.\n\nThe open-pore Air-Memory foam core is complemented by a high-quality SomnoBalance cover with Vitalize® technology. This way the pillow combines individually adjustable lying comfort with a special cover for the night.",
    details: [
      "Size: approx. 30 × 60 cm",
      "Core: open-pore Air-Memory foam core",
      "Shape: reversible, with two neck rolls of different heights",
      "Height adjustment: two insert plates, six height settings in total",
      "Height range: approx. 8 to 15 cm",
      "Cover: SomnoBalance cover with Vitalize® far-infrared technology",
      "Cover material: polyester textile with permanently integrated ceramic mineral crystals",
      "Cover care: removable and washable at 30 °C",
      "Foam core care: gentle hand wash only. Air dry. Not machine washable or tumble-dryer safe.",
    ],
    phase: "PREPARE",
    image: "/products/somnobalance-neck-pillow.webp",
    returnPeriodDays: 30,
    refundPolicy: "30-Night Sleep Trial & Full Refund Guarantee",
    returnEligible: true,
    legalNote:
      "The Vitalize® cover fabric is described here only as the manufacturer characterises it (reflecting the body's own far-infrared radiation). Manufacturer claims about microcirculation, sleep or wellbeing are deliberately not presented as proven effects.",
    translations: {
      de: {
        name: "SomnoBalance Nackenstützkissen",
        tagline: "Individuell anpassbare Unterstützung für eine bewusst gestaltete Schlafumgebung.",
        description: "Das SomnoBalance Nackenstützkissen lässt sich durch seine wendbare Form und zwei Einlegeplatten individuell an unterschiedliche Liegebedürfnisse anpassen. Insgesamt sechs mögliche Höheneinstellungen ermöglichen eine flexible Anpassung von ca. 8 bis 15 cm.\n\nDer offenporige Air-Memory-Schaumstoffkern wird durch einen hochwertigen SomnoBalance Bezug mit Vitalize®-Technologie ergänzt. So verbindet das Kissen individuell anpassbaren Liegekomfort mit einem besonderen Bezug für die Nacht.",
        details: [
          "Größe: ca. 30 × 60 cm",
          "Kern: Offenporiger Air-Memory-Schaumstoffkern",
          "Form: Wendbar mit zwei unterschiedlich hohen Nackenrollen",
          "Höhenanpassung: Zwei Einlegeplatten, insgesamt sechs Höheneinstellungen",
          "Höhenbereich: ca. 8 bis 15 cm",
          "Bezug: SomnoBalance Bezug mit Vitalize® Far-Infrared-Technologie",
          "Bezugsmaterial: Polyestertextil mit dauerhaft eingebundenen keramischen Mineralkristallen",
          "Pflege Bezug: Abnehmbar und waschbar bei 30 °C",
          "Pflege Schaumstoffkern: Nur schonende Handwäsche. An der Luft trocknen. Nicht maschinenwaschbar oder trocknergeeignet.",
        ],
      },
    },
  },
  {
    slug: "somnobalance-mattress",
    name: "SomnoBalance Mattress",
    category: "Sleep",
    shippingIncluded: true,
    tagline: "Individually adjustable comfort for a mindfully designed sleep environment.",
    description:
      "The SomnoBalance Mattress combines a high-quality 7-zone pocket-spring core, two selectable firmness levels and an integrated Viscogel topper into one flexibly adjustable sleep system. What makes it different: flipping the inner core switches between two firmness levels — so comfort can adapt even as your personal needs change. The detailed technical specifications are explained further below.",
    details: [
      "Editions: H2/H3 or H3/H4",
      "Firmness adjustment: by flipping the inner core",
      "Spring core: 7-zone pocket-spring core",
      "Spring count: approx. 500 springs at 100 × 200 cm",
      "Core cover: both sides approx. 3 cm cold foam, RG 40",
      "Topper: approx. 4 cm Viscogel, RG 50",
      "Topper system: sits on the inner core, integrated within the shared mattress cover",
      "Cover: high-quality SomnoBalance cover with Vitalize® fabric",
      "Opening: four-sided zip",
      "Handling: handles for turning the inner core (exact description pending confirmation against the manufacturer's documentation)",
      "From 160 cm wide: two separately reversible inner cores under one continuous topper and cover",
    ],
    phase: "PREPARE",
    image: "/products/somnobalance-mattress.webp",
    returnPeriodDays: 100,
    refundPolicy: "100-Night Risk-Free Sleep Trial & Free Return Pickup",
    returnEligible: true,
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
    editions: [
      { label: "H2/H3", description: "Reversible between firmness H2 and H3" },
      { label: "H3/H4", description: "Reversible between firmness H3 and H4" },
    ],
    legalNote:
      "Special lengths of 210 cm or 220 cm are available for a 20% surcharge on the base size price — not yet configurable in this demo checkout. The Vitalize® cover is described only as the manufacturer characterises it; claims about microcirculation, sleep or wellbeing are deliberately not presented as proven effects. The handle description must be confirmed against manufacturer documentation before publishing a specific claim (currently left generic per the client's instruction).",
    deliveryInfo: "The SomnoBalance Mattress is made to order. Manufacturing and delivery take approx. 3–4 weeks. Shipped via DHL within Germany, shipping cost included in the price — widths of 160 cm and above arrive as 3–4 separate parcels.",
    translations: {
      de: {
        name: "SomnoBalance Matratze",
        tagline: "Individuell anpassbarer Liegekomfort für eine bewusst gestaltete Schlafumgebung.",
        description:
          "Die SomnoBalance Matratze verbindet einen hochwertigen 7-Zonen-Taschenfederkern, zwei wählbare Festigkeiten und einen integrierten Visko-Gel-Topper zu einem flexibel anpassbaren Schlafsystem. Das Besondere: Durch Wenden des Innenkerns lässt sich zwischen zwei Festigkeiten wechseln. So kann der Liegekomfort auch dann angepasst werden, wenn sich persönliche Komfortbedürfnisse verändern. Die technischen Details werden weiter unten ausführlich erklärt.",
        details: [
          "Ausführungen: H2/H3 oder H3/H4",
          "Festigkeitsanpassung: durch Wenden des Innenkerns",
          "Federkern: 7-Zonen-Taschenfederkern",
          "Federanzahl: ca. 500 Federn bei 100 × 200 cm",
          "Kernabdeckung: beidseitig ca. 3 cm Kaltschaum RG 40",
          "Topper: ca. 4 cm Visko-Gel RG 50",
          "Topper-System: auf dem Innenkern liegend und innerhalb des gemeinsamen Matratzenbezugs integriert",
          "Bezug: hochwertiger SomnoBalance Bezug mit Vitalize®-Technologie",
          "Öffnung: vierseitiger Reißverschluss",
          "Handhabung: Griffe zum Wenden des Innenkerns (genaue Bezeichnung ausstehend bis zur Bestätigung anhand der Herstellerunterlagen)",
          "Ab 160 cm Breite: zwei separat wendbare Innenkerne unter durchgehendem Topper und gemeinsamem Bezug",
        ],
        deliveryInfo: "Die SomnoBalance Matratze wird auf Bestellung gefertigt. Die Fertigungs- und Lieferzeit beträgt ca. 3–4 Wochen. Versand per DHL innerhalb Deutschlands, Versandkosten im Preis enthalten — ab 160 cm Breite als 3–4 separate Pakete.",
      },
    },
  },
  {
    slug: "somnobalance-starter-set",
    name: "SomnoBalance Starter Set",
    category: "Care",
    price: 59,
    tagline: "Your entry into SomnoBalance — for conscious regeneration moments from the active day into the night.",
    description:
      "SomnoBalance should adapt to your everyday life — not the other way around. The 21-day guide gives you orientation, while regeneration cards, roll-on and oil blend accompany you with different impulses through your personal regeneration rhythm.",
    details: [
      "21-day guide: your thread through the next 21 days — small impulses and rituals that help you build regulation and regeneration into your everyday life, step by step",
      "Regeneration cards: choose the one that fits your current need — concrete impulses and simple ways to come to rest in between and support your self-regulation",
      "SomnoBalance roll-on: your uncomplicated companion for on the go — apply to pulse points, take in the scent consciously, and use a short moment to pause",
      "Essential oil blend: for conscious moments of regeneration at home — a few drops in the diffuser create a pleasant scent atmosphere and can accompany your personal evening or rest ritual",
    ],
    phase: "REGULATE",
    image: "/products/somnobalance-starter-set.webp",
    returnPeriodDays: 30,
    refundPolicy: "30-Day Money-Back Guarantee",
    returnEligible: true,
    safetyInfo:
      "This set includes the SomnoBalance Roll-on and Oil Blend, each with their own mandatory safety information — see the Roll-on and Oil Blend product pages for full ingredient (INCI) listings and usage notes. The 21-Day Guide and Regeneration Cards Set carry no cosmetic or safety disclosures.",
    translations: {
      de: {
        name: "SomnoBalance Starter-Set",
        tagline: "Ihr Einstieg in SomnoBalance – für bewusste Regenerationsmomente vom aktiven Tag bis in die Nacht.",
        description:
          "SomnoBalance soll sich Ihrem Alltag anpassen – nicht umgekehrt. Der 21-Tage-Guide gibt Ihnen Orientierung, während Regenerationskarten, Roll-on und Ölmischung Sie mit unterschiedlichen Impulsen durch Ihren persönlichen Regenerationsrhythmus begleiten.",
        details: [
          "21-Tage-Guide: Ihr roter Faden durch die nächsten 21 Tage. Kleine Impulse und Rituale begleiten Sie Schritt für Schritt dabei, Regulation und Regeneration bewusster in Ihren Alltag zu integrieren",
          "Regenerationskarten: Wählen Sie passend zu Ihrem aktuellen Bedürfnis. Die Karten geben Ihnen konkrete Impulse und zeigen Ihnen einfache Möglichkeiten, zwischendurch zur Ruhe zu kommen und Ihre Selbstregulation zu unterstützen",
          "SomnoBalance Roll-on: Ihr unkomplizierter Begleiter für unterwegs und im Alltag. Auf die Pulspunkte auftragen, den Duft bewusst wahrnehmen und einen kurzen Moment zum Innehalten nutzen",
          "Ätherische Ölmischung: Für Ihre bewussten Regenerationsmomente zu Hause. Einige Tropfen im Diffuser schaffen eine angenehme Duftatmosphäre und können Ihr persönliches Ruhe- oder Abendritual begleiten",
        ],
        safetyInfo:
          "Dieses Set enthält den SomnoBalance Roll-on und die Ölmischung, jeweils mit eigenen verpflichtenden Sicherheitsinformationen — die vollständigen Inhaltsstoffangaben (INCI) und Anwendungshinweise finden Sie auf den jeweiligen Produktseiten von Roll-on und Ölmischung. Der 21-Tage-Guide und das Regenerationskarten-Set enthalten keine kosmetischen oder sicherheitsrelevanten Angaben.",
      },
    },
  },
];

export function getProductReturnInfo(slug: string) {
  const prod = getProduct(slug);
  return {
    returnPeriodDays: prod?.returnPeriodDays ?? 30,
    refundPolicy: prod?.refundPolicy ?? "30-Day Money-Back Guarantee",
    returnEligible: prod?.returnEligible !== false,
    refundRules:
      prod?.refundRules ??
      "Hygienic seal must be intact upon return; items must be in original condition and packaging.",
    maxRetailQuantity: prod?.maxRetailQuantity ?? 10,
  };
}


export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantLabel?: string) {
  if (!product.variants) return null;
  // Products with an edition axis store cart lines as "<size> — <edition>"
  // (see priceOrderItems) — strip the edition suffix before matching size.
  const sizeLabel =
    product.editions?.length && variantLabel?.includes(" — ")
      ? variantLabel.slice(0, variantLabel.lastIndexOf(" — "))
      : variantLabel;
  return product.variants.find((v) => v.label === sizeLabel) ?? product.variants[0];
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
      // Products with a second axis (currently only the mattress's
      // firmness edition) store the cart variant as "<size> — <edition>"
      // — split it back apart here so size still matches product.variants
      // exactly, and separately validate the edition is a real option
      // rather than silently accepting/dropping an unrecognised one.
      let sizeLabel = item.variant;
      let editionLabel: string | undefined;
      if (product.editions?.length && item.variant?.includes(" — ")) {
        const idx = item.variant.lastIndexOf(" — ");
        sizeLabel = item.variant.slice(0, idx);
        editionLabel = item.variant.slice(idx + 3);
        if (!product.editions.some((ed) => ed.label === editionLabel)) {
          return { error: `Unknown edition for ${product.name}: ${editionLabel}` };
        }
      } else if (product.editions?.length) {
        return { error: `Missing edition for ${product.name}` };
      }

      const variant = product.variants.find((v) => v.label === sizeLabel);
      if (!variant) {
        return {
          error: `Unknown size for ${product.name}: ${sizeLabel ?? "(none given)"}`,
        };
      }
      lines.push({
        slug: product.slug,
        name: editionLabel ? `${product.name} (${variant.label}, ${editionLabel})` : `${product.name} (${variant.label})`,
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
