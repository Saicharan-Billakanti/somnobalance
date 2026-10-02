import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "FAQ — SomnoBalance" };

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.faq.title}</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">{dict.faq.heading}</h1>
      <div className="mt-10 divide-y divide-mauve/10">
        {dict.faq.items.map((item) => (
          <div key={item.q} className="py-6">
            <h3 className="font-medium text-ink">{item.q}</h3>
            <p className="mt-2 text-ink/70">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
