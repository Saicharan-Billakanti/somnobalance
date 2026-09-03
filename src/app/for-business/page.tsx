import Link from "next/link";

export const metadata = { title: "For my business — SomnoBalance" };

export default function ForBusinessPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">For my business</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">A home that gives your guests a sense of calm.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">
        For hospitality and health-sector partners — boutique hotels, wellness resorts, and clinics
        — SomnoBalance brings a considered, guest-facing regeneration system into shared spaces.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">In-room amenities</h3>
          <p className="mt-2 text-sm text-ink/70">
            Ritual sets for guest rooms — pillow, oil, and tea — presented as part of the stay.
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">Wholesale terms</h3>
          <p className="mt-2 text-sm text-ink/70">
            Volume pricing and consistent supply for properties of any size.
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">Brand-consistent experience</h3>
          <p className="mt-2 text-sm text-ink/70">
            The same calm, sensory language your guests already associate with rest.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <Link
          href="/contact"
          className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          Talk to us about your property
        </Link>
      </div>
    </div>
  );
}
