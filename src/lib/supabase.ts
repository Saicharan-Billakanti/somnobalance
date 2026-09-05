import { createClient, SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as { supabase?: SupabaseClient };

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
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
