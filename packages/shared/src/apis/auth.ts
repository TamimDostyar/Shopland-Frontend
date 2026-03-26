import { http } from "../http";
import type { AuthResponse, TokenRefreshResponse } from "../types";

export function login(email: string, password: string): Promise<AuthResponse> {
  return http.post<AuthResponse>("/api/users/login/", { email, password });
}

export function logout(refresh: string): Promise<void> {
  return http.post<void>("/api/users/logout/", { refresh });
}

export function refreshAccessToken(
  refresh: string,
): Promise<TokenRefreshResponse> {
  return http.post<TokenRefreshResponse>("/api/users/token/refresh/", {
    refresh,
  });
}
