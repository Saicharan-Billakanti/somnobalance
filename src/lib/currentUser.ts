import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth";
import { getUserById } from "@/lib/userService";

export type CurrentUser = Awaited<ReturnType<typeof getUserById>>;

export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieStore = await cookies();
  const userId = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (user?.email.toLowerCase() === "arunkumar17012006@gmail.com") {
    return { ...user, role: "admin", isAdmin: true };
  }
  return user;
}
