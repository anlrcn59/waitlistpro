"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LANGS = ["tr", "en"] as const;
type Lang = (typeof LANGS)[number];

/**
 * Self-contained lang switcher — reads current lang from URL, no props needed.
 * Place it anywhere: <LangSwitcher />
 */
export function LangSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLang: Lang = segments[1] === "en" ? "en" : "tr";

  // Persist selection in localStorage for client-side reads
  useEffect(() => {
    localStorage.setItem("lang", currentLang);
  }, [currentLang]);

  function switchTo(lang: Lang) {
    if (lang === currentLang) return;

    const next = [...segments];
    if (next[1] === "tr" || next[1] === "en") {
      next[1] = lang;
    } else {
      next.splice(1, 0, lang);
    }

    localStorage.setItem("lang", lang);
    router.push(next.join("/") || "/");
  }

  return (
    <div className="flex overflow-hidden rounded-lg border border-zinc-200 text-sm font-semibold">
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchTo(lang)}
          className={`px-3 py-1.5 uppercase tracking-wide transition-colors ${
            lang === currentLang
              ? "bg-zinc-900 text-white"
              : "bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
