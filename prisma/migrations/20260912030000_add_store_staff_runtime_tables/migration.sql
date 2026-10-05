-- Database-backed admin settings, custom products, staff accounts, and user profile fields.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "street" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'Germany';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'customer';

CREATE TABLE IF NOT EXISTS "StoreSetting" (
  "id" TEXT PRIMARY KEY,
  "vatRateStandard" DOUBLE PRECISION NOT NULL DEFAULT 19.0,
  "vatRateReduced" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
  "pricesIncludeTax" BOOLEAN NOT NULL DEFAULT true,
  "shippingFlatRate" DOUBLE PRECISION NOT NULL DEFAULT 4.9,
  "freeShippingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 59.0,
  "deliveryCourier" TEXT NOT NULL DEFAULT 'DHL GoGreen',
  "estimatedDeliveryDays" TEXT NOT NULL DEFAULT '1-3 Business Days',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "StoreSetting" ("id") VALUES ('default') ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "CustomProduct" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'Ritual',
  "price" DOUBLE PRECISION NOT NULL,
  "tagline" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "details" JSONB,
  "ingredients" TEXT,
  "image" TEXT NOT NULL DEFAULT '/products/somnobalance-roll-on.jpg',
  "phase" TEXT NOT NULL DEFAULT 'REGULATE',
  "shippingIncluded" BOOLEAN NOT NULL DEFAULT false,
  "returnPeriodDays" INTEGER NOT NULL DEFAULT 30,
  "refundPolicy" TEXT,
  "returnEligible" BOOLEAN NOT NULL DEFAULT true,
  "refundRules" TEXT,
  "maxRetailQuantity" INTEGER NOT NULL DEFAULT 10,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "details" JSONB;
ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "ingredients" TEXT;
ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "returnPeriodDays" INTEGER NOT NULL DEFAULT 30;
ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "refundPolicy" TEXT;
ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "returnEligible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "refundRules" TEXT;
ALTER TABLE "CustomProduct" ADD COLUMN IF NOT EXISTS "maxRetailQuantity" INTEGER NOT NULL DEFAULT 10;

CREATE TABLE IF NOT EXISTS "StaffAccount" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role" TEXT NOT NULL,
  "roleTitle" TEXT NOT NULL,
  "department" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "permissions" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastLogin" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Affiliate" ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;
ALTER TABLE "Payout" ADD COLUMN IF NOT EXISTS "stripeTransferId" TEXT;
