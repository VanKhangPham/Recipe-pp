"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { useRecipes } from "@/lib/context/recipes-context";
import { planningRequest } from "@/lib/services/planning-api";
import type { BackendRecipeSummary } from "@/lib/services/recipe-service";

interface Page { items: BackendRecipeSummary[]; totalCount: number; totalPages: number }
const control = "rounded-xl border border-outline-variant p-3 disabled:opacity-50";
const labels: Record<string, string> = { Draft: "Bản nháp", Published: "Đã xuất bản", Archived: "Đã lưu trữ" };

export default function MyRecipesPage() {
  const { user, isRestoringSession } = useAuth();
  return <><Navbar /><main className="mx-auto max-w-5xl space-y-5 p-6">
    <h1 className="text-3xl font-bold">Công thức của tôi</h1>
    {isRestoringSession ? <p role="status">Đang kiểm tra đăng nhập…</p> : !user ? <Link href="/login" className="underline">Đăng nhập để quản lý công thức</Link> : <OwnRecipes key={user.id} />}
  </main><Footer /></>;
}
function OwnRecipes() {
  const { refreshRecipes } = useRecipes();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<Page | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (status) query.set("status", status);
    planningRequest<Page>("users/me/recipes?" + query, { signal: controller.signal }).then((result) => {
      if (!controller.signal.aborted) setData(result);
    }).catch((cause) => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Không tải được công thức.");
    });
    return () => controller.abort();
  }, [page, status, revision]);
  function refresh(nextPage = page) {
    setData(null); setError(""); setPage(nextPage); setRevision((value) => value + 1);
  }
  async function archive(recipe: BackendRecipeSummary) {
    if (lock.current || !window.confirm('Lưu trữ công thức "' + recipe.title + '"? Công thức sẽ ngừng xuất hiện trong danh sách công khai.')) return;
    lock.current = true; setBusy(true); setError("");
    try {
      await planningRequest("recipes/" + recipe.id, { method: "DELETE" });
      refreshRecipes();
      refresh(data?.items.length === 1 ? Math.max(1, page - 1) : page);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không lưu trữ được công thức.");
    } finally { lock.current = false; setBusy(false); }
  }
  return <>
    <div className="flex flex-wrap items-center gap-3">
      <Link className={control} href="/recipes/new">Đăng công thức</Link>
      <label>Trạng thái <select disabled={busy} className={control} value={status} onChange={(event) => { setStatus(event.target.value); refresh(1); }}>
        <option value="">Tất cả</option>{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></label>
      <button className={control} disabled={busy} onClick={() => refresh()}>Làm mới</button>
    </div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!data && !error && <p role="status">Đang tải công thức…</p>}
    {data && <>
      <p>{data.totalCount} công thức</p>
      {!data.items.length && <p>Chưa có công thức phù hợp.</p>}
      <ul className="space-y-3">{data.items.map((recipe) => <li key={recipe.id} className="space-y-3 rounded-xl border border-outline-variant p-4">
        <h2 className="text-xl font-bold">{recipe.title}</h2>
        <p>{labels[recipe.status ?? ""] ?? recipe.status} · {recipe.servings} khẩu phần · {recipe.totalMinutes} phút</p>
        <div className="flex flex-wrap gap-3">
          <Link className={control} href={"/recipes/" + recipe.id}>Xem công thức</Link>
          <Link className={control} href={"/recipes/new?edit=" + recipe.id}>Chỉnh sửa</Link>
          {recipe.status !== "Archived" && <button className={control} disabled={busy} onClick={() => void archive(recipe)}>Lưu trữ</button>}
        </div>
      </li>)}</ul>
      {(page > 1 || data.totalPages > 1) && <nav aria-label="Phân trang công thức" className="flex items-center gap-3">
        <button className={control} disabled={busy || page <= 1} onClick={() => refresh(page - 1)}>Trước</button>
        <span>Trang {page}</span>
        <button className={control} disabled={busy || page >= data.totalPages} onClick={() => refresh(page + 1)}>Sau</button>
      </nav>}
    </>}
  </>;
}
