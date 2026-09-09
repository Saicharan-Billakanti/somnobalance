import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { order } = await searchParams;
  const dict = await getDictionary(lang as Locale);
  return <CheckoutSuccessClient lang={lang as Locale} dict={dict} orderId={order ?? null} />;
}
