"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { label?: string };

export function DemoButton({ label = "See demo" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.startsWith("/en") ? "en" : "tr";

  async function handleClick() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    router.push(user ? `/${lang}/dashboard` : `/${lang}/login`);
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
