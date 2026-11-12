/**
 * Standard API Client & Contract Layer
 * Defines request/response shapes, error models, and standard async handling.
 * Currently runs via mock adapters with simulated network latencies,
 * ready to switch to live HTTP endpoints by configuring NEXT_PUBLIC_API_URL.
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
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  isMockMode: true, // Set to false when backend API is available
  defaultTimeoutMs: 10000,
  mockDelayMs: 250, // Gentle latency for realistic UI state testing
};

/**
 * Simulate network delay for mock adapters to test loading skeletons and spinners
 */
export async function simulateNetworkDelay(ms: number = API_CONFIG.mockDelayMs): Promise<void> {
  if (ms <= 0) return;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
