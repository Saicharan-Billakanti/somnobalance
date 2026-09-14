import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export type BusinessApp = {
  id: string;
  userId?: string | null;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  businessType: string;
  vatId?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  estimatedVolume?: string | null;
  status: "pending" | "approved" | "rejected";
  discountRate: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: BusinessMsg[];
};

export type BusinessMsg = {
  id: string;
  applicationId: string;
  senderRole: "admin" | "business";
  senderName: string;
  message: string;
  createdAt: string;
  read: boolean;
};

function database() {
  if (!supabaseConfigured()) throw new Error("Database is not configured.");
  return getSupabase();
}

function throwIfError(error: { message?: string } | null, action: string) {
  if (error) throw new Error(`${action}: ${error.message || "unknown database error"}`);
}

export async function submitBusinessApplication(payload: {
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  businessType: string;
  vatId?: string;
  address?: string;
  city?: string;
  country?: string;
  estimatedVolume?: string;
  notes?: string;
}): Promise<BusinessApp> {
  const supabase = database();
  const email = payload.email.trim().toLowerCase();
  const { data: existing, error: existingError } = await supabase
    .from("BusinessApplication")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  throwIfError(existingError, "Failed to look up business application");

  const now = new Date().toISOString();
  const values = {
    userId: payload.userId || null,
    companyName: payload.companyName,
    contactName: payload.contactName,
    email,
    phone: payload.phone || null,
    businessType: payload.businessType || "Wellness & Hospitality",
    vatId: payload.vatId || null,
    address: payload.address || null,
    city: payload.city || null,
    country: payload.country || "Germany",
    estimatedVolume: payload.estimatedVolume || null,
    notes: payload.notes || null,
    updatedAt: now,
  };

  let application: BusinessApp | null;
  if (existing) {
    const result = await supabase
      .from("BusinessApplication")
      .update(values)
      .eq("id", existing.id)
      .select("*")
      .single();
    throwIfError(result.error, "Failed to update business application");
    application = result.data;
  } else {
    const result = await supabase
      .from("BusinessApplication")
      .insert({ id: `biz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, ...values, status: "pending", discountRate: 20 })
      .select("*")
      .single();
    throwIfError(result.error, "Failed to insert business application");
    application = result.data;
  }
  if (!application) throw new Error("Business application was not returned after saving.");

  if (payload.notes) {
    await sendBusinessMessage(application.id, "business", payload.contactName, payload.notes);
  }
  const savedApplication = await getBusinessApplicationById(application.id);
  if (!savedApplication) throw new Error("Business application disappeared after saving.");
  return savedApplication;
}

export async function getBusinessApplicationById(id: string): Promise<BusinessApp | null> {
  if (!supabaseConfigured()) return null;
  const { data, error } = await getSupabase()
    .from("BusinessApplication")
    .select("*, messages:BusinessMessage(*)")
    .eq("id", id)
    .maybeSingle();
  throwIfError(error, "Failed to load business application");
  return data;
}

export async function getBusinessApplicationByEmail(email: string): Promise<BusinessApp | null> {
  if (!supabaseConfigured() || !email) return null;
  const { data, error } = await getSupabase()
    .from("BusinessApplication")
    .select("*, messages:BusinessMessage(*)")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  throwIfError(error, "Failed to load business application");
  return data;
}

export async function getAllBusinessApplications(): Promise<BusinessApp[]> {
  if (!supabaseConfigured()) return [];
  const { data, error } = await getSupabase()
    .from("BusinessApplication")
    .select("*, messages:BusinessMessage(*)")
    .order("createdAt", { ascending: false });
  throwIfError(error, "Failed to load business applications");
  return data || [];
}

export async function updateBusinessAppStatus(
  applicationId: string,
  status: "approved" | "rejected" | "pending",
  discountRate?: number
) {
  const values: Record<string, unknown> = { status, updatedAt: new Date().toISOString() };
  if (discountRate !== undefined) values.discountRate = discountRate;
  const { data, error } = await database()
    .from("BusinessApplication")
    .update(values)
    .eq("id", applicationId)
    .select("*")
    .maybeSingle();
  throwIfError(error, "Failed to update business application status");
  if (!data) throw new Error("Business application was not found.");
  return data;
}

export async function sendBusinessMessage(
  applicationId: string,
  senderRole: "admin" | "business",
  senderName: string,
  message: string
): Promise<BusinessMsg> {
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    applicationId,
    senderRole,
    senderName,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const { data, error } = await database().from("BusinessMessage").insert(newMessage).select("*").single();
  throwIfError(error, "Failed to save business message");
  if (!data) throw new Error("Business message was not returned after saving.");
  return data;
}
