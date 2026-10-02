// src/app/api/admin/bcrypt-bench/route.ts
//
// BCRYPT BENCHMARK — ADMIN ONLY
//
// PURPOSE
// -------
// Cloudflare Workers Free has a 10 ms CPU-time limit per request.
// bcryptjs at cost factor 12 typically takes 200–400 ms of CPU time,
// which will exceed the free-tier limit and cause a 1102 error.
//
// This route measures actual CPU time in the deployed Worker environment
// so you can make an informed decision before going live.
//
// SECURITY
// --------
// Protected by the admin session cookie — same as the admin panel.
// Do NOT expose this route publicly. Remove it after benchmarking.
//
// USAGE
// -----
// 1. Deploy to Cloudflare Workers.
// 2. Log in to the admin panel.
// 3. GET /api/admin/bcrypt-bench
// 4. Read the JSON response and check the "recommendation" field.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, adminConfigured, verifySessionCookieValue } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

const TEST_PASSWORD = "BenchmarkPassword123!";
const COST_FACTORS = [10, 11, 12] as const;

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySessionCookieValue(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, { hashMs: number; verifyMs: number; withinFreeLimit: boolean }> = {};

  for (const cost of COST_FACTORS) {
    const hashStart = Date.now();
    const hash = await bcrypt.hash(TEST_PASSWORD, cost);
    const hashMs = Date.now() - hashStart;

    const verifyStart = Date.now();
    await bcrypt.compare(TEST_PASSWORD, hash);
    const verifyMs = Date.now() - verifyStart;

    // Workers Free CPU limit is 10 ms. Wall-clock time is higher than CPU
    // time, but if wall-clock already exceeds 10 ms the CPU time certainly
    // does too. This is a conservative indicator only.
    results[`cost_${cost}`] = { hashMs, verifyMs, withinFreeLimit: verifyMs <= 10 };
  }

  const currentCostResult = results["cost_12"];
  const lowestPassingCost = COST_FACTORS.find((c) => results[`cost_${c}`].withinFreeLimit);

  let recommendation: string;
  if (currentCostResult.withinFreeLimit) {
    recommendation = "cost_12 fits within the 10 ms CPU limit. No changes needed.";
  } else if (lowestPassingCost) {
    recommendation =
      `cost_12 exceeds the free-tier CPU limit. cost_${lowestPassingCost} fits, ` +
      `but lowering the cost factor reduces security. ` +
      `Recommended: upgrade to Workers Paid ($5/month) to keep cost_12.`;
  } else {
    recommendation =
      "bcryptjs exceeds the Workers Free CPU limit at all tested cost factors. " +
      "You must either upgrade to Workers Paid or implement a gradual migration " +
      "to Web Crypto PBKDF2 for new registrations while verifying existing bcrypt " +
      "hashes on a separate service. See MIGRATION.md Phase 6 for details.";
  }

  return NextResponse.json({
    note: "Wall-clock time shown. Cloudflare CPU time is typically lower but correlated.",
    workersFreeLimit_ms: 10,
    results,
    recommendation,
  });
}
