import { ApiError, http } from "../http";
import type { AuthResponse, TokenRefreshResponse } from "../types";

function isAuthResponse(data: Record<string, unknown>): data is AuthResponse {
  return (
    typeof data.access === "string" &&
    typeof data.refresh === "string" &&
    typeof data.user === "object" &&
    data.user !== null
  );
}

function extractLoginErrorMessage(data: Record<string, unknown>): string {
  if (typeof data.detail === "string" && data.detail.trim().length > 0) {
    return data.detail;
  }

  if (typeof data.error === "string" && data.error.trim().length > 0) {
    return data.error;
  }

  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return String(data.non_field_errors[0]);
  }

  return "Login failed.";
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await http.post<Record<string, unknown>>("/api/users/login/", {
    email,
    password,
  });

  if (isAuthResponse(data)) {
    return data;
  }

  throw new ApiError(400, {
    ...data,
    detail: extractLoginErrorMessage(data),
  });
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
