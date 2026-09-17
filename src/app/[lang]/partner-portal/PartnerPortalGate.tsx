"use client";

// Frontend-only auth gate: requires the visitor to already be logged in via
// the site's existing auth (useAuth()). The spec's real rule — "only users
// with an active affiliate record can access the Partner Portal" — is NOT
// implemented here since there's no affiliate-record concept in the auth
// system yet; that check is backend work. This only blocks fully logged-out
// visitors from seeing the portal shell at all.
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { PortalShell } from "@/components/partner-portal/PortalShell";
import type { Locale } from "@/i18n/config";

export function PartnerPortalGate({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-ink/50 sm:px-6">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-ink">Please log in</h1>
        <p className="mt-3 text-ink/70">
          The Partner Portal is only available to logged-in affiliates.
        </p>
        <Link
          href={`/${lang}/login`}
          className="mt-6 inline-flex rounded-full bg-mauve px-6 py-3 text-sm text-white hover:bg-mauve-dark"
        >
          Log in
        </Link>
      </div>
    );
  }

  return <PortalShell lang={lang}>{children}</PortalShell>;
}
