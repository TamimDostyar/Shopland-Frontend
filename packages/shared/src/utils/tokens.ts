/**
 * Platform-agnostic token storage interface.
 * Web/desktop use localStorage by default.
 * Mobile provides an AsyncStorage adapter via `configureTokenStorage`.
 */

export type TokenStorage = {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
};

const ACCESS_KEY = "shopland_access";
const REFRESH_KEY = "shopland_refresh";

let _storage: TokenStorage | null =
  typeof localStorage !== "undefined" ? localStorage : null;

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
