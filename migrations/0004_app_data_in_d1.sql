-- Move remaining application records from the retired Supabase database to D1.
-- This is additive: it does not delete or attempt to import any remote records.
ALTER TABLE "User" ADD COLUMN "street" TEXT;
ALTER TABLE "User" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'Germany';
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'customer';

ALTER TABLE "Order" ADD COLUMN "affiliateId" TEXT;
ALTER TABLE "Order" ADD COLUMN "couponCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "discountAmount" REAL NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "discountRate" REAL NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "commissionAmount" REAL NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "selfReferral" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "carrier" TEXT DEFAULT 'DHL GoGreen';
ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;

CREATE TABLE IF NOT EXISTS "BusinessApplication" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT,
  "companyName" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "businessType" TEXT NOT NULL,
  "vatId" TEXT,
  "address" TEXT,
  "city" TEXT,
  "country" TEXT DEFAULT 'Germany',
  "estimatedVolume" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "discountRate" REAL NOT NULL DEFAULT 20,
  "notes" TEXT,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "BusinessProduct" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "applicationId" TEXT NOT NULL REFERENCES "BusinessApplication"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "image" TEXT NOT NULL DEFAULT '/products/somnobalance-roll-on.jpg',
  "category" TEXT NOT NULL DEFAULT 'Business',
  "retailPrice" REAL NOT NULL,
  "discountRate" REAL NOT NULL DEFAULT 20,
  "maxQuantity" INTEGER NOT NULL DEFAULT 1000,
  "inStock" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "BusinessMessage" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "applicationId" TEXT NOT NULL REFERENCES "BusinessApplication"("id") ON DELETE CASCADE,
  "senderRole" TEXT NOT NULL,
  "senderName" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "read" INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS "StoreSetting" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT 'default',
  "vatRateStandard" REAL NOT NULL DEFAULT 19,
  "vatRateReduced" REAL NOT NULL DEFAULT 7,
  "pricesIncludeTax" INTEGER NOT NULL DEFAULT 1,
  "shippingFlatRate" REAL NOT NULL DEFAULT 4.9,
  "freeShippingThreshold" REAL NOT NULL DEFAULT 59,
  "deliveryCourier" TEXT NOT NULL DEFAULT 'DHL GoGreen',
  "estimatedDeliveryDays" TEXT NOT NULL DEFAULT '1-3 Business Days',
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
INSERT OR IGNORE INTO "StoreSetting" ("id") VALUES ('default');
CREATE TABLE IF NOT EXISTS "CustomProduct" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'Ritual',
  "price" REAL NOT NULL,
  "tagline" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "details" TEXT,
  "ingredients" TEXT,
  "image" TEXT NOT NULL DEFAULT '/products/somnobalance-roll-on.jpg',
  "phase" TEXT NOT NULL DEFAULT 'REGULATE',
  "shippingIncluded" INTEGER NOT NULL DEFAULT 0,
  "returnPeriodDays" INTEGER NOT NULL DEFAULT 30,
  "refundPolicy" TEXT,
  "returnEligible" INTEGER NOT NULL DEFAULT 1,
  "refundRules" TEXT,
  "maxRetailQuantity" INTEGER NOT NULL DEFAULT 10,
  "inStock" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "StaffAccount" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role" TEXT NOT NULL,
  "roleTitle" TEXT NOT NULL,
  "department" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "permissions" TEXT NOT NULL DEFAULT '[]',
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "lastLogin" TEXT,
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "Affiliate" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "affiliateCode" TEXT NOT NULL UNIQUE,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "businessName" TEXT,
  "businessType" TEXT,
  "website" TEXT,
  "country" TEXT,
  "address" TEXT,
  "audienceType" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "bankName" TEXT,
  "iban" TEXT,
  "bicSwift" TEXT,
  "paymentMethod" TEXT DEFAULT 'bank_transfer',
  "stripeAccountId" TEXT,
  "payoutThreshold" REAL NOT NULL DEFAULT 50,
  "defaultCommissionRate" REAL NOT NULL DEFAULT 10
);
CREATE TABLE IF NOT EXISTS "AffiliateCoupon" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "affiliateId" TEXT NOT NULL REFERENCES "Affiliate"("id") ON DELETE CASCADE,
  "couponCode" TEXT NOT NULL UNIQUE,
  "discountRate" REAL NOT NULL,
  "commissionRate" REAL NOT NULL,
  "commissionBaseType" TEXT NOT NULL DEFAULT 'discounted_value',
  "minimumOrderValue" REAL NOT NULL DEFAULT 0,
  "usageLimit" INTEGER,
  "timesUsed" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "Payout" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "affiliateId" TEXT NOT NULL REFERENCES "Affiliate"("id") ON DELETE CASCADE,
  "amount" REAL NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "paymentMethod" TEXT DEFAULT 'bank_transfer',
  "paymentReference" TEXT,
  "paymentDate" TEXT,
  "notes" TEXT,
  "stripeTransferId" TEXT,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "CommissionRecord" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "affiliateId" TEXT NOT NULL REFERENCES "Affiliate"("id") ON DELETE CASCADE,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
  "couponId" TEXT REFERENCES "AffiliateCoupon"("id") ON DELETE SET NULL,
  "commissionBase" REAL NOT NULL,
  "commissionRate" REAL NOT NULL,
  "commissionAmount" REAL NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "payoutId" TEXT REFERENCES "Payout"("id") ON DELETE SET NULL,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updatedAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "AffiliateNotification" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "affiliateId" TEXT NOT NULL REFERENCES "Affiliate"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS "idx_business_email" ON "BusinessApplication"("email");
CREATE INDEX IF NOT EXISTS "idx_business_product_application" ON "BusinessProduct"("applicationId");
CREATE INDEX IF NOT EXISTS "idx_business_message_application" ON "BusinessMessage"("applicationId", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_affiliate_email" ON "Affiliate"("email");
CREATE INDEX IF NOT EXISTS "idx_coupon_affiliate" ON "AffiliateCoupon"("affiliateId");
CREATE INDEX IF NOT EXISTS "idx_commission_affiliate" ON "CommissionRecord"("affiliateId", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_payout_affiliate" ON "Payout"("affiliateId", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_notification_affiliate" ON "AffiliateNotification"("affiliateId", "createdAt");
