"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DemoButton() {
  const router = useRouter();

  async function handleClick() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
    >
      See demo
    </button>
  );
}
