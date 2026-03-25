"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

type Props = { currentLang: Lang };

export function LangSwitcher({ currentLang }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // Persist choice in localStorage
  useEffect(() => {
    localStorage.setItem("lang", currentLang);
  }, [currentLang]);

  function switchTo(lang: Lang) {
    if (lang === currentLang) return;

    // Swap /{currentLang}/... → /{lang}/...
    const segments = pathname.split("/");
    if (segments[1] && locales.includes(segments[1] as Lang)) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }

    const newPath = segments.join("/") || "/";
    localStorage.setItem("lang", lang);
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white p-0.5 text-xs font-medium">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          className={`rounded px-2 py-1 uppercase transition-colors ${
            locale === currentLang
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
