import { createClient } from "@/lib/supabase/server";
import { stripe, getURL } from "@/lib/stripe";
import { PLANS } from "@/lib/stripe/plans";
import { NextResponse } from "next/server";
import type { Plan } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = (await request.json()) as { plan: Plan };
    const planConfig = PLANS[plan];

    if (!planConfig.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: getURL("/settings/billing?success=true"),
      cancel_url: getURL("/settings/billing"),
      metadata: { user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[POST /api/stripe/checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
