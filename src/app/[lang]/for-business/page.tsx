import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Blobs, PageEyebrow, RingMotif, tintClasses, type Tint } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";

export const metadata = { title: "For my business — SomnoBalance" };

export default async function ForBusinessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const cards: { title: string; copy: string; tint: Tint }[] = [
    { title: dict.forBusiness.card1Title, copy: dict.forBusiness.card1Copy, tint: "teal" },
    { title: dict.forBusiness.card2Title, copy: dict.forBusiness.card2Copy, tint: "mauve" },
    { title: dict.forBusiness.card3Title, copy: dict.forBusiness.card3Copy, tint: "ink" },
  ];

  return (
    <div className="relative overflow-hidden">
      <Blobs />
      <RingMotif className="-right-40 top-0 opacity-60" tone="teal" />
      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <PageEyebrow>{dict.forBusiness.eyebrow}</PageEyebrow>
        <h1 className="mt-5 font-serif text-4xl text-ink md:text-5xl">{dict.forBusiness.title}</h1>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-teal to-mauve" />
        <p className="mt-8 text-lg leading-relaxed text-ink/70">{dict.forBusiness.intro}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => {
            const t = tintClasses(card.tint);
            return (
              <Reveal key={card.title} from={i % 2 === 0 ? "left" : "right"} delay={i * 90}>
                <div
                  className={`group relative overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 ${t.border} ${t.bg}`}
                >
                  <div className={`absolute left-0 top-0 h-1 w-full ${t.bar}`} />
                  <h3 className="font-medium text-ink">{card.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{card.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10">
          <Link
            href={`/${lang}/contact`}
            className="rounded-full bg-mauve px-6 py-3 text-sm text-white shadow-[0_8px_24px_-8px_rgba(111,87,132,0.55)] hover:bg-mauve-dark"
          >
            {dict.forBusiness.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
