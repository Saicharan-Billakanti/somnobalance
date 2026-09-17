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

// Next.js 16 renamed middleware.ts → proxy.ts and the export to `proxy`
export async function proxy(request: NextRequest) {
  const redirect = localeProxy(request);
  if (redirect) return redirect;
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|brand|products|.*\\.(?:png|jpg|jpeg|svg|ico|webp)).*)",
    "/(api|trpc)(.*)",
  ],
};
