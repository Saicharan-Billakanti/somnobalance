"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const LABELS: Record<Locale, string> = { de: "DE", en: "EN" };

export function LocaleSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === lang) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
    const rest = pathname.startsWith(`/${lang}`) ? pathname.slice(`/${lang}`.length) : pathname;
    router.push(`/${next}${rest}`);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-mauve/20 p-0.5 text-xs">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`rounded-full px-2 py-1 ${
            l === lang ? "bg-mauve text-white" : "text-ink/60 hover:bg-sand"
          }`}
          aria-current={l === lang}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
