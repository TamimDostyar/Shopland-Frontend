import { http } from "../http";
import type {
  Product,
  ProductColor,
  Category,
  Brand,
  PaginatedResponse,
  ProductFilters,
} from "../types";

function buildQuery(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const q = params.toString();
  return q ? `?${q}` : "";
}

export function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<Product>> {
  return http.get<PaginatedResponse<Product>>(
    `/api/catalog/products/${buildQuery(filters as Record<string, unknown>)}`,
  );
}

export function getProduct(slug: string): Promise<Product> {
  return http.get<Product>(`/api/catalog/products/${slug}/`);
}

export function getCategories(): Promise<Category[]> {
  return http.get<Category[]>("/api/catalog/categories/");
}

export function getCategory(slug: string): Promise<Category> {
  return http.get<Category>(`/api/catalog/categories/${slug}/`);
}

export function getBrands(): Promise<Brand[]> {
  return http.get<Brand[]>("/api/catalog/brands/");
}

export function getColors(): Promise<ProductColor[]> {
  return http.get<ProductColor[]>("/api/catalog/colors/");
}

export function searchProducts(
  q: string,
  filters: Omit<ProductFilters, "q"> = {},
): Promise<PaginatedResponse<Product>> {
  return http.get<PaginatedResponse<Product>>(
    `/api/catalog/search/${buildQuery({ q, ...filters } as Record<string, unknown>)}`,
  );
}

export function getSearchSuggestions(q: string): Promise<{
  suggestions: { type: string; text: string; slug: string }[];
}> {
  return http.get(`/api/catalog/search/suggest/?q=${encodeURIComponent(q)}`);
}

// Seller product management
export function getSellerProducts(
  token: string,
  filters: Record<string, unknown> = {},
): Promise<PaginatedResponse<Product>> {
  return http.get<PaginatedResponse<Product>>(
    `/api/catalog/seller/products/${buildQuery(filters)}`,
    token,
  );
}

export function createProduct(
  token: string,
  data: Record<string, unknown>,
): Promise<Product> {
  return http.post<Product>("/api/catalog/seller/products/", data, token);
}

export function updateProduct(
  token: string,
  id: string,
  data: Record<string, unknown>,
): Promise<Product> {
  return http.patch<Product>(`/api/catalog/seller/products/${id}/`, data, token);
}

export function deleteProduct(token: string, id: string): Promise<void> {
  return http.delete(`/api/catalog/seller/products/${id}/`, token);
}

export function uploadProductImage(
  token: string,
  productId: string,
  formData: FormData,
): Promise<unknown> {
  return http.postForm(
    `/api/catalog/seller/products/${productId}/images/`,
    formData,
    token,
  );
}

export function deleteProductImage(
  token: string,
  productId: string,
  imageId: string,
): Promise<void> {
  return http.delete(
    `/api/catalog/seller/products/${productId}/images/${imageId}/`,
    token,
  );
}

// Admin product management
export function getPendingProducts(
  token: string,
): Promise<PaginatedResponse<Product>> {
  return http.get<PaginatedResponse<Product>>(
    "/api/catalog/admin/products/pending/",
    token,
  );
}

export function approveProduct(token: string, id: string): Promise<unknown> {
  return http.post(`/api/catalog/admin/products/${id}/approve/`, {}, token);
}

export function rejectProduct(
  token: string,
  id: string,
  reason: string,
): Promise<unknown> {
  return http.post(
    `/api/catalog/admin/products/${id}/reject/`,
    { reason },
    token,
  );
}
