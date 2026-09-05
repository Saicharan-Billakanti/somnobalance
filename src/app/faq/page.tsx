const faqs = [
  {
    q: "Where do you ship?",
    a: "Currently within Germany only, via DHL. Deliveries outside Germany are not yet offered. See our Shipping & Delivery page for details.",
  },
  {
    q: "How long does delivery take?",
    a: "In-stock items (Ritual collection, cards, pillow, starter set) are dispatched immediately and generally arrive within 1–3 business days. Mattresses are made to order and take approximately 3–4 weeks to manufacture before they ship — mattresses from 160 × 200 cm arrive as 3–4 separate parcels.",
  },
  {
    q: "Is shipping free?",
    a: "Orders over €59 ship free of charge. For mattresses, shipping is always included in the price shown, regardless of order value.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. As a consumer in the EU you have a 14-day right of withdrawal from the date of delivery, with no need to give a reason. See our Right of Withdrawal page for the full policy and a model withdrawal form. Separately, damaged or defective products are covered by our Refund & Return Policy, and a statutory 2-year warranty applies to defects present at delivery.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Card, SEPA Direct Debit, and PayPal, processed through our payment provider, Stripe. Card and bank details are never stored on our own servers.",
  },
  {
    q: "Is SomnoBalance the same company as Willing1863?",
    a: "SomnoBalance is the brand you experience. It is operated by Friedrich-Alexander Willing, trading as \"Willing1863\" — Willing1863 is named only for legal-disclosure purposes. Full legal detail is in our Impressum.",
  },
  {
    q: "Do you offer wholesale or hospitality pricing?",
    a: "Yes — see our For my business page or contact us directly to discuss terms for hotels and wellness properties.",
  },
];

export const metadata = { title: "FAQ — SomnoBalance" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">FAQ</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Frequently asked questions</h1>
      <div className="mt-10 divide-y divide-mauve/10">
        {faqs.map((item) => (
          <div key={item.q} className="py-6">
            <h3 className="font-medium text-ink">{item.q}</h3>
            <p className="mt-2 text-ink/70">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
