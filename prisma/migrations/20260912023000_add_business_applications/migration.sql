-- CreateTable
CREATE TABLE IF NOT EXISTS "BusinessApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "businessType" TEXT NOT NULL,
    "vatId" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Germany',
    "estimatedVolume" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "BusinessMessage" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BusinessMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessApplication_email_key" ON "BusinessApplication"("email");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'BusinessMessage_applicationId_fkey'
    ) THEN
        ALTER TABLE "BusinessMessage"
        ADD CONSTRAINT "BusinessMessage_applicationId_fkey"
        FOREIGN KEY ("applicationId") REFERENCES "BusinessApplication"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
