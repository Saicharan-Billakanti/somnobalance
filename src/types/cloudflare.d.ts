// src/types/cloudflare.d.ts
// Ambient types for Cloudflare Workers runtime bindings

declare module "cloudflare:workers" {
  export const env: {
    DB?: import("@/lib/db").D1Database;
    [key: string]: unknown;
  };
}
