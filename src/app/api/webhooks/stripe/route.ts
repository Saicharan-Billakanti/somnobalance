import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { sendNotification } from "@/lib/mailer";

// Stripe signs the raw body, so this route must read the request as text
// (not JSON) before verifying — Next.js would otherwise re-serialize it and
// break the signature check.
export async function POST(request: Request) {
  if (!stripeConfigured() || !supabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id ?? session.metadata?.orderId;

    if (orderId) {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("Order")
        .update({ status: "PAID" })
        .eq("id", orderId);

      if (error) {
        console.error("[stripe webhook] failed to mark order paid:", error);
      } else {
        await sendNotification(`Order ${orderId} paid`, `Stripe session ${session.id} completed payment.`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
