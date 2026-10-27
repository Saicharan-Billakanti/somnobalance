import { NextResponse } from "next/server";
import { dbConfigured, getDB } from "@/lib/db";
import { stripeConfigured, getStripe } from "@/lib/stripe";

async function checkD1() {
  if (!dbConfigured()) return { configured: false, connected: false };
  try {
    await getDB().prepare("SELECT 1").first();
    return { configured: true, connected: true };
  } catch (err) {
    return { configured: true, connected: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

async function checkStripe() {
  if (!stripeConfigured()) return { configured: false, connected: false };
  try {
    await getStripe().balance.retrieve();
    return { configured: true, connected: true };
  } catch (err) {
    return { configured: true, connected: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

export async function GET() {
  const [d1, stripe] = await Promise.all([checkD1(), checkStripe()]);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    d1,
    stripe,
  });
}
