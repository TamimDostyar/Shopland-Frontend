import { http } from "../http";
import type { AuthResponse } from "../types";

export function googleAuth(credential: string): Promise<AuthResponse> {
  return http.post<AuthResponse>("/api/users/auth/google/", { credential });
}
