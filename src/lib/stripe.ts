import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

function getStripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY;
}

export function stripeConfigured() {
  return Boolean(getStripeSecretKey());
}

// Construct Stripe only from the configured Cloudflare/worker secret.
export function getStripe(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe;

  const key = getStripeSecretKey();
  if (!key) {
    throw new Error("getStripe() called without STRIPE_SECRET_KEY set in environment");
  }

  const client = new Stripe(key);

  if (process.env.NODE_ENV !== "production") globalForStripe.stripe = client;
  return client;
}

