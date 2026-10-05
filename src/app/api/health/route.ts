import { NextResponse } from "next/server";
import { getSupabase, supabaseConfigured, otpSupabaseConfigured } from "@/lib/supabase";
import { stripeConfigured, getStripe } from "@/lib/stripe";

async function checkSupabase() {
  if (!supabaseConfigured()) return { configured: false, connected: false };
  try {
    const { error } = await getSupabase().from("User").select("id", { count: "exact", head: true });
    return { configured: true, connected: !error, error: error?.message };
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
  const [supabase, stripe] = await Promise.all([checkSupabase(), checkStripe()]);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    supabase,
    supabaseOtp: { configured: otpSupabaseConfigured() },
    stripe,
  });
}
