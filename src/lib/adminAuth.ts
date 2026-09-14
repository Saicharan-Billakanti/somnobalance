import crypto from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue as verifyUserSessionCookie } from "@/lib/auth";
import { getUserById } from "@/lib/userService";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const ADMIN_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function timingSafeStringsEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!input || !secret) return false;
  return timingSafeStringsEqual(input, secret);
}

export function createSessionCookieValue() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD must be configured to create an admin session cookie");
  }

  const expires = Date.now() + SESSION_TTL_MS;
  const sig = crypto.createHmac("sha256", secret).update(String(expires)).digest("hex");
  return `${expires}.${sig}`;
}

export function verifySessionCookieValue(value: string | undefined) {
  if (!value) return false;
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const [expiresStr, sig] = value.split(".");
  if (!expiresStr || !sig) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = crypto.createHmac("sha256", secret).update(expiresStr).digest("hex");
  return timingSafeStringsEqual(sig, expected);
}

/**
 * Verifies access to the Admin Hub and its admin API routes.
 * Affiliate access belongs to the separate Partner Portal, not this surface.
 */
export async function verifyAdminOrPartnerAccess(adminCookieValue?: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    // 1. Check user session first
    const userSessionVal = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const userId = verifyUserSessionCookie(userSessionVal);

    if (userId) {
      const user = await getUserById(userId);
      if (user) {
        const isAdmin = user.role === "admin" || user.email?.toLowerCase() === "arunkumar17012006@gmail.com";
        if (isAdmin) {
          return true;
        }
        // Customers, affiliates, and business users are not administrators.
        return false;
      }
    }

    // 1b. Check Clerk authenticated user
    try {
      const { currentUser: clerkCurrentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await clerkCurrentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase();
        if (email) {
          if (email === "arunkumar17012006@gmail.com" || clerkUser.publicMetadata?.role === "admin") {
            return true;
          }
          const user = await getUserById(email);
          if (user && (user.role === "admin" || email === "arunkumar17012006@gmail.com")) {
            return true;
          }
        }
      }
    } catch {}

    // 2. If no user session, check direct admin session cookie
    const adminVal = adminCookieValue || cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (verifySessionCookieValue(adminVal)) {
      return true;
    }
  } catch (err) {
    console.error("[verifyAdminOrPartnerAccess error]:", err);
  }

  return false;
}
