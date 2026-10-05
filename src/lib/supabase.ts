import { createClient, SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as { supabase?: SupabaseClient };
const globalForOtpSupabase = globalThis as unknown as { otpSupabase?: SupabaseClient };

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// The OTP project is usually the same Supabase project as the main
// database — SUPABASE_OTP_URL only needs to be set when it's a genuinely
// separate project. Falls back to SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
// so a shared-project setup only needs the OTP-specific key added.
function getOtpSupabaseUrl() {
  return process.env.SUPABASE_OTP_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function otpSupabaseConfigured() {
  return Boolean(
    getOtpSupabaseUrl() && (process.env.SUPABASE_OTP_SERVICE_ROLE_KEY || process.env.SUPABASE_OTP_ANON_KEY)
  );
}

// Lazy on purpose, same reasoning as the old getPrisma(): constructing the
// client must never happen just from importing this module in an
// environment (like a deploy without these secrets set) where it isn't
// configured — only call getSupabase() from inside a `supabaseConfigured()`
// branch. Uses the REST API over plain HTTPS (fetch), which is why this
// works fine on Cloudflare Workers where Prisma's WASM query engine did not.
export function getSupabase(): SupabaseClient {
  if (globalForSupabase.supabase) return globalForSupabase.supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("getSupabase() called without SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY set");
  }

  const client = createClient(url, key, {
    auth: { persistSession: false },
  });

  if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = client;
  return client;
}

export function getOtpSupabase(): SupabaseClient {
  if (globalForOtpSupabase.otpSupabase) return globalForOtpSupabase.otpSupabase;

  const url = getOtpSupabaseUrl();
  const key = process.env.SUPABASE_OTP_SERVICE_ROLE_KEY || process.env.SUPABASE_OTP_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "getOtpSupabase() called without a Supabase URL (SUPABASE_OTP_URL, SUPABASE_URL, or NEXT_PUBLIC_SUPABASE_URL) and either SUPABASE_OTP_SERVICE_ROLE_KEY or SUPABASE_OTP_ANON_KEY set"
    );
  }

  const client = createClient(url, key, {
    auth: { persistSession: false },
  });

  if (process.env.NODE_ENV !== "production") globalForOtpSupabase.otpSupabase = client;
  return client;
}
