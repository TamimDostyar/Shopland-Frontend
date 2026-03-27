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

export function requestPasswordReset(email: string): Promise<{ detail: string }> {
  return http.post<{ detail: string }>("/api/users/password/reset/", { email });
}

export function requestPasswordResetViaGoogle(
  credential: string,
): Promise<{ reset_token: string }> {
  return http.post<{ reset_token: string }>("/api/users/password/reset/google-verify/", {
    credential,
  });
}

export function confirmPasswordReset(
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ detail: string }> {
  return http.post<{ detail: string }>("/api/users/password/reset/confirm/", {
    token,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
}
