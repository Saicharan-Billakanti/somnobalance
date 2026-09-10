import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Blobs, PageEyebrow, RingMotif } from "@/components/Decor";

export const metadata = { title: "About — SomnoBalance" };

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const [before, after] = dict.about.craftCopy.split("{impressumLink}");

  return (
    <div className="relative overflow-hidden">
      <Blobs />
      <RingMotif className="-left-56 top-1/3 opacity-50" tone="mauve" />
      <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <PageEyebrow>{dict.about.title}</PageEyebrow>
        <h1 className="mt-5 font-serif text-4xl text-ink md:text-5xl">{dict.about.heading}</h1>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-mauve to-teal" />
        <div className="prose-legal mt-8">
          <p>{dict.about.p1}</p>
          <p>{dict.about.p2}</p>
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
