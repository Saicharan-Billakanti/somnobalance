import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Lazy on purpose, same reasoning as getSupabase(): constructing the client
// must never happen just from importing this module in an environment
// where Stripe isn't configured yet — only call getStripe() from inside a
// stripeConfigured() branch.
export function getStripe(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("getStripe() called without STRIPE_SECRET_KEY set");
  }

  const client = new Stripe(key);

  if (process.env.NODE_ENV !== "production") globalForStripe.stripe = client;
  return client;
}
