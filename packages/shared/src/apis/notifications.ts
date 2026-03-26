import { http } from "../http";
import type { Notification, PaginatedResponse } from "../types";

export function getNotifications(
  token: string,
): Promise<PaginatedResponse<Notification>> {
  return http.get<PaginatedResponse<Notification>>(
    "/api/notifications/",
    token,
  );
}

export function markNotificationRead(
  token: string,
  id: string,
): Promise<Notification> {
  return http.patch<Notification>(
    `/api/notifications/${id}/read/`,
    {},
    token,
  );
}

export function markAllRead(token: string): Promise<void> {
  return http.post<void>("/api/notifications/read-all/", {}, token);
}
