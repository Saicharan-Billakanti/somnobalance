import { env } from "cloudflare:workers";

// Read bindings at request time. Never import this module into client components.
export function serverConfig(name: string): string | undefined {
  const value = env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
