import { getDB, getOrderById as getD1OrderById, getRecentOrders, updateOrderStatus as updateD1OrderStatus } from "@/lib/db";
import type { DbUser } from "@/lib/db";

export type UserProfile = {
  id: string; email: string; firstName: string; lastName: string; phone?: string; street?: string;
  postalCode?: string; city?: string; country?: string;
  role?: "customer" | "affiliate" | "business" | "admin";
  isAffiliate?: boolean; isBusiness?: boolean; isAdmin?: boolean;
};

function userProfile(user: DbUser): UserProfile {
  const role = user.role === "admin" || user.role === "business" || user.role === "affiliate" ? user.role : "customer";
  return {
    id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
    phone: user.phone || "", street: user.street || "", postalCode: user.postalCode || "",
    city: user.city || "", country: user.country || "Germany", role,
    isAffiliate: role === "affiliate", isBusiness: role === "business", isAdmin: role === "admin",
  };
}

const USER_SELECT = `SELECT id, createdAt, email, passwordHash, firstName, lastName, phone, emailVerifiedAt, phoneVerifiedAt,
  street, postalCode, city, country, role FROM "User"`;

export async function getUserById(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;
  const db = getDB();
  const user = await db.prepare(`${USER_SELECT} WHERE id = ?`).bind(userId).first<DbUser>();
  if (user) return userProfile(user);
  return userId.includes("@") ? getUserByEmail(userId) : null;
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  if (!email) return null;
  const user = await getDB().prepare(`${USER_SELECT} WHERE LOWER(email) = LOWER(?)`).bind(email.trim()).first<DbUser>();
  return user ? userProfile(user) : null;
}

export async function getUserByPhone(phone: string): Promise<UserProfile | null> {
  if (!phone) return null;
  const user = await getDB().prepare(`${USER_SELECT} WHERE phone = ?`).bind(phone.trim()).first<DbUser>();
  return user ? userProfile(user) : null;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const fields: Array<[keyof UserProfile, string]> = [
    ["firstName", "firstName"], ["lastName", "lastName"], ["phone", "phone"],
    ["street", "street"], ["postalCode", "postalCode"], ["city", "city"], ["country", "country"],
  ];
  const changed = fields.filter(([key]) => updates[key] !== undefined);
  if (changed.length) {
    const assignments = changed.map(([, column]) => `"${column}" = ?`).join(", ");
    const values = changed.map(([key]) => updates[key] ?? null);
    await getDB().prepare(`UPDATE "User" SET ${assignments} WHERE id = ?`).bind(...values, userId).run();
  }
  return getUserById(userId);
}

export async function getUserOrders(userEmail: string): Promise<any[]> {
  if (!userEmail) return [];
  const db = getDB();
  // Keep unpaid checkout attempts for Stripe webhook reconciliation, but do
  // not present them as completed customer orders.
  const { results: orders } = await db.prepare(`SELECT * FROM "Order" WHERE LOWER(email) = LOWER(?) AND status = 'PAID' ORDER BY createdAt DESC`)
    .bind(userEmail.trim()).all<any>();
  if (!orders.length) return [];
  const ids = orders.map((order: any) => order.id);
  const placeholders = ids.map(() => "?").join(",");
  const { results: items } = await db.prepare(`SELECT * FROM "OrderItem" WHERE orderId IN (${placeholders}) ORDER BY rowid`)
    .bind(...ids).all<any>();
  const byOrder = new Map<string, any[]>();
  for (const item of items) byOrder.set(item.orderId, [...(byOrder.get(item.orderId) || []), item]);
  return orders.map((order: any) => ({ ...order, items: byOrder.get(order.id) || [] }));
}

export async function getOrderById(orderId: string): Promise<any | null> { return getD1OrderById(getDB(), orderId); }
export async function getAllOrders(): Promise<any[]> { return getRecentOrders(getDB(), 100); }
export async function updateOrderStatus(orderId: string, updates: Record<string, any>): Promise<any> {
  const columns: Record<string, string> = { status: "status", returnStatus: "returnStatus", returnReason: "returnReason", returnNote: "returnNote", returnRequestedAt: "returnRequestedAt", returnApprovedAt: "returnApprovedAt", refundStatus: "refundStatus", carrier: "carrier", trackingNumber: "trackingNumber" };
  const entries = Object.entries(updates).filter(([key]) => columns[key]);
  if (!entries.length) throw new Error("No supported order fields were supplied.");
  const assignments = entries.map(([key]) => `"${columns[key]}" = ?`).join(", ");
  const result = await getDB().prepare(`UPDATE "Order" SET ${assignments} WHERE id = ?`).bind(...entries.map(([, value]) => value), orderId).run();
  if (!result.meta?.changes) throw new Error("Order was not found.");
  return getOrderById(orderId);
}
