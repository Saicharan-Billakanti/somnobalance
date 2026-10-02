// src/lib/db.ts
//
// Cloudflare D1 database access layer.
//
// DESIGN
// ------
// - All SQL is parameterized — no raw user input ever concatenated into SQL.
// - The D1 binding is passed in from the Worker environment (env.DB).
// - Foreign key enforcement is enabled per-connection via PRAGMA.
// - All functions return typed results; callers handle null/error cases.

import { env } from "cloudflare:workers";

export type D1Database = {
  prepare(sql: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(sql: string): Promise<D1ExecResult>;
};

export type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(col?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
};

export type D1Result<T = unknown> = {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
};

export type D1ExecResult = {
  count: number;
  duration: number;
};

// ─── Binding accessor ─────────────────────────────────────────────────────────

export function getDB(): D1Database {
  const db = (env as Record<string, unknown>)?.DB as D1Database | undefined;
  if (!db) throw new Error("D1 binding 'DB' not found in Worker environment");
  return db;
}

export function dbConfigured(): boolean {
  try {
    const db = (env as Record<string, unknown>)?.DB as D1Database | undefined;
    return Boolean(db);
  } catch {
    return false;
  }
}

// Enable foreign key enforcement. Call before any DML that touches FK columns.
async function withFK(db: D1Database): Promise<D1Database> {
  await db.exec("PRAGMA foreign_keys = ON");
  return db;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type DbUser = {
  id: string;
  createdAt: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
};

export type DbOrder = {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string | null;
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
