"use client";

import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LangSwitcher } from "@/components/shared/lang-switcher";
import type { Lang } from "@/lib/i18n";

type Props = { lang?: Lang };

export function Header({ lang = "tr" }: Props) {
  const { user } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}`);
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div />
      <div className="flex items-center gap-3">
        <LangSwitcher currentLang={lang} />
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
