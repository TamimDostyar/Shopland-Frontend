import { http } from "../http";
import type { Order, PaginatedResponse } from "../types";

function normalizeOrderListResponse(
  data: PaginatedResponse<Order> | Order[],
): PaginatedResponse<Order> {
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

// Buyer endpoints
export async function getMyOrders(
  token: string,
  status?: string,
): Promise<PaginatedResponse<Order>> {
  const q = status ? `?status=${status}` : "";
  const data = await http.get<PaginatedResponse<Order> | Order[]>(
    `/api/orders/my-orders/${q}`,
    token,
  );
  return normalizeOrderListResponse(data);
}

export function getMyOrder(token: string, orderNumber: string): Promise<Order> {
  return http.get<Order>(`/api/orders/my-orders/${orderNumber}/`, token);
}

export function checkout(
  token: string,
  data: {
    delivery_address_id: string;
    delivery_phone: string;
    buyer_notes?: string;
  },
): Promise<Order> {
  return http.post<Order>("/api/orders/checkout/", data, token);
}

export function cancelOrder(
  token: string,
  orderNumber: string,
  reason?: string,
): Promise<Order> {
  return http.post<Order>(
    `/api/orders/my-orders/${orderNumber}/cancel/`,
    { reason },
    token,
  );
}

export function confirmDelivery(
  token: string,
  orderNumber: string,
): Promise<Order> {
  return http.post<Order>(
    `/api/orders/my-orders/${orderNumber}/confirm/`,
    {},
    token,
  );
}

// Seller endpoints
export async function getSellerOrders(
  token: string,
  status?: string,
): Promise<PaginatedResponse<Order>> {
  const q = status ? `?status=${status}` : "";
  const data = await http.get<PaginatedResponse<Order> | Order[]>(
    `/api/orders/seller/orders/${q}`,
    token,
  );
  return normalizeOrderListResponse(data);
}

export function getSellerOrder(
  token: string,
  orderNumber: string,
): Promise<Order> {
  return http.get<Order>(`/api/orders/seller/orders/${orderNumber}/`, token);
}

export function acceptOrder(
  token: string,
  orderNumber: string,
): Promise<Order> {
  return http.post<Order>(
    `/api/orders/seller/orders/${orderNumber}/accept/`,
    {},
    token,
  );
}

export function rejectOrder(
  token: string,
  orderNumber: string,
  reason: string,
): Promise<Order> {
  return http.post<Order>(
    `/api/orders/seller/orders/${orderNumber}/reject/`,
    { reason },
    token,
  );
}

export function markProcessing(
  token: string,
  orderNumber: string,
): Promise<Order> {
  return http.post<Order>(
    `/api/orders/seller/orders/${orderNumber}/processing/`,
    {},
    token,
  );
}

export function markReady(token: string, orderNumber: string): Promise<Order> {
  return http.post<Order>(
    `/api/orders/seller/orders/${orderNumber}/ready/`,
    {},
    token,
  );
}
