import { http } from "../http";
import type { Order, PaginatedResponse } from "../types";

// Buyer endpoints
export function getMyOrders(
  token: string,
  status?: string,
): Promise<PaginatedResponse<Order>> {
  const q = status ? `?status=${status}` : "";
  return http.get<PaginatedResponse<Order>>(`/api/orders/my-orders/${q}`, token);
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
export function getSellerOrders(
  token: string,
  status?: string,
): Promise<PaginatedResponse<Order>> {
  const q = status ? `?status=${status}` : "";
  return http.get<PaginatedResponse<Order>>(
    `/api/orders/seller/orders/${q}`,
    token,
  );
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
