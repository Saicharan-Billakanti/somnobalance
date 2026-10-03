-- Migration 0002: Email and Mobile OTP Verification
-- Adds verification metadata to User and creates OtpVerification table.

ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TEXT;
ALTER TABLE "User" ADD COLUMN "phoneVerifiedAt" TEXT;

CREATE TABLE IF NOT EXISTS "OtpVerification" (
  "id"         TEXT    NOT NULL PRIMARY KEY,
  "identifier" TEXT    NOT NULL,
  "channel"    TEXT    NOT NULL CHECK("channel" IN ('EMAIL', 'SMS')),
  "purpose"    TEXT    NOT NULL CHECK("purpose" IN ('REGISTRATION', 'LOGIN', 'RESET_PASSWORD')),
  "codeHash"   TEXT    NOT NULL,
  "expiresAt"  TEXT    NOT NULL,
  "attempts"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "usedAt"     TEXT
);

CREATE INDEX IF NOT EXISTS "idx_otp_lookup" ON "OtpVerification"("identifier", "channel", "purpose");
CREATE INDEX IF NOT EXISTS "idx_otp_expires" ON "OtpVerification"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_user_phone" ON "User"("phone");
