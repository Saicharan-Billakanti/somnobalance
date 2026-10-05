import type { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";

export default async function SignUpPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  redirect(`/${lang || "de"}/register`);
}
