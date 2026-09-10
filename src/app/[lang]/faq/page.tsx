import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Blobs, PageEyebrow, RingMotif, tintClasses, type Tint } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";

export const metadata = { title: "FAQ — SomnoBalance" };

const TINT_CYCLE: Tint[] = ["mauve", "teal", "ink"];

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="relative overflow-hidden">
      <Blobs />
      <RingMotif className="-right-56 top-1/4 opacity-50" tone="teal" />
      <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <PageEyebrow>{dict.faq.title}</PageEyebrow>
        <h1 className="mt-5 font-serif text-4xl text-ink md:text-5xl">{dict.faq.heading}</h1>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-teal to-mauve" />
        <div className="mt-10 space-y-4">
          {dict.faq.items.map((item, i) => {
            const t = tintClasses(TINT_CYCLE[i % TINT_CYCLE.length]);
            return (
              <Reveal key={item.q} from={i % 2 === 0 ? "left" : "right"} delay={i * 70}>
                <div className={`relative overflow-hidden rounded-2xl border p-6 ${t.border} ${t.bg}`}>
                  <div className={`absolute left-0 top-0 h-full w-1 ${t.bar}`} />
                  <h3 className="font-medium text-ink">{item.q}</h3>
                  <p className="mt-2 text-ink/70">{item.a}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
