export const APP_NAME = "Shopland";
export const APP_VERSION = "1.0.0";

const _meta = import.meta as unknown as { env?: Record<string, string> };

export const API_BASE_URL: string =
  _meta.env?.MODE === "LOCAL"
    ? "http://localhost:8000"
    : (_meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000");

import type { Locale, LocaleMeta } from "./types";

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { label: "English", dir: "ltr" },
  fa: { label: "دری", dir: "rtl" },
  ps: { label: "پښتو", dir: "rtl" },
} as const;

export const DEFAULT_LOCALE: Locale = "fa";

export { COMING_SOON, COMING_SOON_FALLBACK } from "./content/coming-soon";
