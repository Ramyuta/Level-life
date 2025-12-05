"use client";

import { useLanguage } from "./LanguageContext";
import { translations, type TranslationKey } from "./translations";

export function useTranslation() {
  const { language } = useLanguage();

  function t(key: TranslationKey): string {
    const keys = key.split(".");

    let value: any = translations[language] ?? translations.ja;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    if (typeof value === "string") return value;

    // Fallback to Japanese
    let fallback: any = translations.ja;
    for (const k of keys) {
      fallback = fallback?.[k];
      if (fallback === undefined) break;
    }

    if (typeof fallback === "string") return fallback;

    return key;
  }

  return { t, language };
}
