import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// Değerde virgül, çift tırnak veya satır sonu varsa RFC 4180 uyumlu quote yap
function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: NextRequest) {
  const waitlistId = req.nextUrl.searchParams.get("waitlistId");
  if (!waitlistId) {
    return NextResponse.json({ error: "waitlistId zorunlu" }, { status: 400 });
  }

  const supabase = await createClient();

  // Auth kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ownership kontrolü
  const { data: waitlist } = await supabase
    .from("waitlists")
    .select("user_id, name")
    .eq("id", waitlistId)
    .single();

  if (!waitlist || (waitlist as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Subscriber'ları çek
  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email, position, referral_code, status, created_at")
    .eq("waitlist_id", waitlistId)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // CSV oluştur
  const header = "position,email,status,referral_code,created_at";
  const rows = (subscribers ?? []).map((s) => {
    const sub = s as {
      position: number;
      email: string;
      status: string;
      referral_code: string;
      created_at: string;
    };
    return [
      String(sub.position),
      csvCell(sub.email),
      sub.status,
      sub.referral_code,
      new Date(sub.created_at).toISOString(),
    ].join(",");
  });

  const csv = "\ufeff" + [header, ...rows].join("\r\n"); // BOM + CRLF (Excel uyumlu)
  const waitlistName = (waitlist as { name: string }).name;
  const filename = `${waitlistName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-export.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
