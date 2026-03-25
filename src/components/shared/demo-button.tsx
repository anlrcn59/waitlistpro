"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Lang } from "@/lib/i18n";

type Props = {
  label?: string;
  lang?: Lang;
};

export function DemoButton({ label = "See demo", lang = "tr" }: Props) {
  const router = useRouter();

  async function handleClick() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push(`/${lang}/dashboard`);
    } else {
      router.push(`/${lang}/login`);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
    >
      {label}
    </button>
  );
}
