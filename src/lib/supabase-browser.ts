import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;
let configPromise: Promise<{ url: string; anonKey: string }> | undefined;

async function getSupabaseConfig() {
  if (!configPromise) {
    configPromise = fetch("/api/config/supabase", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.url || !data.anonKey) {
          throw new Error(data.error || "Supabase Auth is not configured.");
        }
        return data as { url: string; anonKey: string };
      })
      .catch(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !anonKey) throw new Error("Supabase Auth is not configured.");
        return { url, anonKey };
      });
  }
  return configPromise;
}

export async function getSupabaseBrowser() {
  if (client) return client;

  const { url, anonKey } = await getSupabaseConfig();

  client = createBrowserClient(url, anonKey);
  return client;
}
