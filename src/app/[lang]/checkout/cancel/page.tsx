import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export default async function CheckoutCancelPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-serif text-2xl text-ink">{dict.checkout.paymentCancelledTitle}</h1>
      <p className="mt-4 text-ink/70">{dict.checkout.paymentCancelledNotice}</p>
      <Link
        href={`/${lang}/checkout`}
        className="mt-8 inline-block rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
      >
        {dict.checkout.backToCheckout}
      </Link>
    </div>
  );
}
