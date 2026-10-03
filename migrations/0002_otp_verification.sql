-- Migration 0002: Email and Mobile OTP Verification
-- Adds verification metadata to User and creates OtpVerification table.
--
-- 2026-10-03: the three ALTER TABLE statements that originally opened this
-- file are now redundant — User.phone/emailVerifiedAt/phoneVerifiedAt were
-- already added directly to 0001_init.sql (see that file's 2026-10-02 note)
-- after a schema gap was found while verifying the demo admin login. Kept
-- out of this file so re-running migrations 0001 then 0002 against a fresh
-- database doesn't hit "duplicate column" errors; the columns are created
-- once, in 0001.

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
