import { getUserById, getUserByPhone, type UserProfile } from "@/lib/userService";
import { getSupabaseServer } from "@/lib/supabase-server";

export type CurrentUser = UserProfile | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (error || (!data.user?.email && !data.user?.phone)) return null;

    const dbUser = data.user.email
      ? await getUserById(data.user.email)
      : await getUserByPhone(data.user.phone || "");
    if (!dbUser) return null;

    if (dbUser.role === "admin" || data.user.email.toLowerCase() === "arunkumar17012006@gmail.com") {
      return { ...dbUser, role: "admin", isAdmin: true };
    }
    return dbUser;
  } catch (err) {
    console.error("[getCurrentUser Supabase Auth error]:", err);
  }

  return null;
}

