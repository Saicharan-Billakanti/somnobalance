import Link from "next/link";
import Image from "next/image";
import { business } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

// Social links are placeholders (# ) — swap in the real profile URLs once
// the client shares them.
const social = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Pinterest", href: "#", icon: PinterestIcon },
  { label: "YouTube", href: "#", icon: YouTubeIcon },
];

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
    <footer className="relative overflow-hidden bg-ink text-white/90">
      <div className="absolute inset-y-0 left-0 hidden w-[26%] md:block">
        <Image
          src="/products/somnobalance-roll-on.jpg"
          alt=""
          fill
          sizes="26vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 pl-4 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:pl-[calc(26%+2rem)] lg:px-10 lg:pl-[calc(26%+2.5rem)]">
        <div>
          <div className="font-serif text-lg text-white">SomnoBalance</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">{dict.footer.tagline}</p>
          <div className="mt-5 flex items-center gap-3">
            {social.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-white/50 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-white">{dict.footer.explore}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-white">{dict.footer.legal}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-white">{dict.footer.contact}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>{business.email}</li>
            <li>{business.addressLine2}</li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/15 px-4 py-5 text-xs text-white/60 sm:px-6 lg:px-10">
        <span>
          © {new Date().getFullYear()} SomnoBalance. {dict.footer.rights}
        </span>
        <span className="font-serif text-base italic text-white/80">{dict.footer.handwrittenTagline}</span>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 17c1-3 1.5-5 2-7.5.4-2 3.2-1.8 3 .3-.2 1.8-1 4-3 4.2-1.2.1-2-.5-2-1.7 0-1.5 1.2-3.3 3-3.3 1.5 0 2.3 1 2.1 2.5" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
