import { Suspense } from "react";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { ResetPasswordClient } from "./ResetPasswordClient";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading...</div>}>
      <ResetPasswordClient lang={lang as Locale} dict={dict} />
    </Suspense>
  );
}
