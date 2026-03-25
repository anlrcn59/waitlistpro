"use client";

import { useCopy } from "@/hooks/use-copy";

type Props = { link: string; accentColor?: string };

export function ReferralLink({ link, accentColor = "#18181b" }: Props) {
  const { copied, copy } = useCopy();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
      <span className="flex-1 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
        {link}
      </span>
      <button
        type="button"
        onClick={() => copy(link)}
        className="shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: accentColor }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
