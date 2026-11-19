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
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5194",
  isMockMode: false,
  defaultTimeoutMs: 10000,
  mockDelayMs: 150,
  restoreSessionOnStartup: process.env.NEXT_PUBLIC_RESTORE_SESSION === "true",
};

let inMemoryAccessToken: string | null = null;
let sessionVersion = 0;
export interface BackendSession {
  accessToken: string;
  user: { id: string; email: string; displayName: string; roles?: string[] };
}
const sessionListeners = new Set<(session: BackendSession | null) => void>();
let refreshFlight: { version: number; promise: Promise<string | null> } | null = null;
let logoutFlight: Promise<void> | null = null;

export function subscribeToSession(listener: (session: BackendSession | null) => void) {
  sessionListeners.add(listener);
  return () => { sessionListeners.delete(listener); };
}

export function setAccessToken(token: string | null) {
  if (token === inMemoryAccessToken) return;
  sessionVersion++;
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export async function restoreSession(): Promise<BackendSession | null> {
  if (!API_CONFIG.restoreSessionOnStartup) {
    setAccessToken(null);
    return null;
  }
  return backendFetch<BackendSession>("/api/v1/auth/refresh", { method: "POST" });
}

async function refreshAccessToken(version: number): Promise<string | null> {
  if (refreshFlight?.version === version) return refreshFlight.promise;
  const promise = (async () => {
    try {
      const csrf = await fetchCsrfToken();
      if (!csrf || sessionVersion !== version) return null;
      const response = await fetch(API_CONFIG.baseUrl + "/api/v1/auth/refresh", {
        method: "POST", credentials: "include", cache: "no-store",
        headers: { "X-CSRF-TOKEN": csrf }, signal: AbortSignal.timeout(30000),
      });
      if (sessionVersion !== version) return null;
      if (!response.ok) {
        if (response.status === 401) {
          setAccessToken(null);
          sessionListeners.forEach((listener) => listener(null));
        }
        return null;
      }
      const session = await response.json() as BackendSession;
      if (sessionVersion !== version || !session.accessToken || !session.user?.id) return null;
      // Token rotation stays within the same logical session.
      inMemoryAccessToken = session.accessToken;
      sessionListeners.forEach((listener) => listener(session));
      return session.accessToken;
    } catch { return null; }
  })();
  refreshFlight = { version, promise };
  try { return await promise; }
  finally { if (refreshFlight?.promise === promise) refreshFlight = null; }
}

export async function waitForSessionRequests() {
  await logoutFlight;
  await refreshFlight?.promise;
}

export function endSession(): Promise<void> {
  if (logoutFlight) return logoutFlight;
  const rotating = refreshFlight?.promise;
  setAccessToken(null);
  // Delete/revoke the final refresh cookie after any in-flight rotation finishes.
  const promise = (async () => {
    await rotating;
    await backendFetch("/api/v1/auth/logout", { method: "POST" });
  })();
  logoutFlight = promise;
  void promise.finally(() => { if (logoutFlight === promise) logoutFlight = null; });
  return promise;
}

async function waitForRefresh(promise: Promise<string | null>, signal: AbortSignal): Promise<string | null> {
  signal.throwIfAborted();
  let onAbort = () => {};
  const aborted = new Promise<never>((_, reject) => {
    onAbort = () => reject(signal.reason);
    signal.addEventListener("abort", onAbort, { once: true });
  });
  try { return await Promise.race([promise, aborted]); }
  finally { signal.removeEventListener("abort", onAbort); }
}

export async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const version = sessionVersion;
  const originalToken = inMemoryAccessToken;
  const headers = new Headers(options.headers);
  const managedAuthorization = !headers.has("Authorization");
  if (managedAuthorization && originalToken) headers.set("Authorization", `Bearer ${originalToken}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const signal = options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000);
  const send = () => fetch(API_CONFIG.baseUrl + path, { ...options, headers, signal, credentials: "include" });
  const response = await send();
  if (response.status !== 401 || !originalToken || !managedAuthorization || path.startsWith("/api/v1/auth/") || sessionVersion !== version || signal.aborted) return response;
  const refreshed = inMemoryAccessToken !== originalToken ? inMemoryAccessToken : await waitForRefresh(refreshAccessToken(version), signal);
  if (!refreshed || sessionVersion !== version) return response;
  signal.throwIfAborted();
  headers.set("Authorization", `Bearer ${refreshed}`);
  // A 401 was rejected by authentication before the protected action ran. Retry once.
  return send();
}

export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/csrf`, {
      method: "GET",
      credentials: "include",
      signal: AbortSignal.timeout(30000),
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

    if (method === "POST" && path.startsWith("/api/v1/auth/")) {
      const csrf = await fetchCsrfToken();
      if (csrf) {
        headers.set("X-CSRF-TOKEN", csrf);
      }
    }

    const res = await authenticatedFetch(path, {
      ...options,
      method,
      headers,
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
