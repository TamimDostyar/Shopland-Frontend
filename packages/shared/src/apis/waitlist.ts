import { API_BASE_URL } from "../constants";
import type { WaitlistResponse } from "../types";

export async function joinWaitlist(
  name: string,
  username: string,
): Promise<WaitlistResponse> {
  const res = await fetch(`${API_BASE_URL}/api/users/waitlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username }),
  });

  const data = (await res.json()) as WaitlistResponse;

  if (!res.ok) {
    throw new Error(data.detail ?? "Request failed");
  }

  return data;
}
