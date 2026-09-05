import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct, products } from "@/lib/products";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain"
            priority
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-teal-dark">
            {product.category} &middot; {product.phase}
          </div>
          <h1 className="mt-2 font-serif text-3xl text-ink">{product.name}</h1>
          <p className="mt-3 text-lg text-ink/70">{product.tagline}</p>

          <ProductPurchasePanel
            product={{ slug: product.slug, price: product.price, variants: product.variants }}
          />

          <p className="mt-6 leading-relaxed text-ink/70">{product.description}</p>
          <ul className="mt-6 space-y-2 text-sm text-ink/70">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-teal-dark">—</span> {d}
              </li>
            ))}
          </ul>

          {product.ingredients && (
            <div className="mt-6 rounded-xl border border-mauve/10 bg-white/60 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-ink/50">
                Ingredients (INCI)
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink/60">{product.ingredients}</p>
            </div>
          )}

          {/*
            product.legalNote is intentionally not rendered right now —
            these are internal reminders (missing hazard/food-law
            declarations, placeholder pricing) tracked in src/lib/products.ts
            so they aren't lost, but showing raw "TODO/placeholder" language
            to live site visitors during the Stripe application isn't what
            we want. Re-enable this block once the real text is in.
          */}

          <p className="mt-4 text-xs text-ink/50">
            14-day right of withdrawal within the EU. See{" "}
            <a href="/legal/withdrawal" className="underline">
              Right of Withdrawal
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
