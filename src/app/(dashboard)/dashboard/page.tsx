import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getWaitlistsByUser,
  getProfileById,
  getSubscriberCount,
} from "@/lib/supabase/queries";
import {
  getPlanLimits,
  PLAN_NAMES,
  SHOPIER_PRO_URL,
} from "@/lib/plans";
import { WaitlistCard } from "@/components/waitlist/waitlist-card";
import { EmptyState } from "@/components/shared/empty-state";
import { NewWaitlistDialog } from "@/components/waitlist/new-waitlist-dialog";
import type { Plan, Waitlist } from "@/types";

export const metadata: Metadata = { title: "Dashboard — WaitlistPro" };

type Props = {
  searchParams: Promise<{ upgraded?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { upgraded } = await searchParams;

  const [{ data: profile }, { data: rawWaitlists }] = await Promise.all([
    getProfileById(user.id),
    getWaitlistsByUser(user.id),
  ]);

  const profileData = profile as { plan?: string; full_name?: string | null } | null;
  let plan = (profileData?.plan ?? "free") as Plan;

  // Handle Shopier return — upgrade plan if currently free
  if (upgraded === "true" && plan === "free") {
    await supabase
      .from("profiles")
      .update({ plan: "pro" })
      .eq("id", user.id);
    plan = "pro";
  }

  const waitlists = (rawWaitlists ?? []) as Waitlist[];

  // Subscriber counts — parallel queries
  const subscriberCounts = new Map<string, number>();
  await Promise.all(
    waitlists.map(async (w) => {
      const { count } = await getSubscriberCount(w.id);
      subscriberCounts.set(w.id, count ?? 0);
    }),
  );

  // Plan limit
  const { waitlists: maxWaitlists } = getPlanLimits(plan);
  const atLimit = maxWaitlists !== null && waitlists.length >= maxWaitlists;

  const firstName = profileData?.full_name?.split(" ")[0];
  const greeting = firstName ? `Hoşgeldin, ${firstName}` : "Hoşgeldin";

  return (
    <div className="space-y-8">
      {/* Upgrade success banner */}
      {upgraded === "true" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          🎉 Ödemeniz alındı — Pro plana geçişiniz tamamlandı!
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {waitlists.length}{" "}
            {maxWaitlists !== null ? `/ ${maxWaitlists}` : ""} waitlist •{" "}
            {PLAN_NAMES[plan]} plan
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {plan === "free" && (
              <a
                href={SHOPIER_PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700"
              >
                ⚡ Pro&apos;ya Geç
              </a>
            )}
            <NewWaitlistDialog disabled={atLimit} />
          </div>
          {atLimit && (
            <p className="text-xs text-muted-foreground">
              Plan limitine ulaştın.{" "}
              <a
                href={SHOPIER_PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                Pro&apos;ya Geç →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Waitlist grid / empty state */}
      {waitlists.length === 0 ? (
        <EmptyState
          title="Henüz waitlist yok"
          description="İlk waitlist'ini oluştur ve email toplamaya başla."
          action={
            <NewWaitlistDialog triggerLabel="İlk waitlist'ini oluştur" />
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {waitlists.map((waitlist) => (
            <WaitlistCard
              key={waitlist.id}
              waitlist={waitlist}
              subscriberCount={subscriberCounts.get(waitlist.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
