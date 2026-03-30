export const APP_NAME = "Shopland";
export const APP_VERSION = "1.0.0";

// URL is injected at startup by each app via setApiBaseUrl().
export const API_BASE_URL: string = "";

import type { Locale, LocaleMeta } from "./types";

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { label: "English", dir: "ltr" },
  fa: { label: "دری (افغانستان)", dir: "rtl" },
  ps: { label: "پښتو (افغانستان)", dir: "rtl" },
} as const;

export const DEFAULT_LOCALE: Locale = "fa";

export { COMING_SOON, COMING_SOON_FALLBACK } from "./content/coming-soon";