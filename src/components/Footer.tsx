import Link from "next/link";
import Image from "next/image";
import { Leaf, Mail, MapPin } from "lucide-react";
import { business } from "@/lib/site";
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
    <footer className="relative overflow-hidden text-lovable-primary-foreground before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-20 before:bg-gradient-to-b before:from-lovable-background/25 before:to-transparent">
      <Image
        src="/brand/pdp-footer.jpg"
        alt="SomnoBalance aromatherapy bottle beside dried flowers"
        fill
        sizes="100vw"
        className="object-cover object-left"
      />
      <div className="absolute inset-0 bg-lovable-foreground/45" />
      <div className="relative mx-auto grid min-h-[390px] max-w-[1500px] px-6 py-12 md:grid-cols-[0.85fr_2.15fr] md:px-12 lg:min-h-[465px] lg:px-16 lg:py-16">
        <div aria-hidden="true" />
        <div className="flex min-w-0 flex-col">
          <div className="grid gap-10 md:grid-cols-[1.25fr_0.8fr_0.95fr_1.1fr] md:gap-0">
            <div className="md:pr-10">
              <div className="flex items-center gap-3">
                <span className="relative flex size-10 items-center justify-center">
                  <Leaf className="size-7 rotate-[-28deg] stroke-[1.1]" />
                  <Leaf className="absolute size-5 translate-x-2 rotate-[28deg] stroke-[1.1]" />
                </span>
                <span className="font-lovable-serif text-3xl leading-none">SomnoBalance</span>
              </div>
              <p className="mt-5 max-w-[260px] text-[11px] leading-5 text-lovable-primary-foreground/70">
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
                        ? "size-10 rounded-full border border-lovable-primary-foreground/25 px-0 text-lovable-primary-foreground hover:bg-lovable-primary-foreground/10 flex items-center justify-center"
                        : "size-10 rounded-full border border-lovable-primary-foreground/25 px-0 font-lovable-serif text-base text-lovable-primary-foreground hover:bg-lovable-primary-foreground/10 flex items-center justify-center"
                    }
                  >
                    {Icon ? <Icon className="size-4" /> : "p"}
                  </a>
                ))}
              </div>
            </div>

            <nav className="border-lovable-primary-foreground/25 md:border-l md:px-8" aria-label="Explore">
              <h2 className="font-lovable-sans text-sm font-medium">{dict.footer.explore}</h2>
              <div className="mt-5 flex flex-col gap-2 text-[11px] text-lovable-primary-foreground/75">
                {explore.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav className="border-lovable-primary-foreground/25 md:border-l md:px-8" aria-label="Legal">
              <h2 className="font-lovable-sans text-sm font-medium">{dict.footer.legal}</h2>
              <div className="mt-5 flex flex-col gap-2 text-[11px] text-lovable-primary-foreground/75">
                {legal.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-lovable-primary-foreground/25 md:border-l md:pl-8">
              <h2 className="font-lovable-sans text-sm font-medium">{dict.footer.contact}</h2>
              <div className="mt-5 space-y-5 text-[11px] leading-5 text-lovable-primary-foreground/75">
                <a href={`mailto:${business.email}`} className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  <span>{business.email}</span>
                </a>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>{business.addressLine2}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-lovable-primary-foreground/25 pt-4 text-[10px] text-lovable-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between md:mt-auto">
            <span>
              © {new Date().getFullYear()} SomnoBalance. {dict.footer.rights}
            </span>
            <div className="flex items-center gap-4 text-lovable-primary-foreground/80">
              <span className="h-px w-10 bg-lovable-primary-foreground/40" />
              <span className="rotate-[-5deg] font-lovable-serif text-2xl italic">
                {dict.footer.handwrittenTagline}
              </span>
              <span className="h-px w-10 bg-lovable-primary-foreground/40" />
            </div>
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
