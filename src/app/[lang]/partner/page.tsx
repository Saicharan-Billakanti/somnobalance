import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { PartnerClient } from "./PartnerClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return { title: lang === "de" ? "Partner werden — SomnoBalance" : "Become a partner — SomnoBalance" };
}

export default async function PartnerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return <PartnerClient lang={lang as Locale} dict={dict} />;
}
