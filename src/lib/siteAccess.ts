import { createHash, timingSafeEqual } from "node:crypto";

// This runs before the app and the static asset handler in Cloudflare.
export function checkSiteAccess(request: Request, env: Record<string, unknown>): Response | null {
  const password = typeof env.SITE_ACCESS_PASSWORD === "string" ? env.SITE_ACCESS_PASSWORD : "";
  if (!password && env.SITE_ACCESS_ENABLED !== "true") return null;

  // Stripe authenticates these requests using its webhook signature.
  if (request.method === "POST" && new URL(request.url).pathname === "/api/webhooks/stripe") return null;

  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Vary": "Authorization",
  };
  if (!password) return new Response("Website access is temporarily unavailable.", { status: 503, headers });

  const expected = `Basic ${Buffer.from(`somnobalance:${password}`, "utf8").toString("base64")}`;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (timingSafeEqual(digest(request.headers.get("authorization") || ""), digest(expected))) return null;

  return new Response("Please enter the website access username and password.", {
    status: 401,
    headers: { ...headers, "WWW-Authenticate": 'Basic realm="SomnoBalance Private Preview", charset="UTF-8"' },
  });
}
