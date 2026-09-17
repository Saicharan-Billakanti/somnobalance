import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { products as catalogProducts } from "@/lib/products";

export type StoreSettings = {
  vatRateStandard: number;
  vatRateReduced: number;
  pricesIncludeTax: boolean;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  deliveryCourier: string;
  estimatedDeliveryDays: string;
};

export type StaffRole = "super_admin" | "store_manager" | "affiliate_manager" | "business_manager" | "support_manager";
export type StaffAccount = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  roleTitle: string;
  department?: string;
  status: "active" | "suspended";
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
};

export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  super_admin: ["analytics:read", "catalog:manage", "settings:manage", "business:manage", "affiliates:manage", "payouts:disburse", "orders:manage", "refunds:approve", "staff:manage"],
  store_manager: ["catalog:manage", "pricing:update", "settings:tax_shipping", "orders:view", "inventory:manage", "analytics:sales"],
  affiliate_manager: ["affiliates:manage", "coupons:create", "commissions:view", "payouts:disburse", "analytics:affiliate"],
  business_manager: ["business:manage", "discounts:assign", "messaging:reply", "applications:review", "analytics:business"],
  support_manager: ["orders:manage", "tracking:update", "returns:review", "refunds:approve", "messages:reply"],
};

function database() {
  if (!supabaseConfigured()) throw new Error("Database is not configured.");
  return getSupabase();
}

function formatSettings(data: any): StoreSettings {
  return {
    vatRateStandard: Number(data.vatRateStandard),
    vatRateReduced: Number(data.vatRateReduced),
    pricesIncludeTax: Boolean(data.pricesIncludeTax),
    shippingFlatRate: Number(data.shippingFlatRate),
    freeShippingThreshold: Number(data.freeShippingThreshold),
    deliveryCourier: data.deliveryCourier,
    estimatedDeliveryDays: data.estimatedDeliveryDays,
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await database().from("StoreSetting").select("*").eq("id", "default").maybeSingle();
  if (error) throw new Error(`Failed to load store settings: ${error.message}`);
  if (!data) throw new Error('Store settings are missing. Run the supplied Supabase SQL script.');
  return formatSettings(data);
}

export async function updateStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
  const { data, error } = await database()
    .from("StoreSetting")
    .upsert({ id: "default", ...settings, updatedAt: new Date().toISOString() })
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to persist store settings: ${error?.message || "no row returned"}`);
  return formatSettings(data);
}

export async function getCombinedProducts(): Promise<any[]> {
  let customProducts: any[] = [];
  if (supabaseConfigured()) {
    const { data, error } = await getSupabase().from("CustomProduct").select("*").order("createdAt", { ascending: false });
    if (error) throw new Error(`Failed to load custom products: ${error.message}`);
    customProducts = data || [];
  }
  return [...catalogProducts, ...customProducts.map((product) => ({ ...product, isCustom: true }))];
}

export async function createCustomProduct(payload: {
  name: string; slug?: string; category: string; price: number; tagline: string; description: string;
  image?: string; phase?: string; details?: string[]; ingredients?: string; shippingIncluded?: boolean;
  returnPeriodDays?: number; refundPolicy?: string; returnEligible?: boolean; refundRules?: string; maxRetailQuantity?: number;
}) {
  const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const product = {
    id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, slug, name: payload.name,
    category: payload.category || "Ritual", price: Number(payload.price), tagline: payload.tagline || "", description: payload.description || "",
    details: payload.details || [], ingredients: payload.ingredients || "", image: payload.image || "/products/somnobalance-roll-on.jpg",
    phase: payload.phase || "REGULATE", shippingIncluded: Boolean(payload.shippingIncluded), returnPeriodDays: Number(payload.returnPeriodDays ?? 30),
    refundPolicy: payload.refundPolicy || null, returnEligible: payload.returnEligible !== false, refundRules: payload.refundRules || null,
    maxRetailQuantity: Number(payload.maxRetailQuantity ?? 10), inStock: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  const { data, error } = await database().from("CustomProduct").insert(product).select("*").single();
  if (error || !data) throw new Error(`Failed to save custom product: ${error?.message || "no row returned"}`);
  return data;
}

export async function deleteCustomProduct(id: string) {
  const { error } = await database().from("CustomProduct").delete().or(`id.eq.${id},slug.eq.${id}`);
  if (error) throw new Error(`Failed to delete custom product: ${error.message}`);
  return { success: true };
}

export async function getStaffAccounts(): Promise<StaffAccount[]> {
  const { data, error } = await database().from("StaffAccount").select("*").order("createdAt", { ascending: true });
  if (error) throw new Error(`Failed to load staff accounts: ${error.message}`);
  return (data || []) as StaffAccount[];
}

export async function createStaffAccount(payload: { name: string; email: string; role: StaffRole; roleTitle?: string; department?: string }): Promise<StaffAccount> {
  const roleTitle = payload.roleTitle?.trim() || payload.role.replace(/_/g, " ");
  const record = {
    id: `staff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: payload.name.trim(), email: payload.email.toLowerCase().trim(), role: payload.role, roleTitle,
    department: payload.department?.trim() || null, status: "active", permissions: ROLE_PERMISSIONS[payload.role], createdAt: new Date().toISOString(),
  };
  const { data, error } = await database().from("StaffAccount").insert(record).select("*").single();
  if (error || !data) throw new Error(`Failed to save staff account: ${error?.message || "no row returned"}`);
  return data as StaffAccount;
}

export async function updateStaffStatus(id: string, status: "active" | "suspended"): Promise<StaffAccount> {
  const { data, error } = await database().from("StaffAccount").update({ status }).eq("id", id).select("*").maybeSingle();
  if (error || !data) throw new Error(`Failed to update staff account status: ${error?.message || "staff account not found"}`);
  return data as StaffAccount;
}

export async function deleteStaffAccount(id: string): Promise<{ success: boolean }> {
  const { error } = await database().from("StaffAccount").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete staff account: ${error.message}`);
  return { success: true };
}
