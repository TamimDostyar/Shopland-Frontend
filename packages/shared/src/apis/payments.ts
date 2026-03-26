import { http } from "../http";
import type {
  SellerEarning,
  EarningsSummary,
  Settlement,
  PaginatedResponse,
} from "../types";

export function getEarnings(
  token: string,
  filters: Record<string, unknown> = {},
): Promise<PaginatedResponse<SellerEarning>> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null) params.set(k, String(v));
  }
  const q = params.toString() ? `?${params.toString()}` : "";
  return http.get<PaginatedResponse<SellerEarning>>(
    `/api/payments/seller/earnings/${q}`,
    token,
  );
}

export function getEarningsSummary(token: string): Promise<EarningsSummary> {
  return http.get<EarningsSummary>(
    "/api/payments/seller/earnings/summary/",
    token,
  );
}

export function getSettlements(
  token: string,
): Promise<PaginatedResponse<Settlement>> {
  return http.get<PaginatedResponse<Settlement>>(
    "/api/payments/seller/settlements/",
    token,
  );
}
