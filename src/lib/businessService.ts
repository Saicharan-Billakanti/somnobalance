import { getDB } from "@/lib/db";

export type BusinessApp = {
  id: string; userId?: string | null; companyName: string; contactName: string; email: string;
  phone?: string | null; businessType: string; vatId?: string | null; address?: string | null;
  city?: string | null; country?: string | null; estimatedVolume?: string | null;
  status: "pending" | "approved" | "rejected"; discountRate: number; notes?: string | null;
  createdAt: string; updatedAt: string; messages?: BusinessMsg[]; products?: BusinessProduct[];
};
export type BusinessMsg = { id: string; applicationId: string; senderRole: "admin" | "business"; senderName: string; message: string; createdAt: string; read: boolean };
export type BusinessProduct = { id: string; applicationId: string; name: string; description?: string | null; image: string; category: string; retailPrice: number; discountRate: number; maxQuantity: number; inStock: boolean; wholesalePrice?: number };

async function withRelations(row: BusinessApp | null): Promise<BusinessApp | null> {
  if (!row) return null;
  const db = getDB();
  const [messages, products] = await Promise.all([
    db.prepare('SELECT * FROM "BusinessMessage" WHERE applicationId = ? ORDER BY createdAt').bind(row.id).all<BusinessMsg>(),
    db.prepare('SELECT * FROM "BusinessProduct" WHERE applicationId = ? ORDER BY createdAt').bind(row.id).all<BusinessProduct>(),
  ]);
  return { ...row, messages: messages.results.map((m) => ({ ...m, read: Boolean(m.read) })), products: products.results.map((p) => ({ ...p, inStock: Boolean(p.inStock) })) };
}

export async function submitBusinessApplication(payload: { userId: string; companyName: string; contactName: string; email: string; phone?: string; businessType: string; vatId?: string; address?: string; city?: string; country?: string; estimatedVolume?: string; notes?: string }): Promise<BusinessApp> {
  const db = getDB(); const email = payload.email.trim().toLowerCase(); const now = new Date().toISOString();
  const existing = await db.prepare('SELECT id, userId FROM "BusinessApplication" WHERE email = ?').bind(email).first<{ id: string; userId: string | null }>();
  const id = existing?.id || `biz_${crypto.randomUUID()}`;
  await db.prepare(`INSERT INTO "BusinessApplication" (id,userId,companyName,contactName,email,phone,businessType,vatId,address,city,country,estimatedVolume,notes,status,discountRate,createdAt,updatedAt)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',20,?,?) ON CONFLICT(email) DO UPDATE SET userId=COALESCE(excluded.userId,"BusinessApplication".userId),companyName=excluded.companyName,contactName=excluded.contactName,phone=excluded.phone,businessType=excluded.businessType,vatId=excluded.vatId,address=excluded.address,city=excluded.city,country=excluded.country,estimatedVolume=excluded.estimatedVolume,notes=excluded.notes,updatedAt=excluded.updatedAt`)
    .bind(id,payload.userId||existing?.userId||null,payload.companyName,payload.contactName,email,payload.phone||null,payload.businessType||"Wellness & Hospitality",payload.vatId||null,payload.address||null,payload.city||null,payload.country||"Germany",payload.estimatedVolume||null,payload.notes||null,now,now).run();
  const result = await getBusinessApplicationById(id);
  if (!result) throw new Error("Business application could not be loaded after saving.");
  if (payload.notes) await sendBusinessMessage(id,"business",payload.contactName,payload.notes);
  return (await getBusinessApplicationById(id))!;
}
export async function getBusinessApplicationById(id: string) { return withRelations(await getDB().prepare('SELECT * FROM "BusinessApplication" WHERE id = ?').bind(id).first<BusinessApp>()); }
export async function getBusinessApplicationByEmail(email: string) { if (!email) return null; return withRelations(await getDB().prepare('SELECT * FROM "BusinessApplication" WHERE email = ?').bind(email.trim().toLowerCase()).first<BusinessApp>()); }
export async function getAllBusinessApplications() {
  const rows = await getDB().prepare('SELECT * FROM "BusinessApplication" ORDER BY createdAt DESC').all<BusinessApp>();
  return Promise.all(rows.results.map(withRelations)).then((items) => items.filter((item): item is BusinessApp => Boolean(item)));
}
export async function createBusinessProduct(payload: { applicationId: string; name: string; description?: string; image?: string; category?: string; retailPrice: number; discountRate: number; maxQuantity?: number }) {
  const now = new Date().toISOString(); const id = `bizprod_${crypto.randomUUID()}`;
  await getDB().prepare('INSERT INTO "BusinessProduct" (id,applicationId,name,description,image,category,retailPrice,discountRate,maxQuantity,inStock,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,1,?,?)').bind(id,payload.applicationId,payload.name.trim(),payload.description?.trim()||null,payload.image||"/products/somnobalance-roll-on.webp",payload.category?.trim()||"Business",Number(payload.retailPrice),Math.max(0,Math.min(100,Number(payload.discountRate))),Math.max(1,Number(payload.maxQuantity||1000)),now,now).run();
  return getDB().prepare('SELECT * FROM "BusinessProduct" WHERE id = ?').bind(id).first<BusinessProduct>();
}
export async function deleteBusinessProduct(id: string) { await getDB().prepare('DELETE FROM "BusinessProduct" WHERE id = ?').bind(id).run(); return { success: true }; }
export async function addCatalogProductToBusiness(payload: { applicationId: string; product: { name: string; description?: string; image?: string; category?: string; price?: number }; discountRate: number }) {
  const found = await getDB().prepare('SELECT id FROM "BusinessProduct" WHERE applicationId = ? AND name = ?').bind(payload.applicationId,payload.product.name).first<{id:string}>();
  if (found) return { id: found.id, alreadyAssigned: true };
  return createBusinessProduct({ applicationId: payload.applicationId,name: payload.product.name,description: payload.product.description,image: payload.product.image,category: payload.product.category,retailPrice: Number(payload.product.price||0),discountRate: payload.discountRate });
}
export async function updateBusinessAppStatus(applicationId: string, status: "approved" | "rejected" | "pending", discountRate?: number) {
  await getDB().prepare('UPDATE "BusinessApplication" SET status = ?, discountRate = COALESCE(?, discountRate), updatedAt = ? WHERE id = ?').bind(status,discountRate??null,new Date().toISOString(),applicationId).run();
  const row = await getBusinessApplicationById(applicationId); if (!row) throw new Error("Business application was not found."); return row;
}
export async function sendBusinessMessage(applicationId: string, senderRole: "admin" | "business", senderName: string, message: string): Promise<BusinessMsg> {
  const record = { id: `msg_${crypto.randomUUID()}`, applicationId, senderRole, senderName, message, createdAt: new Date().toISOString(), read: false };
  await getDB().prepare('INSERT INTO "BusinessMessage" (id,applicationId,senderRole,senderName,message,createdAt,read) VALUES (?,?,?,?,?,?,0)').bind(record.id,applicationId,senderRole,senderName,message,record.createdAt).run(); return record;
}
