import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`/${lang}/login?redirect=/${lang}/admin`);
}

