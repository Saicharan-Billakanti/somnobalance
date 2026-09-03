import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Lazy on purpose: constructing PrismaClient opens a database connection
// immediately. On environments without DATABASE_URL configured, that must
// never happen just from importing this module — only call getPrisma()
// from inside a `dbConfigured` branch.
export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("getPrisma() called without DATABASE_URL set");
  }

  // Supabase's pooler certificate doesn't chain-verify against Node's
  // default trust store ("self-signed certificate in certificate chain").
  // The connection is still encrypted — this just skips strict CA-chain
  // verification, which is standard practice for this provider/driver pair.
  const adapter = new PrismaPg({ connectionString, ssl: { rejectUnauthorized: false } });
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}
