import { http } from "../http";
import type { PaginatedResponse, StockInfo } from "../types";

export function getSellerStock(
  token: string,
): Promise<PaginatedResponse<StockInfo>> {
  return http.get<PaginatedResponse<StockInfo>>(
    "/api/inventory/seller/stock/",
    token,
  );
}

export function getLowStock(token: string): Promise<PaginatedResponse<StockInfo>> {
  return http.get<PaginatedResponse<StockInfo>>(
    "/api/inventory/seller/stock/low/",
    token,
  );
}

export function restockProduct(
  token: string,
  productId: string,
  quantity: number,
): Promise<StockInfo> {
  return http.post<StockInfo>(
    `/api/inventory/seller/stock/${productId}/restock/`,
    { quantity },
    token,
  );
}

export function adjustStock(
  token: string,
  productId: string,
  quantity: number,
  reason?: string,
): Promise<StockInfo> {
  return http.post<StockInfo>(
    `/api/inventory/seller/stock/${productId}/adjust/`,
    { quantity, reason },
    token,
  );
}
