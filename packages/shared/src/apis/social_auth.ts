import { http } from "../http";
import type { AuthResponse } from "../types";

export function googleAuth(credential: string): Promise<AuthResponse> {
  return http.post<AuthResponse>("/api/users/auth/google/", { credential });
}

export function getTelegramLink(accessToken: string): Promise<{ link: string; bot_username: string }> {
  return http.get<{ link: string; bot_username: string }>(
    "/api/users/telegram-link/",
    accessToken,
  );
}
