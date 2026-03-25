import { tr } from "./tr";
import { en } from "./en";

export type Lang = "tr" | "en";
export const locales: Lang[] = ["tr", "en"];
export type Dictionary = typeof tr;

const dicts: Record<Lang, Dictionary> = { tr, en };

export function getDictionary(lang: Lang): Dictionary {
  return dicts[lang];
}

export function isValidLang(value: string): value is Lang {
  return (locales as string[]).includes(value);
}
