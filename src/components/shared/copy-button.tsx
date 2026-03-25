"use client";

import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

type Props = { text: string; className?: string };

export function CopyButton({ text, className }: Props) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={cn(
        "rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
        className,
      )}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
