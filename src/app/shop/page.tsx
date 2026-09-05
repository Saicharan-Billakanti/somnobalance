import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Shop — SomnoBalance" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">Shop</p>
      <h1 className="mt-3 font-serif text-3xl text-ink">Tools for the ritual</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Each piece supports one phase of the SomnoBalance system. Prices shown include statutory
        German VAT (MwSt.). Shipped via DHL within Germany — free from €59, included in the price
        for mattresses.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
