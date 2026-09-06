-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" DROP NOT NULL;
ALTER TABLE "Order" ADD COLUMN "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
