import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI commands (migrate, generate, studio) need a direct connection —
// pooled/pgbouncer connections don't reliably support the advisory locks
// Prisma Migrate uses. The app's own runtime connection (src/lib/prisma.ts)
// uses DATABASE_URL (pooled) independently of this file.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
