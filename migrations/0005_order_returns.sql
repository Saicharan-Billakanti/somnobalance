-- D1 fields used by customer return requests and the admin order workflow.
ALTER TABLE "Order" ADD COLUMN "returnStatus" TEXT;
ALTER TABLE "Order" ADD COLUMN "returnReason" TEXT;
ALTER TABLE "Order" ADD COLUMN "returnNote" TEXT;
ALTER TABLE "Order" ADD COLUMN "returnRequestedAt" TEXT;
ALTER TABLE "Order" ADD COLUMN "returnApprovedAt" TEXT;
ALTER TABLE "Order" ADD COLUMN "refundStatus" TEXT;
