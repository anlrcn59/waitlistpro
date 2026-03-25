"use client";

import { useUser } from "@/hooks/use-user";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LangSwitcher } from "@/components/shared/lang-switcher";

export function Header() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const lang = pathname.startsWith("/en") ? "en" : "tr";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}`);
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div />
      <div className="flex items-center gap-4">
        <LangSwitcher />
        {user && (
          <>
            <span className="text-sm text-zinc-500">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {lang === "en" ? "Sign out" : "Çıkış"}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
