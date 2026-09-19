import { getCombinedProducts } from "@/lib/storeService";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop & Sleep Rituals — SomnoBalance" };

const PHASES = ["REGULATE", "LET GO", "PREPARE", "REGENERATE"];

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ phase?: string | string[] }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const { phase } = await searchParams;
  const requested = (Array.isArray(phase) ? phase[0] : phase)?.toUpperCase();
  const initialPhase = requested && PHASES.includes(requested) ? requested : "all";

  const allProducts = await getCombinedProducts();

  return (
    <ShopClient
      products={allProducts}
      lang={lang as Locale}
      dict={dict}
      initialPhase={initialPhase}
    />
  );
}
