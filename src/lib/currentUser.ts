import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth";
import { getUserById, type UserProfile } from "@/lib/userService";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs/server";

export type CurrentUser = UserProfile | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const userId = verifySessionCookieValue(raw);

    if (userId) {
      const user = await getUserById(userId);
      if (user) {
        if (user.role === "admin" || user.email?.toLowerCase() === "arunkumar17012006@gmail.com") {
          return { ...user, role: "admin", isAdmin: true };
        }
        if (user.role === "affiliate") {
          return { ...user, isAdmin: false };
        }
        return user;
      }
    }
  } catch (err) {
    console.error("[getCurrentUser session error]:", err);
  }

  // Fallback to Clerk authenticated user
  try {
    const clerkUser = await clerkCurrentUser();
    if (clerkUser) {
      const email = clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase();
      if (email) {
        const dbUser = await getUserById(email);
        if (dbUser) {
          if (dbUser.role === "admin" || email === "arunkumar17012006@gmail.com") {
            return { ...dbUser, role: "admin", isAdmin: true };
          }
          return dbUser;
        }

        const isAdmin = email === "arunkumar17012006@gmail.com" || clerkUser.publicMetadata?.role === "admin";
        return {
          id: clerkUser.id,
          email,
          firstName: clerkUser.firstName || "Admin",
          lastName: clerkUser.lastName || "User",
          phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
          country: "Germany",
          role: isAdmin ? "admin" : "customer",
          isAdmin,
        };
      }
    }
  } catch (err) {
    // Clerk not configured or not inside a Clerk request context
  }

  return null;
}

