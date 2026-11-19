"use client";

import { useEffect, useState } from "react";
import { API_CONFIG, backendFetch } from "@/lib/services/api-client";
import { checkReadiness, readinessLabel, type Readiness, type SystemInfo } from "@/lib/services/system-status";

export default function AdminSettingsPage() {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ info: SystemInfo | null; readiness: Readiness; checkedAt: Date } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(API_CONFIG.defaultTimeoutMs)]);
    void Promise.all([
      backendFetch<SystemInfo>("/api/v1/system", { cache: "no-store", signal }),
      checkReadiness(signal),
    ]).then(([info, readiness]) => {
      if (!controller.signal.aborted) setResult({ info, readiness, checkedAt: new Date() });
    });
    return () => controller.abort();
  }, [revision]);

  return (
    <section className="space-y-5 p-6">
      <h1 className="text-3xl font-bold">Trạng thái hệ thống</h1>
      <button className="rounded-xl border border-outline-variant px-4 py-2 disabled:opacity-50" disabled={!result} onClick={() => {
        setResult(null);
        setRevision((value) => value + 1);
      }}>Kiểm tra lại</button>
      <div role="status" className="rounded-xl border border-outline-variant p-4">
        {result ? (
          <dl className="space-y-3">
            <div><dt className="font-semibold">Dịch vụ</dt><dd>{result.info?.service ?? "Chưa lấy được thông tin API"}</dd></div>
            <div><dt className="font-semibold">Phiên bản API</dt><dd>{result.info?.apiVersion ?? "—"}</dd></div>
            <div><dt className="font-semibold">Cơ sở dữ liệu</dt><dd>{readinessLabel[result.readiness]}</dd></div>
            <div><dt className="font-semibold">Kiểm tra lúc</dt><dd>{result.checkedAt.toLocaleString("vi-VN")}</dd></div>
          </dl>
        ) : <p>Đang kiểm tra hệ thống…</p>}
      </div>
    </section>
  );
}
