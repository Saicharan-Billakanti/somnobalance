import Link from "next/link";

export const metadata = { title: "For me — SomnoBalance" };

export default function ForMePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">For me</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">A ritual that eases your transition into the night.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">
        SomnoBalance was built for the moments between the end of the day and the start of sleep —
        for confident women navigating change in how they rest, with the standards to expect
        something considered, not clinical.
      </p>
      <p className="mt-4 leading-relaxed text-ink/70">
        Regeneration and sleep concerns touch nearly everyone — this space is built with that
        wider experience in mind, without losing the sensory, unhurried tone at its centre.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/shop" className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark">
          Explore the shop
        </Link>
        <Link href="/about" className="rounded-full border border-mauve/30 px-6 py-3 text-sm text-mauve-dark hover:bg-sand">
          The SomnoBalance principle
        </Link>
      </div>
    </div>
  );
}
