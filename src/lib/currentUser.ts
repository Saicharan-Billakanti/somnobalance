import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue, sessionAuthConfigured } from "@/lib/auth";
import { getDB, dbConfigured, getUserById } from "@/lib/db";

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  if (!dbConfigured() || !sessionAuthConfigured()) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userId = verifySessionCookieValue(raw);
  if (!userId) return null;

  try {
    const user = await getUserById(getDB(), userId);
    if (!user) return null;
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
  } catch {
    return null;
  }
}
