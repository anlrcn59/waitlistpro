import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/waitlist/stats-card";
import { WaitlistDetailClient } from "@/components/waitlist/waitlist-detail-client";
import type { Waitlist, Subscriber } from "@/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("waitlists")
    .select("name")
    .eq("id", id)
    .single();
  return { title: data ? `${data.name} — WaitlistPro` : "Waitlist" };
}

export default async function WaitlistDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: rawWaitlist, error: wlError }, { data: rawSubscribers }] =
    await Promise.all([
      supabase
        .from("waitlists")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("subscribers")
        .select("*")
        .eq("waitlist_id", id)
        .order("position", { ascending: true }),
    ]);

  if (wlError || !rawWaitlist) notFound();

  const waitlist = rawWaitlist as Waitlist;
  const subscribers = (rawSubscribers ?? []) as Subscriber[];

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalCount = subscribers.length;

  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const todayCount = subscribers.filter((s) =>
    s.created_at.startsWith(todayStr),
  ).length;

  const referredCount = subscribers.filter((s) => s.referred_by !== null).length;
  const referralRate =
    totalCount > 0 ? Math.round((referredCount / totalCount) * 100) : 0;

  const publicLink = `${getBaseUrl()}/w/${waitlist.slug}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {waitlist.name}
            </h1>
            <Badge variant={waitlist.is_active ? "default" : "secondary"}>
              {waitlist.is_active ? "Aktif" : "Pasif"}
            </Badge>
          </div>
          {waitlist.description && (
            <p className="text-sm text-muted-foreground">{waitlist.description}</p>
          )}
          <p className="font-mono text-xs text-muted-foreground">
            /w/{waitlist.slug}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Toplam Subscriber"
          value={totalCount.toLocaleString("tr-TR")}
        />
        <StatsCard
          title="Bugünkü Kayıt"
          value={todayCount.toLocaleString("tr-TR")}
          description="son 24 saat değil, bugün (UTC)"
        />
        <StatsCard
          title="Referral Oranı"
          value={`%${referralRate}`}
          description={`${referredCount} referral ile geldi`}
        />
        <StatsCard
          title="Public Link"
          value={`/w/${waitlist.slug}`}
          description={publicLink}
        />
      </div>

      {/* Subscriber table + actions */}
      <WaitlistDetailClient
        waitlistId={waitlist.id}
        waitlistName={waitlist.name}
        publicLink={publicLink}
        subscribers={subscribers}
      />
    </div>
  );
}
