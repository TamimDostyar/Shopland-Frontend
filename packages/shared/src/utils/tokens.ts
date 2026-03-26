/**
 * Platform-agnostic token storage interface.
 * Web/desktop use cookies by default.
 * Mobile provides an AsyncStorage adapter via `configureTokenStorage`.
 */

export type TokenStorage = {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
};

const ACCESS_KEY = "shopland_access";
const REFRESH_KEY = "shopland_refresh";

// 7 days — long enough to cover the refresh token lifetime.
// Actual token expiry is enforced by JWT validation on the backend.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const cookieStorage: TokenStorage | null =
  typeof document !== "undefined"
    ? {
        getItem(key: string): string | null {
          const match = document.cookie.match(
            new RegExp("(?:^|;\\s*)" + key + "=([^;]*)"),
          );
          return match ? decodeURIComponent(match[1]) : null;
        },
        setItem(key: string, value: string): void {
          document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict`;
        },
        removeItem(key: string): void {
          document.cookie = `${key}=; max-age=0; path=/; SameSite=Strict`;
        },
      }
    : null;

let _storage: TokenStorage | null = cookieStorage;

export function configureTokenStorage(storage: TokenStorage): void {
  _storage = storage;
}

export async function saveTokens(
  access: string,
  refresh: string,
): Promise<void> {
  if (!_storage) return;
  await _storage.setItem(ACCESS_KEY, access);
  await _storage.setItem(REFRESH_KEY, refresh);
}

export async function getAccessToken(): Promise<string | null> {
  if (!_storage) return null;
  return _storage.getItem(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  if (!_storage) return null;
  return _storage.getItem(REFRESH_KEY);
}

export async function clearTokens(): Promise<void> {
  if (!_storage) return;
  await _storage.removeItem(ACCESS_KEY);
  await _storage.removeItem(REFRESH_KEY);
}
