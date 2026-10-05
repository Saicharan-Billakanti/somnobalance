"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

// Client components without a lang prop read the locale from the URL
// (/de/... or /en/...) so they can pick the matching copy.
export function useLang() {
  const seg = usePathname()?.split("/")[1];
  const lang: Locale = seg === "en" ? "en" : "de";
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  return { lang, tx };
}
