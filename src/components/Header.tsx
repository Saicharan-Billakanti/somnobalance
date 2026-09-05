"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { count } = useCart();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: `/${lang}/for-me`, label: dict.nav.forMe },
    { href: `/${lang}/for-business`, label: dict.nav.forBusiness },
    { href: `/${lang}/partner`, label: dict.nav.partner },
    { href: `/${lang}/shop`, label: dict.nav.shop },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.push(`/${lang}`);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-mauve/10 bg-offwhite/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href={`/${lang}`} className="shrink-0">
          <Image
            src="/brand/somnobalance-logo.png"
            alt="SomnoBalance"
            width={876}
            height={267}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden gap-8 text-sm text-ink/80 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-mauve-dark">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher lang={lang} />
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-ink/70">
                {dict.nav.greeting.replace("{name}", user.firstName)}
              </span>
              <button
                onClick={logout}
                className="rounded-full border border-mauve/30 px-3 py-1.5 text-sm text-mauve-dark hover:bg-sand"
              >
                {dict.nav.logout}
              </button>
            </div>
          ) : (
            <>
              <Link
                href={`/${lang}/login`}
                className="hidden text-sm text-ink/80 hover:text-mauve-dark sm:block"
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${lang}/register`}
                className="hidden rounded-full border border-mauve/30 px-3 py-1.5 text-sm text-mauve-dark hover:bg-sand sm:block"
              >
                {dict.nav.register}
              </Link>
            </>
          )}
          <Link
            href={`/${lang}/cart`}
            className="relative flex items-center gap-1 rounded-full border border-mauve/30 px-3 py-1.5 text-sm text-mauve-dark hover:bg-sand"
          >
            {dict.nav.cart}
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="text-ink md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-mauve/10 px-4 pb-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-2 text-sm text-ink/80 hover:bg-sand"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <div className="mt-2 flex items-center justify-between border-t border-mauve/10 pt-3">
              <span className="text-sm text-ink/70">
                {dict.nav.greeting.replace("{name}", user.firstName)}
              </span>
              <button
                onClick={logout}
                className="rounded-lg border border-mauve/30 px-3 py-2 text-sm text-mauve-dark hover:bg-sand"
              >
                {dict.nav.logout}
              </button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2 border-t border-mauve/10 pt-3">
              <Link
                href={`/${lang}/login`}
                className="flex-1 rounded-lg border border-mauve/30 px-2 py-2 text-center text-sm text-mauve-dark hover:bg-sand"
                onClick={() => setOpen(false)}
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${lang}/register`}
                className="flex-1 rounded-lg bg-mauve px-2 py-2 text-center text-sm text-white hover:bg-mauve-dark"
                onClick={() => setOpen(false)}
              >
                {dict.nav.register}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
