import { createClient } from "@/lib/supabase/server";
import { publicSignupSchema } from "@/lib/validations";
import { getBaseUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = publicSignupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { waitlist_id, email, referral_code } = result.data;
    const supabase = await createClient();

    // Verify waitlist exists and is active
    const { data: waitlist, error: wlError } = await supabase
      .from("waitlists")
      .select("id, slug, settings")
      .eq("id", waitlist_id)
      .eq("is_active", true)
      .single();

    if (wlError || !waitlist) {
      return NextResponse.json({ error: "Waitlist not found" }, { status: 404 });
    }

    // Get current count for position assignment
    const { count } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("waitlist_id", waitlist_id);

    const position = (count ?? 0) + 1;

    // Resolve referrer from referral_code
    let referredBy: string | null = null;
    if (referral_code) {
      const { data: referrer } = await supabase
        .from("subscribers")
        .select("id")
        .eq("referral_code", referral_code)
        .eq("waitlist_id", waitlist_id)
        .single();
      referredBy = referrer?.id ?? null;
    }

    // Insert subscriber
    const { data: subscriber, error } = await supabase
      .from("subscribers")
      .insert({
        waitlist_id,
        email,
        position,
        referred_by: referredBy,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already on this waitlist." },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Record referral relationship
    if (referredBy && subscriber) {
      await supabase.from("referrals").insert({
        waitlist_id,
        referrer_id: referredBy,
        referee_id: subscriber.id,
      });
    }

    const referral_link = `${getBaseUrl()}/w/${waitlist.slug}?ref=${subscriber.referral_code}`;

    return NextResponse.json(
      { data: { position: subscriber.position, referral_link } },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/subscribe]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
