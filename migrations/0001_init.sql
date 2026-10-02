-- Migration 0001: Initial D1 schema
-- Converted from PostgreSQL (Prisma/Supabase) to SQLite/D1.
--
-- Conversion notes:
--   ENUM           → TEXT + CHECK constraint
--   DOUBLE PRECISION → REAL
--   TIMESTAMP(3)   → TEXT (ISO-8601, stored as 'YYYY-MM-DDTHH:MM:SS.sssZ')
--   DEFAULT CURRENT_TIMESTAMP → DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
--   SERIAL/cuid()  → TEXT PK (IDs generated in application code via crypto.randomUUID())
--   CREATE SCHEMA  → not applicable in SQLite
--
-- Foreign key enforcement requires PRAGMA foreign_keys = ON per connection.
-- The D1 binding in src/lib/db.ts issues this pragma on every connection.
--
-- 2026-10-02: "User".phone / emailVerifiedAt / phoneVerifiedAt added after
-- the fact — feature/cloudflare-d1-migration's getUserByEmail/getUserByPhone/
-- createUser (src/lib/db.ts) and the DbUser type all expect these three
-- nullable columns, but the schema originally applied here didn't have them,
-- which would have made login fail with "no such column: phone". Applied
-- directly to the remote somnobalance-db via ALTER TABLE ADD COLUMN and
-- folded into this file so it matches what's actually live.

-- ─── Order ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Order" (
  "id"              TEXT    NOT NULL PRIMARY KEY,
  "createdAt"       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "status"          TEXT    NOT NULL DEFAULT 'PENDING_PAYMENT'
                            CHECK("status" IN ('PENDING_PAYMENT','PAID','CANCELLED')),
  "paymentMethod"   TEXT             CHECK("paymentMethod" IN ('CARD','SEPA','PAYPAL')),
  "firstName"       TEXT    NOT NULL,
  "lastName"        TEXT    NOT NULL,
  "email"           TEXT    NOT NULL,
  "street"          TEXT    NOT NULL,
  "postalCode"      TEXT    NOT NULL,
  "city"            TEXT    NOT NULL,
  "country"         TEXT    NOT NULL,
  "subtotal"        REAL    NOT NULL,
  "shipping"        REAL    NOT NULL,
  "total"           REAL    NOT NULL,
  "currency"        TEXT    NOT NULL DEFAULT 'EUR',
  "stripeSessionId" TEXT             UNIQUE
);

-- ─── OrderItem ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"      TEXT    NOT NULL PRIMARY KEY,
  "orderId" TEXT    NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "slug"    TEXT    NOT NULL,
  "name"    TEXT    NOT NULL,
  "price"   REAL    NOT NULL,
  "qty"     INTEGER NOT NULL
);

-- ─── ContactMessage ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "topic"     TEXT NOT NULL,
  "message"   TEXT NOT NULL
);

-- ─── User ─────────────────────────────────────────────────────────────────────
-- passwordHash stores bcrypt hashes unchanged from Supabase.
-- Existing hashes remain valid — no password resets required.

CREATE TABLE IF NOT EXISTS "User" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "createdAt"       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "email"           TEXT NOT NULL UNIQUE,
  "passwordHash"    TEXT NOT NULL,
  "firstName"       TEXT NOT NULL,
  "lastName"        TEXT NOT NULL,
  "phone"           TEXT,
  "emailVerifiedAt" TEXT,
  "phoneVerifiedAt" TEXT
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "idx_order_email"     ON "Order"("email");
CREATE INDEX IF NOT EXISTS "idx_order_createdat" ON "Order"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_orderitem_order" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "idx_contact_createdat" ON "ContactMessage"("createdAt");
