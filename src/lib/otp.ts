// src/lib/otp.ts
//
// Secure One-Time Password (OTP) generation, hashing, and verification
// using Web Crypto and Cloudflare D1.

import type { D1Database } from "@/lib/db";

export type OtpChannel = "EMAIL" | "SMS";
export type OtpPurpose = "REGISTRATION" | "LOGIN" | "RESET_PASSWORD";

export type OtpRecord = {
  id: string;
  identifier: string;
  channel: OtpChannel;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  createdAt: string;
  usedAt: string | null;
};

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

/**
 * Generates a cryptographically secure 6-digit OTP string.
 */
export function generateSecureOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  // Guarantee exact 6-digit range [100000, 999999]
  const val = 100000 + (buf[0] % 900000);
  return val.toString();
}

/**
 * Computes SHA-256 hash of the OTP for safe database storage.
 */
export async function hashOtp(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp.trim());
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuf));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Checks if a resend request is rate-limited.
 */
export async function checkOtpRateLimit(
  db: D1Database,
  identifier: string,
  channel: OtpChannel,
  purpose: OtpPurpose
): Promise<{ allowed: boolean; waitSeconds?: number }> {
  const latest = await db
    .prepare(
      `SELECT createdAt FROM "OtpVerification"
       WHERE identifier = ? AND channel = ? AND purpose = ?
       ORDER BY createdAt DESC LIMIT 1`
    )
    .bind(identifier, channel, purpose)
    .first<{ createdAt: string }>();

  if (!latest) return { allowed: true };

  const createdTime = new Date(latest.createdAt).getTime();
  const elapsed = Date.now() - createdTime;

  if (elapsed < RESEND_COOLDOWN_MS) {
    const remaining = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
    return { allowed: false, waitSeconds: remaining };
  }

  return { allowed: true };
}

/**
 * Creates and stores a new OTP, invalidating any previous unused OTP for this identifier/channel/purpose.
 */
export async function createAndStoreOtp(
  db: D1Database,
  identifier: string,
  channel: OtpChannel,
  purpose: OtpPurpose
): Promise<{ otp: string; expiresAt: string }> {
  const otp = generateSecureOtp();
  const codeHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  const id = crypto.randomUUID();

  // Invalidate older unused codes for this specific flow
  const invalidateStmt = db
    .prepare(
      `UPDATE "OtpVerification"
       SET usedAt = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE identifier = ? AND channel = ? AND purpose = ? AND usedAt IS NULL`
    )
    .bind(identifier, channel, purpose);

  const insertStmt = db
    .prepare(
      `INSERT INTO "OtpVerification"
         (id, identifier, channel, purpose, codeHash, expiresAt, attempts)
       VALUES (?, ?, ?, ?, ?, ?, 0)`
    )
    .bind(id, identifier, channel, purpose, codeHash, expiresAt);

  await db.batch([invalidateStmt, insertStmt]);

  return { otp, expiresAt };
}

export type VerifyOtpResult =
  | { success: true }
  | { success: false; error: "NOT_FOUND" | "EXPIRED" | "MAX_ATTEMPTS" | "INVALID_CODE"; remainingAttempts?: number };

/**
 * Verifies a submitted OTP against the stored hash in D1.
 */
export async function verifyOtp(
  db: D1Database,
  identifier: string,
  channel: OtpChannel,
  purpose: OtpPurpose,
  code: string
): Promise<VerifyOtpResult> {
  const trimmed = code.trim();
  if (!trimmed || trimmed.length !== 6) {
    return { success: false, error: "INVALID_CODE" };
  }

  const record = await db
    .prepare(
      `SELECT id, codeHash, expiresAt, attempts
       FROM "OtpVerification"
       WHERE identifier = ? AND channel = ? AND purpose = ? AND usedAt IS NULL
       ORDER BY createdAt DESC LIMIT 1`
    )
    .bind(identifier, channel, purpose)
    .first<{ id: string; codeHash: string; expiresAt: string; attempts: number }>();

  if (!record) {
    return { success: false, error: "NOT_FOUND" };
  }

  // Check attempt limit
  if (record.attempts >= MAX_ATTEMPTS) {
    return { success: false, error: "MAX_ATTEMPTS" };
  }

  // Check expiration
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { success: false, error: "EXPIRED" };
  }

  // Hash submitted code and verify
  const submittedHash = await hashOtp(trimmed);
  const isMatch = submittedHash === record.codeHash;

  if (!isMatch) {
    const newAttempts = record.attempts + 1;
    await db
      .prepare(`UPDATE "OtpVerification" SET attempts = ? WHERE id = ?`)
      .bind(newAttempts, record.id)
      .run();

    const remaining = Math.max(0, MAX_ATTEMPTS - newAttempts);
    if (remaining === 0) {
      return { success: false, error: "MAX_ATTEMPTS", remainingAttempts: 0 };
    }
    return { success: false, error: "INVALID_CODE", remainingAttempts: remaining };
  }

  // Success: mark used immediately
  await db
    .prepare(
      `UPDATE "OtpVerification"
       SET usedAt = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ?`
    )
    .bind(record.id)
    .run();

  return { success: true };
}
