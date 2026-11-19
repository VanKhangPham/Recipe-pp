"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { API_CONFIG, backendFetch } from "@/lib/services/api-client";

import { checkReadiness, readinessLabel, type Readiness, type SystemInfo } from "@/lib/services/system-status";

interface Analytics {
  totalUsers: number;
  totalRecipes: number;
  viewsInPeriod: number;
  favoritesInPeriod: number;
  recipeStatistics: { status: string; count: number }[];
  mostViewed: { recipeId: string; title: string; count: number }[];
}

const numberFormat = new Intl.NumberFormat("vi-VN");

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [days, setDays] = useState(7);
  const [refresh, setRefresh] = useState(0);
  const [readiness, setReadiness] = useState<Readiness>("checking");
  const [system, setSystem] = useState<SystemInfo | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let activeProbe = false;

    async function probe() {
      if (activeProbe) return;
      activeProbe = true;
      const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(API_CONFIG.defaultTimeoutMs)]);
      const [ready, info] = await Promise.all([
        checkReadiness(signal),
        backendFetch<SystemInfo>("/api/v1/system", { cache: "no-store", signal }),
      ]);
      activeProbe = false;
      if (controller.signal.aborted) return;
      setReadiness(ready);
      setSystem(info);
      setCheckedAt(new Date());
    }

    void probe();
    const timer = window.setInterval(probe, 30_000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [refresh]);

  useEffect(() => {
    const controller = new AbortController();
    const to = new Date();
    const from = new Date(to.getTime() - days * 86_400_000);
    const query = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]);

    void backendFetch<Analytics>("/api/v1/admin/analytics?" + query, {
      cache: "no-store",
      signal,
    }).then((data) => {
      if (controller.signal.aborted) return;
      setAnalytics(data);
      setLoading(false);
    });

    return () => controller.abort();
  }, [days, refresh, user?.id]);

  const currentAnalytics = loading || user?.role !== "admin" ? null : analytics;
  const metrics = [
    { title: "Người dùng", value: currentAnalytics?.totalUsers },
    { title: "Công thức", value: currentAnalytics?.totalRecipes },
    { title: "Lượt xem trong kỳ", value: currentAnalytics?.viewsInPeriod },
    { title: "Lượt yêu thích trong kỳ", value: currentAnalytics?.favoritesInPeriod },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold">Tổng quan quản trị</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2" role="status">
            <span className={readiness === "healthy"
              ? "rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container"
              : "rounded-full bg-surface-container px-3 py-1 text-on-surface"}>
              {readinessLabel[readiness]}
            </span>
            {system && <span>{system.service} · API {system.apiVersion}</span>}
            {checkedAt && <span>Kiểm tra lúc {checkedAt.toLocaleTimeString("vi-VN")}</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="analytics-period">Khoảng thời gian</label>
          <select
            id="analytics-period"
            className="rounded-xl bg-surface-container px-3 py-2"
            value={days}
            onChange={(event) => {
              setLoading(true);
              setDays(Number(event.target.value));
            }}
          >
            <option value={7}>7 ngày</option>
            <option value={30}>30 ngày</option>
            <option value={90}>90 ngày</option>
          </select>
          <button
            type="button"
            className="rounded-xl bg-primary px-4 py-2 text-on-primary"
            onClick={() => {
              setLoading(true);
              setReadiness("checking");
              setRefresh((value) => value + 1);
            }}
          >
            Làm mới
          </button>
        </div>
      </header>

      <nav className="flex flex-wrap gap-4 text-primary">
        <Link href="/admin/recipes">Quản lý công thức</Link>
        <Link href="/admin/users">Quản lý người dùng</Link>
        <Link href="/admin/reports">Kiểm duyệt đánh giá</Link>
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ title, value }) => (
          <div key={title} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <p className="text-on-surface-variant">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value === undefined ? "—" : numberFormat.format(value)}</p>
          </div>
        ))}
      </div>
      {loading && <p role="status">Đang tải số liệu quản trị…</p>}
      {!loading && !analytics && (
        <p role="status">Chưa tải được số liệu. Hãy kiểm tra kết nối API và đăng nhập bằng tài khoản Admin.</p>
      )}

      {currentAnalytics && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <h2 className="font-title-md text-title-md font-semibold">Trạng thái công thức</h2>
            {currentAnalytics.recipeStatistics.length === 0 && <p>Chưa có công thức.</p>}
            <ul className="mt-3 space-y-2">
              {currentAnalytics.recipeStatistics.map(({ status, count }) => (
                <li key={status} className="flex justify-between gap-4">
                  <span>{status}</span><span>{numberFormat.format(count)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <h2 className="font-title-md text-title-md font-semibold">Công thức được xem nhiều nhất</h2>
            {currentAnalytics.mostViewed.length === 0 && <p>Chưa có lượt xem trong kỳ.</p>}
            <ol className="mt-3 space-y-2">
              {currentAnalytics.mostViewed.map(({ recipeId, title, count }) => (
                <li key={recipeId} className="flex justify-between gap-4">
                  <span>{title}</span>
                  <span>{numberFormat.format(count)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
