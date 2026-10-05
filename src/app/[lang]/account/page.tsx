import { redirect, notFound } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/currentUser";
import { getUserById, getUserOrders } from "@/lib/userService";
import { AccountClient } from "./AccountClient";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return { title: lang === "de" ? "Mein Konto & Bestellungen — SomnoBalance" : "My Account & Orders — SomnoBalance" };
}

export default async function AccountPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${lang}/login?redirect=/${lang}/account`);
  }

  const profile = (await getUserById(user.id)) || user;
  const orders = await getUserOrders(user.email);

  return (
    <AccountClient
      lang={lang as Locale}
      dict={dict}
      initialProfile={profile}
      initialOrders={orders}
    />
  );
}
