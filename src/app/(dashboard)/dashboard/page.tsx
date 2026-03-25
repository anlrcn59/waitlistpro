import type { Metadata } from "next";
import { StatsCard } from "@/components/waitlist/stats-card";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Overview of your waitlists.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Subscribers" value="0" />
        <StatsCard title="Active Waitlists" value="0" />
        <StatsCard title="Referrals" value="0" />
        <StatsCard title="Confirmed" value="0%" />
      </div>

      <EmptyState
        title="No waitlists yet"
        description="Create your first waitlist to start collecting emails."
        action={
          <Link
            href="/waitlists/new"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
          >
            Create Waitlist
          </Link>
        }
      />
    </div>
  );
}
