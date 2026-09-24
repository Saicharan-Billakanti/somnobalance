"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";

const NAV_ITEMS = [
  { key: "", en: "Overview", de: "Übersicht" },
  { key: "referral-tools", en: "Referral Tools", de: "Empfehlungs-Tools" },
  { key: "commissions", en: "Commissions", de: "Provisionen" },
  { key: "payouts", en: "Payouts", de: "Auszahlungen" },
  { key: "payment-settings", en: "Payment Settings", de: "Zahlungseinstellungen" },
  { key: "messages", en: "Messages", de: "Nachrichten" },
  { key: "profile", en: "Profile", de: "Profil" },
  { key: "help", en: "Help", de: "Hilfe" },
];

export function PortalShell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const [mobileOpen, setMobileOpen] = useState(false);
  const base = `/${lang}/partner-portal`;

  const isActive = (key: string) => {
    const href = key ? `${base}/${key}` : base;
    return pathname === href;
  };

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-6 px-2">
            <div className="text-xs uppercase tracking-[0.2em] text-teal-dark">{tx("Partner Portal", "Partner-Portal")}</div>
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const href = item.key ? `${base}/${item.key}` : base;
              const active = isActive(item.key);
              return (
                <Link
                  key={item.key}
                  href={href}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active ? "bg-mauve text-white" : "text-ink/70 hover:bg-sand"
                  }`}
                >
                  {tx(item.en, item.de)}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile collapsible menu */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mauve/10 bg-offwhite/95 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink"
        >
          <span>{tx("Menu", "Menü")}</span>
          <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
        </button>
        {mobileOpen && (
          <nav className="grid grid-cols-2 gap-1 border-t border-mauve/10 p-3">
            {NAV_ITEMS.map((item) => {
              const href = item.key ? `${base}/${item.key}` : base;
              const active = isActive(item.key);
              return (
                <Link
                  key={item.key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-center text-sm ${
                    active ? "bg-mauve text-white" : "bg-sand/60 text-ink/70"
                  }`}
                >
                  {tx(item.en, item.de)}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
