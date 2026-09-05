import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Become a partner — SomnoBalance" };

export default async function PartnerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.partner.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">{dict.partner.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">{dict.partner.intro}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">{dict.partner.card1Title}</h3>
          <p className="mt-2 text-sm text-ink/70">{dict.partner.card1Copy}</p>
        </div>
        <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
          <h3 className="font-medium text-ink">{dict.partner.card2Title}</h3>
          <p className="mt-2 text-sm text-ink/70">{dict.partner.card2Copy}</p>
        </div>
      </div>
      <div className="mt-10">
        <Link
          href={`/${lang}/contact`}
          className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          {dict.partner.cta}
        </Link>
      </div>
    </div>
  );
}
