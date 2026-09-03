import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-mauve/10 bg-white/60 transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="text-xs uppercase tracking-wide text-teal-dark">{product.category}</div>
        <h3 className="mt-1 font-serif text-lg text-ink group-hover:text-mauve-dark">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink/60">{product.tagline}</p>
        <div className="mt-3 text-sm font-medium text-mauve-dark">
          {formatPrice(product.price)}{" "}
          <span className="font-normal text-ink/40">incl. VAT</span>
        </div>
      </div>
    </Link>
  );
}
