import { http } from "../http";
import type { VerificationStatus } from "../types";

type VerifyPhoneResponse = {
  detail: string;
  verification_status: VerificationStatus;
};

type VerifyEmailResponse = {
  detail: string;
  verification_status: VerificationStatus;
};

type ResendResponse = { detail: string };

export function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  return http.post<VerifyEmailResponse>("/api/users/verify-email/", { token });
}

export function resendEmailVerification(accessToken: string): Promise<ResendResponse> {
  return http.post<ResendResponse>("/api/users/verify-email/resend/", {}, accessToken);
}

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
  accessToken: string,
): Promise<ResendResponse> {
  return http.post<ResendResponse>("/api/users/verify-phone/resend/", {}, accessToken);
}
