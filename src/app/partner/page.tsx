import Link from "next/link";

export const metadata = { title: "Become a partner — SomnoBalance" };

export default function PartnerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">Become a partner</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Shared values, transparent commission.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">
        We work with health professionals — physiotherapists, alternative practitioners,
        kinesiologists, and others whose work touches regeneration and rest — who want to
        recommend something they believe in, on clear and fair terms.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">Transparent commission</h3>
          <p className="mt-2 text-sm text-ink/70">
            A clear percentage on every recommended sale, tracked and reported without ambiguity.
          </p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">Aligned tone</h3>
          <p className="mt-2 text-sm text-ink/70">
            No discount-driven marketing, no pressure tactics — recommendations that fit your
            practice.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <Link
          href="/contact"
          className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          Apply to become a partner
        </Link>
      </div>
    </div>
  );
}
