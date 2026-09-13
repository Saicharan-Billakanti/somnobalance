import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "About — SomnoBalance" };

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const [before, after] = dict.about.craftCopy.split("{impressumLink}");

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-14 sm:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.about.title}</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">{dict.about.heading}</h1>
        <div className="prose-legal mt-8">
          <p>{dict.about.p1}</p>
          <p>{dict.about.p2}</p>
        </div>
      </div>
      <div className="py-14" style={{ background: "var(--color-scroll-2)" }}>
        <div className="prose-legal mx-auto max-w-3xl px-4 sm:px-6">
          <p>{dict.about.p3}</p>
          <h2>{dict.about.craftTitle}</h2>
          <p>
            {before}
            <a href={`/${lang}/legal/impressum`}>{dict.about.impressumLinkLabel}</a>
            {after}
          </p>
        </div>
      </div>
    </div>
  );
}
