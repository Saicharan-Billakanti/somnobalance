const faqs = [
  {
    q: "Where do you ship?",
    a: "Currently within Germany and the wider EU. See our Shipping & Delivery page for timeframes by region.",
  },
  {
    q: "How long does delivery take?",
    a: "Within Germany, orders typically arrive within 2–5 business days. Within the rest of the EU, 5–10 business days. Exact timeframes are confirmed at checkout.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. As a consumer in the EU you have a 14-day right of withdrawal from the date of delivery, with no need to give a reason. See our Returns & Withdrawal page for the full policy and a sample withdrawal form.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Card, SEPA Direct Debit, and PayPal, processed through our payment provider. Payment details are never stored on our servers.",
  },
  {
    q: "Is SomnoBalance the same company as Willing1863?",
    a: "SomnoBalance is the brand you experience — Willing1863 is the background company behind it, with over 35 years in sleep-environment products. Full legal detail is in our Impressum.",
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
