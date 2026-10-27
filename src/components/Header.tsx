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
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const { count } = useCart();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isAffiliate = Boolean(user?.isAffiliate || user?.role === "affiliate");
  const isDualRole = isAffiliate;
  const isAdmin = Boolean(user && user.role === "admin");
  const isBusiness = Boolean(user?.isBusiness && !isAffiliate && user?.role !== "admin");

  // Main navigation per the client's nav mockup: Das Konzept · Für mich ·
  // Für Unternehmen · Partner werden · Shop. Search, account and cart are icons.
  const nav = [
    { href: `/${lang}/concept`, label: dict.nav.concept },
    { href: `/${lang}/for-me`, label: dict.nav.forMe },
    { href: `/${lang}/for-business`, label: isBusiness ? (lang === "de" ? "Mein B2B-Portal" : "Business Portal") : dict.nav.forBusinessMenu },
    { href: `/${lang}/partner`, label: dict.nav.partner },
    { href: `/${lang}/shop`, label: dict.nav.shop },
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="shrink-0">
            <Image
              src="/brand/somnobalance-logo.webp"
              alt="SomnoBalance"
              width={876}
              height={267}
              priority
              className="h-14 w-auto"
            />
          </Link>

          {/* Dual Affiliate / Customer Switcher Pill */}
          {isDualRole && (
            <div className="hidden items-center rounded-full bg-sand p-1 text-xs font-medium lg:flex">
              <Link
                href={`/${lang}/shop`}
                className="rounded-full px-3 py-1 text-ink/70 hover:text-ink transition"
              >
                {lang === "de" ? "Kunden-Shop" : "Customer Shop"}
              </Link>
              <Link
                href={`/${lang}/partner`}
                className="rounded-full bg-white px-3 py-1 text-teal-dark shadow-sm hover:text-teal transition"
              >
                ⭐ {lang === "de" ? "Partner-Portal" : "Partner Portal"}
              </Link>
            </div>
          )}
        </div>

        <nav className="hidden gap-7 text-sm font-medium text-ink/80 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-mauve-dark transition">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/${lang}/shop`}
            aria-label={tx("Search", "Suche")}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink/70 hover:bg-sand hover:text-mauve-dark transition sm:flex"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <LocaleSwitcher lang={lang} />
          
          {/* Admin shortcut button */}
          {isAdmin && (
            <Link
              href={`/${lang}/admin`}
              className="hidden items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-white hover:bg-ink/80 transition sm:flex"
            >
              <span className="h-2 w-2 rounded-full bg-teal" />
              Admin Hub
            </Link>
          )}

          {/* Account: one icon bundling login / register / account / logout */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label={dict.nav.account}
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-sand hover:text-mauve-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
              </svg>
            </button>
            {accountOpen && (
              <div
                className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-mauve/15 bg-white p-2 text-sm shadow-lg"
                onClick={() => setAccountOpen(false)}
              >
                {user ? (
                  <>
                    <p className="px-3 py-2 text-xs font-semibold text-ink">
                      {isAdmin ? user.firstName || "Admin" : dict.nav.greeting.replace("{name}", user.firstName)}
                    </p>
                    <Link
                      href={isAdmin ? `/${lang}/admin` : `/${lang}/account`}
                      className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-sand"
                    >
                      {isAdmin ? "Admin Hub" : tx("My orders & profile", "Meine Bestellungen & Profil")}
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-ink/80 hover:bg-sand"
                    >
                      {dict.nav.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={`/${lang}/login`} className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-sand">
                      {dict.nav.login}
                    </Link>
                    <Link href={`/${lang}/register`} className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-sand">
                      {dict.nav.register}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            href={`/${lang}/cart`}
            aria-label={dict.nav.cart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-sand hover:text-mauve-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14l-1 12H6L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-mauve px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-1.5 text-ink hover:bg-sand lg:hidden"
            aria-label={tx("Toggle menu", "Menü umschalten")}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-mauve/10 bg-offwhite px-4 py-4 lg:hidden">
          {/* Dual Role Switcher in Mobile */}
          {isDualRole && (
            <div className="mb-2 grid grid-cols-2 gap-2 rounded-xl bg-sand p-1.5 text-center text-xs font-medium">
              <Link
                href={`/${lang}/shop`}
                className="rounded-lg bg-white py-2 text-ink shadow-sm"
                onClick={() => setOpen(false)}
              >
                Customer Shop
              </Link>
              <Link
                href={`/${lang}/partner`}
                className="rounded-lg bg-teal/15 py-2 text-teal-dark font-semibold"
                onClick={() => setOpen(false)}
              >
                ⭐ Partner Portal
              </Link>
            </div>
          )}

          {isAdmin && (
            <Link
              href={`/${lang}/admin`}
              className="mb-2 flex items-center justify-between rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              <span>⚡ SomnoBalance Admin Portal</span>
              <span className="h-2 w-2 rounded-full bg-teal" />
            </Link>
          )}

          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-sand transition"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="mt-3 flex items-center justify-between border-t border-mauve/10 pt-3">
              {isAdmin ? (
                <Link
                  href={`/${lang}/admin`}
                  onClick={() => setOpen(false)}
                  className="group flex flex-col"
                >
                  <span className="block text-sm font-semibold text-ink group-hover:text-mauve-dark">
                    {user.firstName || "Admin"}
                  </span>
                  <span className="block text-[11px] text-teal-dark font-medium underline">
                    Admin Portal & Staff Roles →
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/${lang}/account`}
                  onClick={() => setOpen(false)}
                  className="group flex flex-col"
                >
                  <span className="block text-sm font-semibold text-ink group-hover:text-mauve-dark">
                    {dict.nav.greeting.replace("{name}", user.firstName)}
                  </span>
                  <span className="block text-[11px] text-teal-dark font-medium underline">
                    My Orders & Profile Settings →
                  </span>
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded-lg border border-mauve/30 px-3 py-1.5 text-xs text-mauve-dark hover:bg-sand"
              >
                {dict.nav.logout}
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 border-t border-mauve/10 pt-3">
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
