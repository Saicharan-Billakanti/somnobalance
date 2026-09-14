import { business } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Contact — SomnoBalance" };

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-teal-dark">{dict.contact.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">{dict.contact.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">{dict.contact.intro}</p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-ink">{dict.contact.email}</h3>
          <p className="mt-1 text-ink/70">{business.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">{dict.contact.phone}</h3>
          <p className="mt-1 text-ink/70">{business.phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">{dict.contact.address}</h3>
          <p className="mt-1 text-ink/70">
            {business.legalEntityName}
            <br />
            {business.addressLine1}
            <br />
            {business.addressLine2}
          </p>
        </div>
      </div>

      <ContactForm dict={dict} />
    </div>
  );
}
