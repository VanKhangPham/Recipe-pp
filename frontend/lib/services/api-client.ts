/**
 * Standard API Client & Contract Layer
 * Connects Next.js Frontend to ASP.NET Core Backend (http://localhost:5194 / https://localhost:7082)
 * with CSRF token handling, credentials: "include", and Bearer JWT support.
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  status: number;
}

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
};

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5194",
  isMockMode: false,
  defaultTimeoutMs: 10000,
  mockDelayMs: 150,
};

let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/csrf`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { requestToken?: string };
    return body.requestToken ?? null;
  } catch {
    return null;
  }
}

export async function backendFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (inMemoryAccessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${inMemoryAccessToken}`);
    }

    if (method === "POST" && path.startsWith("/api/v1/auth/")) {
      const csrf = await fetchCsrfToken();
      if (csrf) {
        headers.set("X-CSRF-TOKEN", csrf);
      }
    }

    const res = await fetch(`${API_CONFIG.baseUrl}${path}`, {
      ...options,
      method,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    if (res.status === 204) {
      return {} as T;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function simulateNetworkDelay(ms: number = API_CONFIG.mockDelayMs): Promise<void> {
  if (ms <= 0) return;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
