import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";

export default async function SignUpPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  redirect(`/${lang || "de"}/register`);
}
