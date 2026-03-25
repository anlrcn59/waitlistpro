import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getWaitlistsByUser,
  getProfileById,
  getSubscriberCount,
} from "@/lib/supabase/queries";
import { getPlanLimits, PLAN_NAMES, SHOPIER_PRO_URL } from "@/lib/plans";
import { getDictionary, isValidLang } from "@/lib/i18n";
import { WaitlistCard } from "@/components/waitlist/waitlist-card";
import { EmptyState } from "@/components/shared/empty-state";
import { NewWaitlistDialog } from "@/components/waitlist/new-waitlist-dialog";
import type { Plan, Waitlist } from "@/types";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ upgraded?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "tr" ? "Dashboard — WaitlistPro" : "Dashboard — WaitlistPro",
  };
}

export default async function LangDashboardPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  const dict = getDictionary(lang);
  const d = dict.dashboard;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const { upgraded } = await searchParams;

  const [{ data: profile }, { data: rawWaitlists }] = await Promise.all([
    getProfileById(user.id),
    getWaitlistsByUser(user.id),
  ]);

  const profileData = profile as { plan?: string; full_name?: string | null } | null;
  let plan = (profileData?.plan ?? "free") as Plan;

  if (upgraded === "true" && plan === "free") {
    await supabase.from("profiles").update({ plan: "pro" }).eq("id", user.id);
    plan = "pro";
  }

  const waitlists = (rawWaitlists ?? []) as Waitlist[];

  const subscriberCounts = new Map<string, number>();
  await Promise.all(
    waitlists.map(async (w) => {
      const { count } = await getSubscriberCount(w.id);
      subscriberCounts.set(w.id, count ?? 0);
    }),
  );

  const { waitlists: maxWaitlists } = getPlanLimits(plan);
  const atLimit = maxWaitlists !== null && waitlists.length >= maxWaitlists;

  const firstName = profileData?.full_name?.split(" ")[0];
  const greeting = firstName
    ? d.greeting_named.replace("{name}", firstName)
    : d.greeting;

  const planInfo = d.plan_info
    .replace("{count}", String(waitlists.length))
    .replace("{max}", maxWaitlists !== null ? ` / ${maxWaitlists}` : "")
    .replace("{plan}", PLAN_NAMES[plan]);

  return (
    <div className="space-y-8">
      {upgraded === "true" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          🎉 {d.upgrade_success}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{planInfo}</p>
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
                {d.upgrade_pro}
              </a>
            )}
            <NewWaitlistDialog disabled={atLimit} triggerLabel={d.new_waitlist} />
          </div>
          {atLimit && (
            <p className="text-xs text-muted-foreground">
              {d.limit_reached}{" "}
              <a
                href={SHOPIER_PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                {d.limit_upgrade}
              </a>
            </p>
          )}
        </div>
      </div>

      {waitlists.length === 0 ? (
        <EmptyState
          title={d.empty_title}
          description={d.empty_description}
          action={<NewWaitlistDialog triggerLabel={d.empty_action} />}
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
