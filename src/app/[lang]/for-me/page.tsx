import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "For me — SomnoBalance" };

export default async function ForMePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pt-20 pb-14 sm:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.forMe.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">{dict.forMe.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/70">{dict.forMe.p1}</p>
        <p className="mt-4 leading-relaxed text-ink/70">{dict.forMe.p2}</p>
      </div>
      <div className="py-14" style={{ background: "var(--color-scroll-2)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-6">
            <Link href={`/${lang}/regenerationscheck`} className="rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark">
              {dict.nav.regenerationscheck}
            </Link>
            <Link href={`/${lang}/shop`} className="text-sm text-mauve-dark underline underline-offset-4">
              {dict.forMe.ctaShop}
            </Link>
            <Link href={`/${lang}/about`} className="text-sm text-mauve-dark underline underline-offset-4">
              {dict.forMe.ctaAbout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
