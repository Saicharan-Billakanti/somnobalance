import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "@/i18n/config";
import { updateSupabaseSession } from "@/lib/supabase-middleware";

const LOCALE_COOKIE = "NEXT_LOCALE";

function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (preferred && isLocale(preferred)) return preferred;
  }

  return defaultLocale;
}

function localeProxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) return undefined;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return undefined;

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  return response;
}

// Optional site-wide password (HTTP Basic auth). Set the SITE_PASSWORD secret
// to lock the whole site — pages, API and images — behind a browser login;
// leave it unset (local dev, or once the site goes public) to keep it open.
// Any user name is accepted, only the password is checked. Payment-provider
// webhooks must stay reachable, so /api/webhooks is exempt (they verify their
// own signature).
function sitePasswordGate(request: NextRequest): NextResponse | undefined {
  const password = process.env.SITE_PASSWORD;
  if (!password) return undefined;
  if (request.nextUrl.pathname.startsWith("/api/webhooks")) return undefined;

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (timingSafeEqual(given, password)) return undefined;
    } catch {}
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SomnoBalance", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

// Static files (images, fonts, video) skip locale and session handling.
function isStaticAsset(pathname: string): boolean {
  return /\.[a-z0-9]+$/i.test(pathname);
}

// Next.js 16 renamed middleware.ts → proxy.ts and the export to `proxy`
export async function proxy(request: NextRequest) {
  const blocked = sitePasswordGate(request);
  if (blocked) return blocked;
  if (isStaticAsset(request.nextUrl.pathname)) return NextResponse.next();

  const redirect = localeProxy(request);
  if (redirect) return redirect;
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    // everything except Next's own build assets, so images and the API are gated too
    "/((?!_next/static|_next/image).*)",
  ],
};
