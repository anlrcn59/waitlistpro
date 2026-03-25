import Link from "next/link";
import type { Waitlist } from "@/types";

type Props = {
  waitlist: Waitlist;
  subscriberCount: number;
};

export function WaitlistCard({ waitlist, subscriberCount }: Props) {
  return (
    <div className="rounded-lg border bg-white p-5 dark:bg-zinc-950">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{waitlist.name}</h3>
          <p className="mt-0.5 text-sm text-zinc-500">/w/{waitlist.slug}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            waitlist.is_active
              ? "bg-green-100 text-green-700"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {waitlist.is_active ? "Active" : "Paused"}
        </span>
      </div>
      {waitlist.description && (
        <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
          {waitlist.description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">
          {subscriberCount.toLocaleString()} subscribers
        </span>
        <div className="flex gap-3">
          <Link
            href={`/w/${waitlist.slug}`}
            target="_blank"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            View
          </Link>
          <Link
            href={`/waitlists/${waitlist.id}`}
            className="text-sm font-medium hover:underline"
          >
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}
