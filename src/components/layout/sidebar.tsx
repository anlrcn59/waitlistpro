"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";

type Props = { lang?: Lang };

export function Sidebar({ lang = "tr" }: Props) {
  const pathname = usePathname();
  const base = `/${lang}`;

  const navItems = [
    { href: `${base}/dashboard`, label: lang === "en" ? "Dashboard" : "Dashboard" },
    { href: `${base}/waitlists`, label: lang === "en" ? "Waitlists" : "Waitlist'ler" },
    { href: `${base}/settings`, label: lang === "en" ? "Settings" : "Ayarlar" },
    { href: `${base}/settings/billing`, label: lang === "en" ? "Billing" : "Ödeme" },
  ];

  return (
    <aside className="flex w-56 flex-col border-r bg-zinc-50 dark:bg-zinc-950">
      <div className="flex h-14 items-center border-b px-6">
        <Link href={base} className="font-semibold tracking-tight">
          WaitlistPro
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
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
