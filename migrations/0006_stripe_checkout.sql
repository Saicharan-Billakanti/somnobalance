ALTER TABLE "Order" ADD COLUMN "couponId" TEXT;
ALTER TABLE "Order" ADD COLUMN "commissionRate" REAL NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "commissionBaseType" TEXT NOT NULL DEFAULT 'discounted_value';
ALTER TABLE "Order" ADD COLUMN "stripePaymentIntentId" TEXT;

CREATE TABLE IF NOT EXISTS "AffiliateCouponRedemption" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "couponId" TEXT NOT NULL REFERENCES "AffiliateCoupon"("id"),
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS "StripeWebhookEvent" (
  "eventId" TEXT PRIMARY KEY NOT NULL,
  "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_payout_one_open_per_affiliate"
  ON "Payout"("affiliateId") WHERE "status" IN ('pending','processing');
