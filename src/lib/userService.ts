import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { getAffiliateByEmail } from "@/lib/affiliateService";
import { getBusinessApplicationByEmail } from "@/lib/businessService";

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  role?: "customer" | "affiliate" | "business" | "admin";
  isAffiliate?: boolean;
  isBusiness?: boolean;
  isAdmin?: boolean;
};

function requireDatabase() {
  if (!supabaseConfigured()) throw new Error("Database is not configured.");
  return getSupabase();
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  if (!supabaseConfigured() || !userId) return null;

  const supabase = getSupabase();
  let { data: user, error } = await supabase
    .from("User")
    .select("id, email, firstName, lastName, phone, street, postalCode, city, country, role")
    .eq("id", userId)
    .maybeSingle();

  if (!user && !error && userId.includes("@")) {
    const result = await supabase
      .from("User")
      .select("id, email, firstName, lastName, phone, street, postalCode, city, country, role")
      .eq("email", userId.trim().toLowerCase())
      .maybeSingle();
    user = result.data;
    error = result.error;
  }

  if (error) throw new Error(`Failed to load user: ${error.message}`);
  if (!user) return null;

  const [affiliate, businessApp] = await Promise.all([
    getAffiliateByEmail(user.email),
    getBusinessApplicationByEmail(user.email),
  ]);
  const isAffiliate = Boolean(affiliate && ["active", "pending"].includes(affiliate.status));
  const isBusiness = Boolean(businessApp);
  const isAdmin = user.role === "admin";
  const role = isAdmin ? "admin" : isBusiness ? "business" : isAffiliate ? "affiliate" : "customer";

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || "",
    street: user.street || "",
    postalCode: user.postalCode || "",
    city: user.city || "",
    country: user.country || "Germany",
    role,
    isAffiliate,
    isBusiness,
    isAdmin,
  };
}

export async function getUserByPhone(phone: string): Promise<UserProfile | null> {
  if (!supabaseConfigured() || !phone) return null;
  const { data, error } = await getSupabase()
    .from("User")
    .select("id")
    .eq("phone", phone.trim())
    .maybeSingle();
  if (error) throw new Error(`Failed to load user: ${error.message}`);
  return data ? getUserById(data.id) : null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await requireDatabase()
    .from("User")
    .update({
      firstName: updates.firstName,
      lastName: updates.lastName,
      phone: updates.phone,
      street: updates.street,
      postalCode: updates.postalCode,
      city: updates.city,
      country: updates.country,
    })
    .eq("id", userId)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`Failed to update user profile: ${error.message}`);
  return data ? getUserById(userId) : null;
}

export async function getUserOrders(userEmail: string): Promise<any[]> {
  if (!userEmail || !supabaseConfigured()) return [];
  const { data, error } = await getSupabase()
    .from("Order")
    .select("*, items:OrderItem(*)")
    .ilike("email", userEmail.trim().toLowerCase())
    .order("createdAt", { ascending: false });
  if (error) throw new Error(`Failed to load user orders: ${error.message}`);
  return data || [];
}

export async function getOrderById(orderId: string): Promise<any | null> {
  if (!supabaseConfigured()) return null;
  const { data, error } = await getSupabase()
    .from("Order")
    .select("*, items:OrderItem(*)")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error(`Failed to load order: ${error.message}`);
  return data;
}

export async function getAllOrders(): Promise<any[]> {
  if (!supabaseConfigured()) return [];
  const { data, error } = await getSupabase()
    .from("Order")
    .select("*, items:OrderItem(*)")
    .order("createdAt", { ascending: false });
  if (error) throw new Error(`Failed to load orders: ${error.message}`);
  return data || [];
}

export async function updateOrderStatus(orderId: string, updates: Record<string, any>): Promise<any> {
  const { data, error } = await requireDatabase()
    .from("Order")
    .update(updates)
    .eq("id", orderId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Failed to update order: ${error.message}`);
  if (!data) throw new Error("Order was not found.");
  return data;
}
