import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { PartnerPortalGate } from "./PartnerPortalGate";

export default async function PartnerPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <PartnerPortalGate lang={lang as Locale}>{children}</PartnerPortalGate>;
}
