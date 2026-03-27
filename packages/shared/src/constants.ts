export const APP_NAME = "Shopland";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL: string =

  // this ensures we get the .env from local
  import.meta.env.MODE === "LOCAL"
    ? "http://localhost:8000"
    : import.meta.env.VITE_API_BASE_URL;

import type { Locale, LocaleMeta } from "./types";

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { label: "English", dir: "ltr" },
  fa: { label: "دری (افغانستان)", dir: "rtl" },
  ps: { label: "پښتو (افغانستان)", dir: "rtl" },
} as const;

export const DEFAULT_LOCALE: Locale = "fa";

export { COMING_SOON, COMING_SOON_FALLBACK } from "./content/coming-soon";