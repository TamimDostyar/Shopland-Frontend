import { http } from "../http";
import type {
  AuthResponse,
  BuyerRegistrationData,
  SellerRegistrationData,
} from "../types";

function buildBuyerForm(data: BuyerRegistrationData): FormData {
  const fd = new FormData();
  fd.append("email", data.email);
  fd.append("password", data.password);
  fd.append("confirm_password", data.confirm_password);
  fd.append("first_name", data.first_name);
  fd.append("last_name", data.last_name);
  fd.append("father_name", data.father_name ?? "");
  fd.append("phone_number", data.phone_number);
  if (data.national_id) fd.append("national_id", data.national_id);
  if (data.national_id_photo) fd.append("national_id_photo", data.national_id_photo);
  if (data.profile_photo) fd.append("profile_photo", data.profile_photo);
  fd.append("date_of_birth", data.date_of_birth);
  fd.append("address_label", data.address_label);
  fd.append("address_full_name", data.address_full_name);
  fd.append("address_phone_number", data.address_phone_number);
  fd.append("address_street", data.address_street);
  fd.append("address_district", data.address_district);
  fd.append("address_city", data.address_city);
  fd.append("address_province", data.address_province);
  if (data.address_nearby_landmark)
    fd.append("address_nearby_landmark", data.address_nearby_landmark);
  return fd;
}

function buildSellerForm(data: SellerRegistrationData): FormData {
  const fd = new FormData();
  fd.append("email", data.email);
  fd.append("password", data.password);
  fd.append("confirm_password", data.confirm_password);
  fd.append("first_name", data.first_name);
  fd.append("last_name", data.last_name);
  fd.append("father_name", data.father_name ?? "");
  fd.append("phone_number", data.phone_number);
  if (data.national_id) fd.append("national_id", data.national_id);
  if (data.national_id_photo) fd.append("national_id_photo", data.national_id_photo);
  if (data.profile_photo) fd.append("profile_photo", data.profile_photo);
  fd.append("date_of_birth", data.date_of_birth);
  fd.append("shop_name", data.shop_name);
  fd.append("shop_category", data.shop_category?.trim() || "Any");
  if (data.business_description)
    fd.append("business_description", data.business_description);
  fd.append("business_phone", data.business_phone);
  fd.append("shop_address_street", data.shop_address_street);
  fd.append("shop_address_district", data.shop_address_district);
  fd.append("shop_address_city", data.shop_address_city);
  fd.append("shop_address_province", data.shop_address_province);
  return fd;
}

export function registerBuyer(
  data: BuyerRegistrationData,
): Promise<AuthResponse> {
  return http.postForm<AuthResponse>(
    "/api/users/register/buyer/",
    buildBuyerForm(data),
  );
}

export function registerSeller(
  data: SellerRegistrationData,
): Promise<AuthResponse> {
  return http.postForm<AuthResponse>(
    "/api/users/register/seller/",
    buildSellerForm(data),
  );
}
