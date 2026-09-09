import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function LegalPage({
  lang,
  dict,
  title,
  updated,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  const pages = [
    { href: `/${lang}/legal/impressum`, label: dict.legalNav.impressum },
    { href: `/${lang}/legal/privacy`, label: dict.legalNav.privacy },
    { href: `/${lang}/legal/terms`, label: dict.legalNav.terms },
    { href: `/${lang}/legal/shipping`, label: dict.legalNav.shipping },
    { href: `/${lang}/legal/withdrawal`, label: dict.legalNav.withdrawal },
    { href: `/${lang}/legal/returns`, label: dict.legalNav.returns },
    { href: `/${lang}/legal/cancellation`, label: dict.legalNav.cancellation },
    { href: `/${lang}/legal/cookies`, label: dict.legalNav.cookies },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 md:grid-cols-[200px_1fr]">
        <nav className="hidden md:block">
          <div className="sticky top-24 space-y-1 text-sm">
            {pages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="block rounded-lg px-3 py-2 text-ink/60 hover:bg-sand hover:text-mauve-dark"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </nav>
        <div>
          <h1 className="font-serif text-3xl text-ink">{title}</h1>
          <p className="mt-2 text-xs text-ink/40">
            {dict.legalPages.lastUpdated}: {updated}
          </p>
          <div className="prose-legal mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
