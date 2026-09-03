export const metadata = { title: "About — SomnoBalance" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">About</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">The SomnoBalance principle</h1>
      <div className="prose-legal mt-8">
        <p>
          SomnoBalance is a regeneration and lifestyle brand. Our products — mattresses, pillows,
          oils, tea, and ritual cards — are tools within a holistic system, not the offer itself.
          The promise underneath all of it is simple: regeneration, calm, quality of life.
        </p>
        <p>
          We deliberately take a different path from high-tech, sleep-tracking approaches. There
          is no dashboard here, no score to optimise. SomnoBalance is holistic, sensory, and
          ritual-based — a point of difference, not a gap.
        </p>
        <p>
          The system moves through four phases — REGULATE, LET GO, PREPARE, REGENERATE — each
          paired with its own ritual, its own products, and its own place in an evening.
        </p>
        <h2>Craftsmanship behind the brand</h2>
        <p>
          SomnoBalance draws on more than 35 years of experience developing sleep-environment
          products. That heritage sits quietly behind the brand — see our{" "}
          <a href="/legal/impressum">Impressum</a> for the full legal detail.
        </p>
      </div>
    </div>
  );
}
