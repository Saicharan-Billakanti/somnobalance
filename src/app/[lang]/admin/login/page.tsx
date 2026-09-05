import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { AdminLoginClient } from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  return <AdminLoginClient lang={lang as Locale} dict={dict} />;
}
