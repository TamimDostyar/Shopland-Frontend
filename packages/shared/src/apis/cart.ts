import { http } from "../http";
import type { Cart } from "../types";

export function getCart(token: string): Promise<Cart> {
  return http.get<Cart>("/api/cart/", token);
}

export function addToCart(
  token: string,
  productId: string,
  quantity: number,
): Promise<Cart> {
  return http.post<Cart>("/api/cart/items/", { product_id: productId, quantity }, token);
}

export function updateCartItem(
  token: string,
  itemId: string,
  quantity: number,
): Promise<Cart> {
  return http.patch<Cart>(`/api/cart/items/${itemId}/`, { quantity }, token);
}

export function removeCartItem(token: string, itemId: string): Promise<void> {
  return http.delete(`/api/cart/items/${itemId}/`, token);
}

export function clearCart(token: string): Promise<void> {
  return http.delete("/api/cart/clear/", token);
}
