-- Affiliate portal tables used by /api/partner/portal.
CREATE TABLE IF NOT EXISTS "Affiliate" (
    "id" TEXT NOT NULL,
    "affiliateCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
    "payoutThreshold" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "defaultCommissionRate" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "stripeAccountId" TEXT,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AffiliateCoupon" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discountRate" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionBaseType" TEXT NOT NULL DEFAULT 'discounted_value',
    "minimumOrderValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usageLimit" INTEGER,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateCoupon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CommissionRecord" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "couponId" TEXT,
    "commissionBase" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Payout" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT DEFAULT 'bank_transfer',
    "paymentReference" TEXT,
    "paymentDate" TIMESTAMP(3),
    "notes" TEXT,
    "stripeTransferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AffiliateNotification" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Affiliate_affiliateCode_key" ON "Affiliate"("affiliateCode");
CREATE UNIQUE INDEX IF NOT EXISTS "Affiliate_email_key" ON "Affiliate"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "AffiliateCoupon_couponCode_key" ON "AffiliateCoupon"("couponCode");

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "affiliateId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "selfReferral" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "carrier" TEXT DEFAULT 'DHL GoGreen';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Order_affiliateId_fkey') THEN
        ALTER TABLE "Order"
        ADD CONSTRAINT "Order_affiliateId_fkey"
        FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateCoupon_affiliateId_fkey') THEN
        ALTER TABLE "AffiliateCoupon"
        ADD CONSTRAINT "AffiliateCoupon_affiliateId_fkey"
        FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CommissionRecord_affiliateId_fkey') THEN
        ALTER TABLE "CommissionRecord"
        ADD CONSTRAINT "CommissionRecord_affiliateId_fkey"
        FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CommissionRecord_orderId_fkey') THEN
        ALTER TABLE "CommissionRecord"
        ADD CONSTRAINT "CommissionRecord_orderId_fkey"
        FOREIGN KEY ("orderId") REFERENCES "Order"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CommissionRecord_couponId_fkey') THEN
        ALTER TABLE "CommissionRecord"
        ADD CONSTRAINT "CommissionRecord_couponId_fkey"
        FOREIGN KEY ("couponId") REFERENCES "AffiliateCoupon"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CommissionRecord_payoutId_fkey') THEN
        ALTER TABLE "CommissionRecord"
        ADD CONSTRAINT "CommissionRecord_payoutId_fkey"
        FOREIGN KEY ("payoutId") REFERENCES "Payout"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Payout_affiliateId_fkey') THEN
        ALTER TABLE "Payout"
        ADD CONSTRAINT "Payout_affiliateId_fkey"
        FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AffiliateNotification_affiliateId_fkey') THEN
        ALTER TABLE "AffiliateNotification"
        ADD CONSTRAINT "AffiliateNotification_affiliateId_fkey"
        FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
