import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Waitlists" };

export default function WaitlistsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Waitlists</h1>
        <Link
          href="/waitlists/new"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
        >
          New Waitlist
        </Link>
      </div>

      <EmptyState
        title="No waitlists"
        description="Create your first waitlist to start collecting emails."
      />
    </div>
  );
}
