import Link from "next/link";
import { business } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const legal = [
    { href: `/${lang}/legal/impressum`, label: dict.legalNav.impressum },
    { href: `/${lang}/legal/privacy`, label: dict.legalNav.privacy },
    { href: `/${lang}/legal/terms`, label: dict.legalNav.terms },
    { href: `/${lang}/legal/shipping`, label: dict.legalNav.shipping },
    { href: `/${lang}/legal/withdrawal`, label: dict.legalNav.withdrawal },
    { href: `/${lang}/legal/returns`, label: dict.legalNav.returns },
    { href: `/${lang}/legal/cancellation`, label: dict.legalNav.cancellation },
    { href: `/${lang}/legal/cookies`, label: dict.legalNav.cookies },
  ];

  const explore = [
    { href: `/${lang}/for-me`, label: dict.nav.forMe },
    { href: `/${lang}/for-business`, label: dict.nav.forBusiness },
    { href: `/${lang}/partner`, label: dict.nav.partner },
    { href: `/${lang}/shop`, label: dict.nav.shop },
    { href: `/${lang}/faq`, label: dict.nav.faq },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-mauve/10 bg-gradient-to-br from-mauve/[0.07] via-sand/50 to-teal/[0.09]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal/15 blur-[90px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-mauve/15 blur-[90px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-serif text-lg text-mauve-dark">SomnoBalance</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">{dict.footer.tagline}</p>
          <div className="mt-4 flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mauve" />
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-teal-dark">{dict.footer.explore}</div>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-mauve-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-teal-dark">{dict.footer.legal}</div>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-mauve-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-teal-dark">{dict.footer.contact}</div>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>{business.email}</li>
            <li>{business.addressLine2}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-mauve/10 px-4 py-5 text-center text-xs text-ink/50 sm:px-6">
        © {new Date().getFullYear()} SomnoBalance. {dict.footer.rights}
      </div>
    </footer>
  );
}
