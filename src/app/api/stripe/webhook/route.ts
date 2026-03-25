import { stripe } from "@/lib/stripe";
import { PLANS } from "@/lib/stripe/plans";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

const HANDLED_EVENTS = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

/** Map a Stripe price ID to a plan name. */
function planFromPriceId(priceId: string): string {
  for (const plan of Object.values(PLANS)) {
    if (plan.priceId === priceId) return plan.id;
  }
  return "free";
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env["STRIPE_WEBHOOK_SECRET"]!,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    const supabase = await createClient();

    switch (event.type) {
      case "checkout.session.completed": {
        // Profile will be updated via customer.subscription.created
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
        };
        const userId = sub.metadata["user_id"];
        if (!userId) break;

        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan = planFromPriceId(priceId);

        await supabase
          .from("profiles")
          .update({
            plan,
            stripe_subscription_id: sub.id,
          })
          .eq("id", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata["user_id"];
        if (!userId) break;

        await supabase
          .from("profiles")
          .update({ plan: "free", stripe_subscription_id: null })
          .eq("id", userId);
        break;
      }
    }
  } catch (err) {
    console.error(`[stripe webhook] ${event.type}:`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
