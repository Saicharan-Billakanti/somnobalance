import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue, sessionAuthConfigured } from "@/lib/auth";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  if (!supabaseConfigured() || !sessionAuthConfigured()) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userId = verifySessionCookieValue(raw);
  if (!userId) return null;

  try {
    const { data, error } = await getSupabase()
      .from("User")
      .select("id, email, firstName, lastName")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}
