import { createClient } from "@/lib/supabase/server";
import { createWaitlistSchema } from "@/lib/validations";
import { getPlanLimits } from "@/lib/plans";
import { NextResponse } from "next/server";
import type { Plan } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("waitlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/waitlists]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Plan limit check
    const { data: profileData } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = ((profileData as { plan?: string } | null)?.plan ?? "free") as Plan;
    const { waitlists: maxWaitlists } = getPlanLimits(plan);

    if (maxWaitlists !== null) {
      const { count } = await supabase
        .from("waitlists")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if ((count ?? 0) >= maxWaitlists) {
        return NextResponse.json(
          { error: "Plan limitine ulaştın. Daha fazla waitlist için Pro plana geç." },
          { status: 403 },
        );
      }
    }

    const body = await request.json();
    const result = createWaitlistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { name, slug, description, color } = result.data;
    const settings = {
      color: color ?? "#10b981",
      logo_url: null,
      redirect_url: null,
      custom_fields: [],
      referral_enabled: true,
    };

    const { data, error } = await supabase
      .from("waitlists")
      .insert({ name, slug, description, settings, user_id: user.id })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Bu slug zaten kullanımda. Farklı bir slug dene.", field: "slug" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/waitlists]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
