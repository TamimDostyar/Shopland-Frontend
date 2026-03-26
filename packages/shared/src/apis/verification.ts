import { http } from "../http";
import type { VerificationStatus } from "../types";

type VerifyPhoneResponse = {
  detail: string;
  verification_status: VerificationStatus;
};

type DetailResponse = { detail: string };

export function verifyPhone(
  phone_number: string,
  code: string,
): Promise<VerifyPhoneResponse> {
  return http.post<VerifyPhoneResponse>("/api/users/verify-phone/", {
    phone_number,
    code,
  });
}

export function resendPhoneCode(
  phone_number: string,
): Promise<DetailResponse> {
  return http.post<DetailResponse>("/api/users/verify-phone/resend/", {
    phone_number,
  });
}

export function verifyEmail(
  token: string,
): Promise<VerifyPhoneResponse> {
  return http.get<VerifyPhoneResponse>(
    `/api/users/verify-email/?token=${encodeURIComponent(token)}`,
  );
}

export function resendEmailVerification(
  accessToken: string,
): Promise<DetailResponse> {
  return http.post<DetailResponse>(
    "/api/users/verify-email/resend/",
    {},
    accessToken,
  );
}
