// src/lib/db.ts
//
// Cloudflare D1 database access layer.
// Uses native D1Database binding — accessed via `import { env } from "cloudflare:workers"`.
// All Supabase imports have been removed.

import { env } from "cloudflare:workers";

// Self-contained types for Cloudflare D1
export interface D1Result<T = unknown> {
  results: T[];
  success?: boolean;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
}

/**
 * Returns the D1 database instance from the Cloudflare Workers environment.
 * Throws clearly if the DB binding is not configured in wrangler.jsonc.
 */
export function getDB(): D1Database {
  const db = (env as Record<string, unknown>).DB as D1Database | undefined;
  if (!db) {
    throw new Error(
      "[db] D1 binding 'DB' is not configured. " +
        "Ensure wrangler.jsonc has a d1_databases entry with binding='DB'."
    );
  }
  return db;
}

/**
 * Returns true if the D1 DB binding is available at runtime.
 */
export function dbConfigured(): boolean {
  try {
    getDB();
    return true;
  } catch {
    return false;
  }
}

/**
 * Enables foreign-key enforcement for this D1 connection.
 * Must be called before any INSERT/DELETE that involves FK relationships.
 */
export async function withFK(db: D1Database): Promise<void> {
  await db.prepare("PRAGMA foreign_keys = ON").run();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type DbUser = {
  id: string;
  createdAt: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
};

export type DbOrder = {
  id: string;
  createdAt: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED";
  paymentMethod: "CARD" | "SEPA" | "PAYPAL" | null;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  stripeSessionId: string | null;
};

export type DbOrderItem = {
  id: string;
  orderId: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type DbOrderWithItems = DbOrder & { items: DbOrderItem[] };

export type DbContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
};

// ─── User queries ─────────────────────────────────────────────────────────────

export async function getUserById(
  db: D1Database,
  id: string
): Promise<DbUser | null> {
  return db
    .prepare(
      `SELECT id, createdAt, email, passwordHash, firstName, lastName, phone, emailVerifiedAt, phoneVerifiedAt
       FROM "User" WHERE id = ?`
    )
    .bind(id)
    .first<DbUser>();
}

export async function getUserByEmail(
  db: D1Database,
  email: string
): Promise<DbUser | null> {
  return db
    .prepare(
      `SELECT id, createdAt, email, passwordHash, firstName, lastName, phone, emailVerifiedAt, phoneVerifiedAt
       FROM "User" WHERE email = ?`
    )
    .bind(email)
    .first<DbUser>();
}

export async function getUserByPhone(
  db: D1Database,
  phone: string
): Promise<DbUser | null> {
  return db
    .prepare(
      `SELECT id, createdAt, email, passwordHash, firstName, lastName, phone, emailVerifiedAt, phoneVerifiedAt
       FROM "User" WHERE phone = ?`
    )
    .bind(phone)
    .first<DbUser>();
}

export async function getUserEmailExists(
  db: D1Database,
  email: string
): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 FROM "User" WHERE email = ? LIMIT 1`)
    .bind(email)
    .first<{ 1: number }>();
  return row !== null;
}

export async function insertUser(
  db: D1Database,
  user: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    emailVerifiedAt?: string | null;
    phoneVerifiedAt?: string | null;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO "User" (id, email, passwordHash, firstName, lastName, phone, emailVerifiedAt, phoneVerifiedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      user.id,
      user.email,
      user.passwordHash,
      user.firstName,
      user.lastName,
      user.phone ?? null,
      user.emailVerifiedAt ?? null,
      user.phoneVerifiedAt ?? null
    )
    .run();
}

export async function updateUserEmailVerified(
  db: D1Database,
  userId: string,
  timestamp = new Date().toISOString()
): Promise<void> {
  await db
    .prepare(`UPDATE "User" SET emailVerifiedAt = ? WHERE id = ?`)
    .bind(timestamp, userId)
    .run();
}

export async function updateUserPhoneVerified(
  db: D1Database,
  userId: string,
  timestamp = new Date().toISOString()
): Promise<void> {
  await db
    .prepare(`UPDATE "User" SET phoneVerifiedAt = ? WHERE id = ?`)
    .bind(timestamp, userId)
    .run();
}

export async function updateUserVerifications(
  db: D1Database,
  userId: string,
  emailVerified = true,
  phoneVerified = true
): Promise<void> {
  const now = new Date().toISOString();
  if (emailVerified && phoneVerified) {
    await db
      .prepare(`UPDATE "User" SET emailVerifiedAt = COALESCE(emailVerifiedAt, ?), phoneVerifiedAt = COALESCE(phoneVerifiedAt, ?) WHERE id = ?`)
      .bind(now, now, userId)
      .run();
  } else if (emailVerified) {
    await db
      .prepare(`UPDATE "User" SET emailVerifiedAt = COALESCE(emailVerifiedAt, ?) WHERE id = ?`)
      .bind(now, userId)
      .run();
  } else if (phoneVerified) {
    await db
      .prepare(`UPDATE "User" SET phoneVerifiedAt = COALESCE(phoneVerifiedAt, ?) WHERE id = ?`)
      .bind(now, userId)
      .run();
  }
}

// ─── Order queries ────────────────────────────────────────────────────────────

export async function insertOrderWithItems(
  db: D1Database,
  order: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    subtotal: number;
    shipping: number;
    total: number;
  },
  items: Array<{ id: string; slug: string; name: string; price: number; qty: number }>
): Promise<void> {
  await withFK(db);

  const orderStmt = db
    .prepare(
      `INSERT INTO "Order"
         (id, firstName, lastName, email, street, postalCode, city, country,
          subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      order.id,
      order.firstName,
      order.lastName,
      order.email,
      order.street,
      order.postalCode,
      order.city,
      order.country,
      order.subtotal,
      order.shipping,
      order.total
    );

  const itemStmts = items.map((item) =>
    db
      .prepare(
        `INSERT INTO "OrderItem" (id, orderId, slug, name, price, qty)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(item.id, order.id, item.slug, item.name, item.price, item.qty)
  );

  // D1 batch executes all statements atomically.
  await db.batch([orderStmt, ...itemStmts]);
}

export async function updateOrderStripeSession(
  db: D1Database,
  orderId: string,
  stripeSessionId: string
): Promise<void> {
  await db
    .prepare(`UPDATE "Order" SET stripeSessionId = ? WHERE id = ?`)
    .bind(stripeSessionId, orderId)
    .run();
}

export async function updateOrderStatus(
  db: D1Database,
  orderId: string,
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED"
): Promise<void> {
  await db
    .prepare(`UPDATE "Order" SET status = ? WHERE id = ?`)
    .bind(status, orderId)
    .run();
}

export async function deleteOrder(db: D1Database, orderId: string): Promise<void> {
  await withFK(db);
  await db.prepare(`DELETE FROM "Order" WHERE id = ?`).bind(orderId).run();
}

export async function getOrderById(
  db: D1Database,
  id: string
): Promise<DbOrderWithItems | null> {
  const order = await db
    .prepare(`SELECT * FROM "Order" WHERE id = ?`)
    .bind(id)
    .first<DbOrder>();
  if (!order) return null;

  const { results: items } = await db
    .prepare(`SELECT * FROM "OrderItem" WHERE orderId = ? ORDER BY rowid`)
    .bind(id)
    .all<DbOrderItem>();

  return { ...order, items };
}

export async function getRecentOrders(
  db: D1Database,
  limit = 50
): Promise<DbOrderWithItems[]> {
  const { results: orders } = await db
    .prepare(
      `SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT ?`
    )
    .bind(limit)
    .all<DbOrder>();

  if (orders.length === 0) return [];

  // Fetch all items for these orders in one query.
  const placeholders = orders.map(() => "?").join(",");
  const ids = orders.map((o) => o.id);
  const { results: allItems } = await db
    .prepare(
      `SELECT * FROM "OrderItem" WHERE orderId IN (${placeholders}) ORDER BY rowid`
    )
    .bind(...ids)
    .all<DbOrderItem>();

  const itemsByOrder = new Map<string, DbOrderItem[]>();
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return orders.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] }));
}

// ─── ContactMessage queries ───────────────────────────────────────────────────

export async function insertContactMessage(
  db: D1Database,
  msg: { id: string; name: string; email: string; topic: string; message: string }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO "ContactMessage" (id, name, email, topic, message)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(msg.id, msg.name, msg.email, msg.topic, msg.message)
    .run();
}

export async function getRecentContactMessages(
  db: D1Database,
  limit = 50
): Promise<DbContactMessage[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "ContactMessage" ORDER BY createdAt DESC LIMIT ?`
    )
    .bind(limit)
    .all<DbContactMessage>();
  return results;
}
