import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { getBusinessApplicationByEmail } from "@/lib/businessService";
import { ForBusinessClient } from "./ForBusinessClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "For my business & Hospitality — SomnoBalance" };

export default async function ForBusinessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const user = await getCurrentUser();
  let businessApp = null;
  if (user?.email) {
    businessApp = await getBusinessApplicationByEmail(user.email);
  }

  return <ForBusinessClient lang={lang as Locale} dict={dict} initialApp={businessApp} />;
}

