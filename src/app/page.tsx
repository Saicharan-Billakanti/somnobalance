import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const phases = [
  { name: "REGULATE", copy: "Settling the nervous system as the day winds down." },
  { name: "LET GO", copy: "Releasing tension through scent, warmth, and quiet ritual." },
  { name: "PREPARE", copy: "A sleep environment built to hold you, not just contain you." },
  { name: "REGENERATE", copy: "Rest as the foundation of quality of life, not a chore to optimise." },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">
              Regeneration &middot; Calm &middot; Balance
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Regeneration begins long before you fall asleep.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              SomnoBalance is not a mattress brand. It&apos;s a ritual for the transition into
              rest — sensory, unhurried, and built around you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/for-me"
                className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
              >
                For me
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-mauve/40 px-6 py-3 text-sm text-mauve-dark hover:bg-sand"
              >
                Explore the shop
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/products/sleep-sanctuary-set.jpg"
              alt="SomnoBalance — a ritual for the transition into rest"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-2xl text-ink">A system, not a product</h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Four phases carry you from the noise of the day into rest — each with its own ritual,
          and its own place in the SomnoBalance system.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase) => (
            <div key={phase.name} className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
              <div className="text-xs font-semibold tracking-[0.15em] text-teal-dark">
                {phase.name}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{phase.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-ink">From the shop</h2>
          <Link href="/shop" className="text-sm text-mauve-dark hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-3xl bg-mauve/5 p-10 md:grid-cols-3">
          <Link href="/for-me" className="group">
            <h3 className="font-serif text-lg text-mauve-dark">For me</h3>
            <p className="mt-2 text-sm text-ink/70">
              A personal ritual for calmer nights and steadier days.
            </p>
            <span className="mt-3 inline-block text-sm text-teal-dark group-hover:underline">
              Discover →
            </span>
          </Link>
          <Link href="/for-business" className="group">
            <h3 className="font-serif text-lg text-mauve-dark">For my business</h3>
            <p className="mt-2 text-sm text-ink/70">
              A sense of calm your guests remember, for hospitality and wellness spaces.
            </p>
            <span className="mt-3 inline-block text-sm text-teal-dark group-hover:underline">
              Discover →
            </span>
          </Link>
          <Link href="/partner" className="group">
            <h3 className="font-serif text-lg text-mauve-dark">Become a partner</h3>
            <p className="mt-2 text-sm text-ink/70">
              Shared values, transparent terms, for health professionals.
            </p>
            <span className="mt-3 inline-block text-sm text-teal-dark group-hover:underline">
              Discover →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
