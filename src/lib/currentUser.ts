import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue, sessionAuthConfigured } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  if (!process.env.DATABASE_URL || !sessionAuthConfigured()) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userId = verifySessionCookieValue(raw);
  if (!userId) return null;

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    return user;
  } catch {
    return null;
  }
}
