import { tr } from "./tr";
import { en } from "./en";

export type Lang = "tr" | "en";
export const locales: Lang[] = ["tr", "en"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>;

const dicts = { tr, en };

// Returns `any` so callers can use dot notation (noPropertyAccessFromIndexSignature)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDictionary(lang: Lang): any {
  return dicts[lang] ?? dicts.tr;
}

export function isValidLang(value: string): value is Lang {
  return (locales as string[]).includes(value);
}
