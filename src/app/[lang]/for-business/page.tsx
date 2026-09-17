import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { BusinessApplicationForm } from "@/components/BusinessApplicationForm";

export const metadata = { title: "For my business — SomnoBalance" };

export default async function ForBusinessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pt-20 pb-14 sm:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.forBusiness.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">{dict.forBusiness.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/70">{dict.forBusiness.intro}</p>
      </div>
      <div className="py-14" style={{ background: "var(--color-scroll-2)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
              <h3 className="font-medium text-ink">{dict.forBusiness.card1Title}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.forBusiness.card1Copy}</p>
            </div>
            <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
              <h3 className="font-medium text-ink">{dict.forBusiness.card2Title}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.forBusiness.card2Copy}</p>
            </div>
            <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
              <h3 className="font-medium text-ink">{dict.forBusiness.card3Title}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.forBusiness.card3Copy}</p>
            </div>
            <div className="rounded-2xl border border-mauve/10 bg-white/60 p-6">
              <h3 className="font-medium text-ink">{dict.forBusiness.card4Title}</h3>
              <p className="mt-2 text-sm text-ink/70">{dict.forBusiness.card4Copy}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-2xl text-ink">{dict.applicationForm.businessTitle}</h2>
        <p className="mt-2 text-ink/70">{dict.applicationForm.businessIntro}</p>
        <div className="mt-8">
          <BusinessApplicationForm dict={dict} />
        </div>
      </div>
    </div>
  );
}
