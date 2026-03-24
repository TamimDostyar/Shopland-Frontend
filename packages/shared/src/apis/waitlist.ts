import { API_BASE_URL } from "../constants";
import type { WaitlistResponse } from "../types";

export async function joinWaitlist(
  email: string,
  source: string = "coming-soon",
): Promise<WaitlistResponse> {
  const res = await fetch(`${API_BASE_URL}/users/waitlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });

  const data = (await res.json()) as WaitlistResponse;

  if (!res.ok) {
    throw new Error(data.detail ?? "Request failed");
  }

  return data;
}
