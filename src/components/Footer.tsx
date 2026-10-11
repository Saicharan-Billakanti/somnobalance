import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { business } from "@/lib/site";
import { FooterNewsletterForm } from "@/components/FooterNewsletterForm";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

// Social links are placeholders (# ) — swap in the real profile URLs once
// the client shares them.
const social = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Pinterest", href: "#", icon: null },
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
    <footer className="relative overflow-hidden text-lovable-primary-foreground">
      <Image
        src="/mockup/footer-night.jpg"
        alt="SomnoBalance night"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#140e1b]/85" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:px-16">
        <div className="flex min-w-0 flex-col">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5 md:gap-8 lg:gap-10">
            <div className="sm:col-span-2 md:col-span-1 md:pr-4">
              <Link href={`/${lang}`} className="inline-block shrink-0">
                <Image
                  src="/brand/somnobalance-logo.webp"
                  alt="SomnoBalance"
                  width={876}
                  height={267}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="mt-5 max-w-[260px] text-xs leading-5 text-lovable-primary-foreground/75">
                {dict.footer.tagline}
              </p>
              <div className="mt-8 flex gap-3" aria-label="Social media">
                {social.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={
                      Icon
                        ? "size-9 rounded-full border border-lovable-primary-foreground/25 text-lovable-primary-foreground hover:bg-lovable-primary-foreground/15 transition flex items-center justify-center"
                        : "size-9 rounded-full border border-lovable-primary-foreground/25 font-lovable-serif text-sm text-lovable-primary-foreground hover:bg-lovable-primary-foreground/15 transition flex items-center justify-center"
                    }
                  >
                    {Icon ? <Icon className="size-4" /> : "p"}
                  </a>
                ))}
              </div>
            </div>

            <nav className="border-lovable-primary-foreground/20 md:border-l md:pl-6" aria-label="Explore">
              <h2 className="font-lovable-sans text-sm font-semibold tracking-wide text-white">{dict.footer.explore}</h2>
              <div className="mt-5 flex flex-col gap-2.5 text-xs text-lovable-primary-foreground/75">
                {explore.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-white transition">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav className="border-lovable-primary-foreground/20 md:border-l md:pl-6" aria-label="Legal">
              <h2 className="font-lovable-sans text-sm font-semibold tracking-wide text-white">{dict.footer.legal}</h2>
              <div className="mt-5 flex flex-col gap-2.5 text-xs text-lovable-primary-foreground/75">
                {legal.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-white transition">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-lovable-primary-foreground/20 md:border-l md:pl-6">
              <h2 className="font-lovable-sans text-sm font-semibold tracking-wide text-white">{dict.footer.contact}</h2>
              <div className="mt-5 space-y-4 text-xs leading-5 text-lovable-primary-foreground/75">
                <a href={`mailto:${business.email}`} className="flex items-start gap-3 hover:text-white transition">
                  <Mail className="mt-0.5 size-4 shrink-0 text-white/80" />
                  <span>{business.email}</span>
                </a>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-white/80" />
                  <span>{business.addressLine2}</span>
                </p>
              </div>
            </div>

            <div className="border-lovable-primary-foreground/20 sm:col-span-2 md:col-span-1 md:border-l md:pl-6">
              <h2 className="font-lovable-sans text-sm font-semibold tracking-wide text-white">{dict.footer.newsletterTitle}</h2>
              <p className="mt-5 text-xs leading-5 text-lovable-primary-foreground/75">
                {dict.footer.newsletterCopy}
              </p>
              <div className="mt-4">
                <FooterNewsletterForm lang={lang} />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-lovable-primary-foreground/20 pt-6 text-[10px] uppercase tracking-[0.2em] text-lovable-primary-foreground/60">
            {dict.homeSections.concept.phaseStrip.map((name, i) => (
              <span key={name} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-white/30">—</span>}
                {name}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-lovable-primary-foreground/20 pt-4 text-xs text-lovable-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} SomnoBalance. {dict.footer.rights}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
