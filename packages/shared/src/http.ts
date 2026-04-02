let _baseUrl = "http://localhost:8000";

export function setApiBaseUrl(url: string): void {
  _baseUrl = url.replace(/\/$/, "");
}

export function getApiBaseUrl(): string {
  return _baseUrl;
}

export class ApiError extends Error {
  readonly status: number;
  readonly data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    const detail =
      (data["detail"] as string) ??
      (data["error"] as string) ??
      (Array.isArray(data["non_field_errors"]) && data["non_field_errors"].length > 0
        ? String(data["non_field_errors"][0])
        : undefined) ??
      Object.values(data).flat().join(" ") ??
      "Request failed";
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(
  method: string,
  path: string,
  options?: {
    token?: string;
    body?: unknown;
    formData?: FormData;
  },
): Promise<unknown> {
  const headers: Record<string, string> = {};
  if (options?.token) headers["Authorization"] = `Bearer ${options.token}`;
  if (options?.body && !options.formData)
    headers["Content-Type"] = "application/json";

  const res = await fetch(`${_baseUrl}${path}`, {
    method,
    headers,
    body: options?.formData
      ? options.formData
      : options?.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (res.status === 204) return undefined;

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    // non-JSON response (e.g. HTML error page from server)
  }

  const hasExplicitErrorPayload =
    typeof data["error"] === "string" ||
    (Array.isArray(data["non_field_errors"]) && data["non_field_errors"].length > 0);

  if (!res.ok || hasExplicitErrorPayload) {
    throw new ApiError(res.status, data);
  }

  return data;
}

export const http = {
  get: <T>(path: string, token?: string) =>
    request("GET", path, { token }) as Promise<T>,

  post: <T>(path: string, body: unknown, token?: string) =>
    request("POST", path, { token, body }) as Promise<T>,

  patch: <T>(path: string, body: unknown, token?: string) =>
    request("PATCH", path, { token, body }) as Promise<T>,

  delete: <T = void>(path: string, token?: string) =>
    request("DELETE", path, { token }) as Promise<T>,

  postForm: <T>(path: string, formData: FormData, token?: string) =>
    request("POST", path, { token, formData }) as Promise<T>,

  patchForm: <T>(path: string, formData: FormData, token?: string) =>
    request("PATCH", path, { token, formData }) as Promise<T>,
};
