import { API_CONFIG } from "./api-client";

export interface SystemInfo {
  service: string;
  apiVersion: string;
}

export type Readiness = "checking" | "healthy" | "unhealthy" | "unknown";

export const readinessLabel: Record<Readiness, string> = {
  checking: "Đang kiểm tra PostgreSQL…",
  healthy: "PostgreSQL sẵn sàng",
  unhealthy: "PostgreSQL chưa sẵn sàng",
  unknown: "Chưa xác minh được trạng thái PostgreSQL",
};



export async function checkReadiness(signal: AbortSignal): Promise<Readiness> {
  try {
    const response = await fetch(API_CONFIG.baseUrl + "/health/ready", {
      cache: "no-store",
      signal,
    });
    const status = (await response.text()).trim();
    if (response.ok && status === "Healthy") return "healthy";
    if (response.status === 503 && status === "Unhealthy") return "unhealthy";
    return "unknown";
  } catch {
    return "unknown";
  }
}
