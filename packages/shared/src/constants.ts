export const APP_NAME = "AzadBazar";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = "http://localhost:3000/api";

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
