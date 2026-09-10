import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Blobs, PageEyebrow, RingMotif } from "@/components/Decor";

export const metadata = { title: "For me — SomnoBalance" };

export default async function ForMePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="relative overflow-hidden">
      <Blobs />
      <RingMotif className="-right-40 top-0 opacity-60" tone="mauve" />
      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <PageEyebrow>{dict.forMe.eyebrow}</PageEyebrow>
        <h1 className="mt-5 font-serif text-4xl text-ink md:text-5xl">{dict.forMe.title}</h1>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-mauve to-teal" />
        <p className="mt-8 text-lg leading-relaxed text-ink/70">{dict.forMe.p1}</p>
        <p className="mt-4 leading-relaxed text-ink/70">{dict.forMe.p2}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/${lang}/shop`}
            className="rounded-full bg-mauve px-6 py-3 text-sm text-white shadow-[0_8px_24px_-8px_rgba(111,87,132,0.55)] hover:bg-mauve-dark"
          >
            {dict.forMe.ctaShop}
          </Link>
          <Link
            href={`/${lang}/about`}
            className="rounded-full border border-teal/30 px-6 py-3 text-sm text-teal-dark hover:bg-teal/10"
          >
            {dict.forMe.ctaAbout}
          </Link>
        </div>
      </div>
    </div>
  );
}
