export const APP_NAME = "Shopland";
export const APP_VERSION = "1.0.0";

const _meta = import.meta as unknown as { env?: Record<string, string> };

export const PRODUCTION: boolean = _meta.env?.MODE === "production";

export const API_BASE_URL: string =
  _meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080";


    
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const CURRENCY = {
  DEFAULT: "USD",
  SYMBOLS: { USD: "$", EUR: "€", GBP: "£", IRR: "﷼" },
} as const;

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT: (id: string) => `/products/${id}`,
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

import type { Locale, LocaleMeta } from "./types";

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { label: "English", dir: "ltr" },
  fa: { label: "دری", dir: "rtl" },
  ps: { label: "پښتو", dir: "rtl" },
} as const;

export const DEFAULT_LOCALE: Locale = "fa";

export { COMING_SOON, COMING_SOON_FALLBACK } from "./content/coming-soon";
