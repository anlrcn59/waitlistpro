"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/waitlists", label: "Waitlists" },
  { href: "/settings", label: "Settings" },
  { href: "/settings/billing", label: "Billing" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r bg-zinc-50 dark:bg-zinc-950">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="font-semibold tracking-tight">
          WaitlistPro
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
              pathname === item.href
                ? "bg-zinc-100 font-medium dark:bg-zinc-800"
                : "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
