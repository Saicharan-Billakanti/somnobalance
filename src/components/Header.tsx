"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { UserButton, useAuth as useClerkAuth } from "@clerk/nextjs";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { count } = useCart();
  const { user, setUser } = useAuth();
  const { isSignedIn: isClerkSignedIn } = useClerkAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isAffiliate = Boolean(user?.isAffiliate || user?.role === "affiliate");
  const isDualRole = isAffiliate;
  const isAdmin = Boolean(user && user.role === "admin");
  const isBusiness = Boolean(user?.isBusiness && !isAffiliate && user?.role !== "admin");

  const nav = [
    { href: `/${lang}/for-me`, label: dict.nav.forMe },
    { href: `/${lang}/for-business`, label: isBusiness ? (lang === "de" ? "Mein B2B-Portal" : "Business Portal") : dict.nav.forBusiness },
    {
      href: `/${lang}/partner`,
      label: isDualRole
        ? (lang === "de" ? "Partner-Portal" : "Partner Portal")
        : dict.nav.partner,
    },
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="shrink-0">
            <Image
              src="/brand/somnobalance-logo.png"
              alt="SomnoBalance"
              width={876}
              height={267}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Dual Affiliate / Customer Switcher Pill */}
          {isDualRole && (
            <div className="hidden items-center rounded-full bg-sand p-1 text-xs font-medium lg:flex">
              <Link
                href={`/${lang}/shop`}
                className="rounded-full px-3 py-1 text-ink/70 hover:text-ink transition"
              >
                🛒 {lang === "de" ? "Kunden-Shop" : "Customer Shop"}
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

        <nav className="hidden gap-7 text-sm font-medium text-ink/80 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-mauve-dark transition">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
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

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              {isAdmin ? (
                <Link
                  href={`/${lang}/admin`}
                  className="flex flex-col text-right group hover:opacity-80 transition"
                >
                  <span className="text-xs font-semibold text-ink group-hover:text-mauve-dark flex items-center justify-end gap-1">
                    <span>🛡️</span> {user.firstName || "Admin"}
                  </span>
                  <span className="text-[10px] text-teal-dark font-medium underline">
                    Admin Hub &amp; Staff Roles
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/${lang}/account`}
                  className="flex flex-col text-right group hover:opacity-80 transition"
                >
                  <span className="text-xs font-semibold text-ink group-hover:text-mauve-dark flex items-center justify-end gap-1">
                    <span>👤</span> {dict.nav.greeting.replace("{name}", user.firstName)}
                  </span>
                  <span className="text-[10px] text-teal-dark font-medium underline">
                    My Orders &amp; Profile
                  </span>
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded-full border border-mauve/30 px-3 py-1 text-xs text-mauve-dark hover:bg-sand transition"
              >
                {dict.nav.logout}
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={`/${lang}/login`}
                className="text-sm font-medium text-ink/80 hover:text-mauve-dark transition px-2.5 py-1.5"
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${lang}/register`}
                className="rounded-full border border-mauve/30 px-3.5 py-1.5 text-sm font-medium text-mauve-dark hover:bg-sand transition shadow-2xs"
              >
                {dict.nav.register}
              </Link>
            </div>
          )}

          <Link
            href={`/${lang}/cart`}
            className="relative flex items-center gap-1 rounded-full border border-mauve/30 px-3 py-1.5 text-sm text-mauve-dark hover:bg-sand transition"
          >
            {dict.nav.cart}
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-1.5 text-ink hover:bg-sand md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-mauve/10 bg-offwhite px-4 py-4 md:hidden">
          {/* Dual Role Switcher in Mobile */}
          {isDualRole && (
            <div className="mb-2 grid grid-cols-2 gap-2 rounded-xl bg-sand p-1.5 text-center text-xs font-medium">
              <Link
                href={`/${lang}/shop`}
                className="rounded-lg bg-white py-2 text-ink shadow-sm"
                onClick={() => setOpen(false)}
              >
                🛒 Customer Shop
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

          {/* If Customer only, prominent prompt to Become a Partner */}
          {!isDualRole && !isAdmin && !isBusiness && (
            <Link
              href={`/${lang}/partner`}
              className="mt-1 flex items-center justify-between rounded-lg border border-teal/30 bg-teal/5 px-3 py-2 text-xs font-semibold text-teal-dark"
              onClick={() => setOpen(false)}
            >
              <span>✨ {lang === "de" ? "Partner werden (15% Provision)" : "Become a Partner (15% Commission)"}</span>
              <span>→</span>
            </Link>
          )}

          {user ? (
            <div className="mt-3 flex items-center justify-between border-t border-mauve/10 pt-3">
              {isAdmin ? (
                <Link
                  href={`/${lang}/admin`}
                  onClick={() => setOpen(false)}
                  className="group flex flex-col"
                >
                  <span className="block text-sm font-semibold text-ink group-hover:text-mauve-dark">
                    🛡️ {user.firstName || "Admin"}
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
                    👤 {dict.nav.greeting.replace("{name}", user.firstName)}
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
