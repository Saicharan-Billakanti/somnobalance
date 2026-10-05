CREATE TABLE IF NOT EXISTS "BusinessProduct" (
  "id" TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "image" TEXT NOT NULL DEFAULT '/products/somnobalance-roll-on.jpg',
  "category" TEXT NOT NULL DEFAULT 'Business',
  "retailPrice" DOUBLE PRECISION NOT NULL,
  "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
  "maxQuantity" INTEGER NOT NULL DEFAULT 1000,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BusinessProduct_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "BusinessApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BusinessProduct_applicationId_idx" ON "BusinessProduct"("applicationId");