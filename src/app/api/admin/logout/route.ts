import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url));
  res.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
