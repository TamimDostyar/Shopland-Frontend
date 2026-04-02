import { http } from "../http";
import type { VerificationStatus } from "../types";

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
