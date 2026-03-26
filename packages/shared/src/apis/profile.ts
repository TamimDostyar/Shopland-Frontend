import { http } from "../http";
import type { Address, User } from "../types";

export function getMe(token: string): Promise<User> {
  return http.get<User>("/api/users/me/", token);
}

export function updateMe(
  token: string,
  data: Partial<Pick<User, "first_name" | "last_name" | "father_name">>,
): Promise<User> {
  return http.patch<User>("/api/users/me/", data, token);
}

export function listAddresses(token: string): Promise<Address[]> {
  return http.get<Address[]>("/api/users/me/addresses/", token);
}

export function createAddress(
  token: string,
  data: Omit<Address, "id" | "is_default"> & { is_default?: boolean },
): Promise<Address> {
  return http.post<Address>("/api/users/me/addresses/", data, token);
}

export function updateAddress(
  token: string,
  id: string,
  data: Partial<Omit<Address, "id">>,
): Promise<Address> {
  return http.patch<Address>(`/api/users/me/addresses/${id}/`, data, token);
}

export function deleteAddress(token: string, id: string): Promise<void> {
  return http.delete(`/api/users/me/addresses/${id}/`, token);
}
