import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "@/i18n/config";

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

// Optional site-wide password. Set the SITE_PASSWORD secret to lock the site;
// leave it unset to keep the site open. The lock is asked for on EVERY page
// load (refresh, new tab, typed URL): a correct password only unlocks the one
// document request that follows it, via a signed cookie that lives for a few
// seconds and is cleared as soon as the page is served. In-site navigation
// (client-side route changes, API calls, assets) is not interrupted.
// Payment-provider webhooks stay reachable (they verify their own signature).
const UNLOCK_COOKIE = "sb_unlock";
const UNLOCK_PATH = "/__unlock";
const UNLOCK_TTL_MS = 30_000;

function timingSafeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

async function sign(password: string, value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hasValidUnlock(request: NextRequest, password: string): Promise<boolean> {
  const raw = request.cookies.get(UNLOCK_COOKIE)?.value;
  if (!raw) return false;
  const [ts, mac] = raw.split(".");
  const issued = Number(ts);
  if (!mac || !Number.isFinite(issued)) return false;
  if (Date.now() - issued > UNLOCK_TTL_MS || issued > Date.now() + 5_000) return false;
  return timingSafeEqual(mac, await sign(password, ts));
}

// Static files (images, fonts, video) skip locale handling.
function isStaticAsset(pathname: string): boolean {
  return /\.[a-z0-9]+$/i.test(pathname);
}

// A real page load (not a client-side route fetch, API call or asset).
function isDocumentRequest(request: NextRequest): boolean {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/api")) return false;
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (request.headers.get("rsc") || request.headers.get("next-router-prefetch") || searchParams.has("_rsc")) {
    return false;
  }
  const dest = request.headers.get("sec-fetch-dest");
  if (dest) return dest === "document" || dest === "iframe";
  return (request.headers.get("accept") ?? "").includes("text/html");
}

function safeNext(value: string | null | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function lockedPage(next: string, wrong: boolean): NextResponse {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>SomnoBalance</title>
<style>
  html,body{height:100%;margin:0}
  body{display:flex;align-items:center;justify-content:center;background:#f7f2ef;color:#2a2430;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  form{width:min(92vw,360px);background:#fff;border:1px solid #e6dde3;padding:32px 28px;text-align:center}
  h1{font:600 22px/1.2 Georgia,serif;margin:0 0 6px;color:#6d5a7d}
  p{margin:0 0 20px;font-size:14px;color:#6b6272}
  input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #cfc4cc;font-size:16px;margin-bottom:12px}
  button{width:100%;padding:12px;border:0;background:#786786;color:#fff;font-size:15px;cursor:pointer}
  button:hover{background:#625270}
  .err{color:#b3261e;font-size:13px;margin:-4px 0 12px}
</style></head><body>
<form method="post" action="${UNLOCK_PATH}">
  <h1>SomnoBalance</h1>
  <p>This website is password protected.</p>
  ${wrong ? '<div class="err">Incorrect password.</div>' : ""}
  <input type="hidden" name="next" value="${escapeHtml(next)}">
  <input type="password" name="password" placeholder="Password" autocomplete="off" autofocus required>
  <button type="submit">Enter</button>
</form></body></html>`;
  return new NextResponse(html, {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

async function handleUnlockPost(request: NextRequest, password: string): Promise<NextResponse> {
  const form = await request.formData().catch(() => null);
  const given = String(form?.get("password") ?? "");
  const next = safeNext(String(form?.get("next") ?? "/"));
  if (!timingSafeEqual(given, password)) return lockedPage(next, true);

  const ts = String(Date.now());
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(UNLOCK_COOKIE, `${ts}.${await sign(password, ts)}`, {
    maxAge: UNLOCK_TTL_MS / 1000,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  return response;
}

// Next.js 16 renamed middleware.ts → proxy.ts and the export to `proxy`
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const password = process.env.SITE_PASSWORD;
  const gated = Boolean(password) && !pathname.startsWith("/api/webhooks");

  if (gated && pathname === UNLOCK_PATH) {
    if (request.method === "POST") return handleUnlockPost(request, password!);
    return lockedPage("/", false);
  }

  let consumeUnlock = false;
  if (gated && isDocumentRequest(request) && !isStaticAsset(pathname)) {
    if (!(await hasValidUnlock(request, password!))) {
      return lockedPage(pathname + request.nextUrl.search, false);
    }
    consumeUnlock = true;
  }

  if (isStaticAsset(pathname)) return NextResponse.next();

  const redirect = localeProxy(request);
  if (redirect) return redirect; // keep the unlock cookie for the redirected page load

  const response = NextResponse.next();
  if (consumeUnlock) response.cookies.delete(UNLOCK_COOKIE);
  return response;
}

export const config = {
  matcher: [
    // everything except Next's own build assets, so images and the API are gated too
    "/((?!_next/static|_next/image).*)",
  ],
};
