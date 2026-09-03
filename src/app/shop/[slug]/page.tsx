import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct, formatPrice, products } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

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
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-teal-dark">
            {product.category} &middot; {product.phase}
          </div>
          <h1 className="mt-2 font-serif text-3xl text-ink">{product.name}</h1>
          <p className="mt-3 text-lg text-ink/70">{product.tagline}</p>
          <div className="mt-6 text-2xl font-medium text-mauve-dark">
            {formatPrice(product.price)}
            <span className="ml-2 text-sm font-normal text-ink/40">incl. VAT, plus shipping</span>
          </div>
          {product.priceNote && (
            <div className="mt-1 text-sm text-teal-dark">{product.priceNote}</div>
          )}
          <p className="mt-6 leading-relaxed text-ink/70">{product.description}</p>
          <ul className="mt-6 space-y-2 text-sm text-ink/70">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-teal-dark">—</span> {d}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <AddToCartButton slug={product.slug} />
          </div>
          <p className="mt-4 text-xs text-ink/50">
            14-day right of withdrawal within the EU. See{" "}
            <a href="/legal/returns" className="underline">
              Returns &amp; Withdrawal
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
