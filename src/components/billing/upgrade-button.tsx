"use client";

import { useState } from "react";
import type { Plan } from "@/types";

type Props = { plan: Plan; className?: string };

export function UpgradeButton({ plan, className }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (json.url) window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 ${className ?? ""}`}
    >
      {loading ? "Redirecting…" : `Upgrade to ${plan}`}
    </button>
  );
}
