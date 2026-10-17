import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { business } from "@/lib/site";
import { FooterNewsletterForm } from "@/components/FooterNewsletterForm";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

// Only real, actively-used channels — per the client's footer spec,
// SomnoBalance currently has no Pinterest or YouTube presence, and no
// active Facebook page either. Instagram's href stays a placeholder
// until the real handle is shared.
const social = [{ label: "Instagram", href: "#", icon: InstagramIcon }];

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const legal = [
    { href: `/${lang}/faq`, label: dict.nav.faq },
    { href: `/${lang}/legal/shipping`, label: dict.legalNav.shipping },
    { href: `/${lang}/legal/returns`, label: dict.legalNav.returns },
    { href: `/${lang}/legal/impressum`, label: dict.legalNav.impressum },
    { href: `/${lang}/legal/privacy`, label: dict.legalNav.privacy },
    { href: `/${lang}/legal/terms`, label: dict.legalNav.terms },
    { href: `/${lang}/legal/withdrawal`, label: dict.legalNav.withdrawal },
    { href: `/${lang}/legal/cancellation`, label: dict.legalNav.cancellation },
    { href: `/${lang}/legal/cookies`, label: dict.legalNav.cookies },
  ];

  // Order per the client's spec: Für mich, Das Konzept, Regenerationscheck,
  // Shop, Für mein Unternehmen, Partner werden, Über Nicole & Alex, Kontakt.
  const explore = [
    { href: `/${lang}/for-me`, label: dict.nav.forMe },
    { href: `/${lang}/concept`, label: dict.nav.concept },
    { href: `/${lang}/regenerationscheck`, label: dict.nav.regenerationscheck },
    { href: `/${lang}/shop`, label: dict.nav.shop },
    { href: `/${lang}/for-business`, label: dict.nav.forBusiness },
    { href: `/${lang}/partner`, label: dict.nav.partner },
    { href: `/${lang}/concept#menschen`, label: dict.nav.aboutFounders },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer
      className="relative text-lovable-primary-foreground"
      style={{
        background:
          "linear-gradient(180deg, var(--color-circuit-prepare) 0%, var(--color-circuit-regenerate) 100%)",
      }}
    >
      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 py-14 md:grid-cols-[1.3fr_0.9fr_1fr_1fr] md:gap-8 md:px-12 lg:px-16 lg:py-20">
        <div>
          <Link href={`/${lang}`} className="inline-block shrink-0">
            <Image
              src="/brand/somnobalance-logo.webp"
              alt="SomnoBalance"
              width={876}
              height={267}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-7 max-w-[300px] font-lovable-serif text-base leading-snug text-lovable-primary-foreground">
            {dict.footer.tagline}
          </p>
          <p className="mt-4 max-w-[300px] text-[11px] leading-5 text-lovable-primary-foreground/70">
            {dict.footer.brandStatement}
          </p>
          <div className="mt-7 flex gap-4" aria-label="Social media">
            {social.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-lovable-primary-foreground/70 transition hover:text-lovable-primary-foreground"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore + Service & Legal: collapsible on mobile, open columns from md up */}
        <nav aria-label="Explore" className="md:contents">
          <details className="group border-b border-lovable-primary-foreground/15 pb-4 md:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-lovable-sans text-xs font-medium uppercase tracking-[0.15em]">
              {dict.footer.explore}
              <span aria-hidden="true" className="transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-5 flex flex-col gap-3 text-xs text-lovable-primary-foreground/75">
              {explore.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <div className="hidden md:block">
            <h2 className="font-lovable-sans text-xs font-medium uppercase tracking-[0.15em]">
              {dict.footer.explore}
            </h2>
            <div className="mt-5 flex flex-col gap-2.5 text-[11px] text-lovable-primary-foreground/75">
              {explore.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="md:contents">
          <details className="group border-b border-lovable-primary-foreground/15 pb-4 md:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-lovable-sans text-xs font-medium uppercase tracking-[0.15em] text-lovable-primary-foreground/80">
              {dict.footer.legal}
              <span aria-hidden="true" className="transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 flex flex-col gap-3 text-xs text-lovable-primary-foreground/60">
              {legal.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <div className="hidden md:block">
            <h2 className="font-lovable-sans text-[10px] font-medium uppercase tracking-[0.15em] text-lovable-primary-foreground/60">
              {dict.footer.legal}
            </h2>
            <div className="mt-4 flex flex-col gap-2 text-[10px] text-lovable-primary-foreground/50">
              {legal.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-lovable-primary-foreground/75">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-lovable-sans text-xs font-medium uppercase tracking-[0.15em]">
            {dict.footer.contact}
          </h2>
          <a href={`mailto:${business.email}`} className="mt-5 flex items-center gap-2.5 text-[11px] leading-5 text-lovable-primary-foreground/75">
            <Mail className="size-4 shrink-0" />
            <span>{business.email}</span>
          </a>

          <h2 className="mt-8 font-lovable-sans text-xs font-medium uppercase tracking-[0.15em]">
            {dict.footer.newsletterTitle}
          </h2>
          <p className="mt-3 text-[11px] leading-5 text-lovable-primary-foreground/70">
            {dict.footer.newsletterCopy}
          </p>
          <div className="mt-4">
            <FooterNewsletterForm lang={lang} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-6 pb-10 md:px-12 lg:px-16">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-lovable-primary-foreground/20 pt-8 text-[10px] uppercase tracking-[0.2em] text-lovable-primary-foreground/50">
          {dict.homeSections.concept.phaseStrip.map((name, i) => (
            <span key={name} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true">—</span>}
              {name}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-lovable-primary-foreground/40">{dict.footer.cycleClosing}</p>

        <div className="mt-6 border-t border-lovable-primary-foreground/20 pt-4 text-[10px] text-lovable-primary-foreground/50">
          © {new Date().getFullYear()} SomnoBalance. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
