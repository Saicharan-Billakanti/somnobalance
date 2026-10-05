import { getCombinedProducts } from "@/lib/storeService";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return { title: lang === "de" ? "Shop & Schlafrituale — SomnoBalance" : "Shop & Sleep Rituals — SomnoBalance" };
}

export default async function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const allProducts = await getCombinedProducts();

  return <ShopClient products={allProducts} lang={lang as Locale} dict={dict} />;
}

