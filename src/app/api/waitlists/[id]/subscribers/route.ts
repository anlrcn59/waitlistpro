import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validations";
import { getBaseUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .eq("waitlist_id", id)
      .order("position", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/waitlists/[id]/subscribers]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify waitlist exists and is active
    const { data: waitlist, error: wlError } = await supabase
      .from("waitlists")
      .select("id, slug, settings")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (wlError || !waitlist) {
      return NextResponse.json({ error: "Waitlist not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    // Get current subscriber count for position
    const { count } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("waitlist_id", id);

    const position = (count ?? 0) + 1;

    // Handle referral: find referrer by referral_code
    let referredBy: string | null = null;
    if (result.data.referral_code) {
      const { data: referrer } = await supabase
        .from("subscribers")
        .select("id")
        .eq("referral_code", result.data.referral_code)
        .eq("waitlist_id", id)
        .single();
      referredBy = referrer?.id ?? null;
    }

    const { data: subscriber, error } = await supabase
      .from("subscribers")
      .insert({
        waitlist_id: id,
        email: result.data.email,
        position,
        referred_by: referredBy,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const referral_link = `${getBaseUrl()}/w/${waitlist.slug}?ref=${subscriber.referral_code}`;

    // Insert referral record if referred
    if (referredBy) {
      await supabase.from("referrals").insert({
        waitlist_id: id,
        referrer_id: referredBy,
        referee_id: subscriber.id,
      });
    }

    return NextResponse.json(
      { data: { ...subscriber, referral_link } },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/waitlists/[id]/subscribers]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
