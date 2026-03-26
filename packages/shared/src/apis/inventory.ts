import { http } from "../http";
import type { PaginatedResponse, StockInfo } from "../types";

function normalizeStockResponse(
  data: PaginatedResponse<StockInfo> | StockInfo[],
): PaginatedResponse<StockInfo> {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }

  return data;
}

export function getSellerStock(
  token: string,
): Promise<PaginatedResponse<StockInfo>> {
  return http
    .get<PaginatedResponse<StockInfo> | StockInfo[]>(
      "/api/inventory/seller/stock/",
      token,
    )
    .then(normalizeStockResponse);
}

export function getLowStock(token: string): Promise<PaginatedResponse<StockInfo>> {
  return http
    .get<PaginatedResponse<StockInfo> | StockInfo[]>(
      "/api/inventory/seller/stock/low/",
      token,
    )
    .then(normalizeStockResponse);
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
