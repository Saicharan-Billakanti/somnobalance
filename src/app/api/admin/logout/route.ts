import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { locales, defaultLocale } from "@/i18n/config";

export async function GET(request: Request) {
  const referer = request.headers.get("referer");
  const refererLocale = referer ? new URL(referer).pathname.split("/")[1] : undefined;
  const lang = locales.find((l) => l === refererLocale) ?? defaultLocale;

  const res = NextResponse.redirect(new URL(`/${lang}/admin/login`, request.url));
  res.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
