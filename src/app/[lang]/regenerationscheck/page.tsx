import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getQuizContent } from "@/lib/regenerationscheckContent";
import { RegenerationscheckClient } from "./RegenerationscheckClient";

export const metadata = { title: "Regenerationscheck — SomnoBalance" };

export default async function RegenerationscheckPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const quiz = getQuizContent(lang as Locale);

  return <RegenerationscheckClient lang={lang as Locale} dict={dict} quiz={quiz} />;
}
