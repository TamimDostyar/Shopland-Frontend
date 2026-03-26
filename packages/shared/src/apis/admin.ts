import { http } from "../http";
import type { AdminSeller, AdminUser, SellerStatus } from "../types";

// ─── Sellers ──────────────────────────────────────────────────────────────────

export function listSellers(
  token: string,
  status?: SellerStatus,
): Promise<AdminSeller[]> {
  const qs = status ? `?status=${status}` : "";
  return http.get<AdminSeller[]>(`/api/users/admin/sellers/${qs}`, token);
}

export function getSeller(token: string, userId: string): Promise<AdminSeller> {
  return http.get<AdminSeller>(`/api/users/admin/sellers/${userId}/`, token);
}

export function approveSeller(
  token: string,
  userId: string,
): Promise<{ detail: string }> {
  return http.post<{ detail: string }>(
    `/api/users/admin/sellers/${userId}/approve/`,
    {},
    token,
  );
}

export function rejectSeller(
  token: string,
  userId: string,
  reason: string,
): Promise<{ detail: string }> {
  return http.post<{ detail: string }>(
    `/api/users/admin/sellers/${userId}/reject/`,
    { reason },
    token,
  );
}

// ─── ID verification ──────────────────────────────────────────────────────────

export function listPendingIds(token: string): Promise<AdminUser[]> {
  return http.get<AdminUser[]>(
    "/api/users/admin/users/pending-id-review/",
    token,
  );
}

export function approveUserId(
  token: string,
  userId: string,
): Promise<{ detail: string }> {
  return http.post<{ detail: string }>(
    `/api/users/admin/users/${userId}/verify-id/`,
    {},
    token,
  );
}

export function rejectUserId(
  token: string,
  userId: string,
  reason: string,
): Promise<{ detail: string }> {
  return http.post<{ detail: string }>(
    `/api/users/admin/users/${userId}/reject-id/`,
    { reason },
    token,
  );
}
