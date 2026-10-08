import { useCallback, useSyncExternalStore } from "react";
import { generationMessages } from "./catalogs/generation";
import { mediaMessages } from "./catalogs/media";
import { settingsMessages } from "./catalogs/settings";
import { shellMessages } from "./catalogs/shell";

export type Locale = "en" | "zh-TW";
export type TranslationParams = Record<string, string | number>;
export type Translate = (source: string, params?: TranslationParams) => string;

const LOCALE_STORAGE_KEY = "artcraft.locale";
const translations: Record<string, string> = {
  ...settingsMessages,
  ...shellMessages,
  ...generationMessages,
  ...mediaMessages,
};

let currentLocale: Locale = "en";
const listeners = new Set<() => void>();

export function initializeLocale(): void {
  applyLocale(readSavedLocale());
}

export function setLocale(locale: Locale): void {
  if (!isLocale(locale)) return;

  saveLocale(locale);
  applyLocale(locale);
}

export function useTranslation(): { t: Translate; locale: Locale; setLocale: typeof setLocale } {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, getLocaleSnapshot);
  const t = useCallback((source: string, params?: TranslationParams) => translate(source, locale, params), [locale]);

  return { t, locale, setLocale };
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getLocaleSnapshot(): Locale {
  return currentLocale;
}

function applyLocale(locale: Locale): void {
  const changed = currentLocale !== locale;
  currentLocale = locale;
  updateDocumentLanguage(locale);

  if (changed) {
    for (const listener of listeners) listener();
  }
}

function readSavedLocale(): Locale {
  try {
    if (typeof window === "undefined") return "en";

    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(savedLocale) ? savedLocale : "en";
  } catch {
    return "en";
  }
}

function saveLocale(locale: Locale): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  } catch {
    // Storage can be blocked by the browser. Keep the current session usable.
  }
}

function updateDocumentLanguage(locale: Locale): void {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.lang = locale;
  }
}

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-TW";
}

function translate(source: string, locale: Locale, params?: TranslationParams): string {
  const hasTranslation = Object.prototype.hasOwnProperty.call(translations, source);
  const message = locale === "zh-TW" && hasTranslation ? translations[source] : source;
  return interpolate(message, params);
}

function interpolate(message: string, params?: TranslationParams): string {
  if (!params) return message;

  return message.replace(/\{([^{}]+)\}/g, (placeholder, name: string) => {
    if (!Object.prototype.hasOwnProperty.call(params, name)) return placeholder;
    return String(params[name]);
  });
}
