"use client";

import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const { user } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div />
      <div className="flex items-center gap-3">
        {user && (
          <>
            <span className="text-sm text-zinc-500">{user.email}</span>
            <Link
              href="/settings"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
