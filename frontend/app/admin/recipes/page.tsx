"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { backendFetch } from "@/lib/services/api-client";

interface RecipeRow {
  id: string;
  title: string;
  status: string;
  author: { displayName: string };
}

interface RecipePage {
  items: RecipeRow[];
  totalCount: number;
  totalPages: number;
}

const statuses: Record<string, string> = {
  Draft: "Bản nháp",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

export default function AdminRecipesPage() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<RecipePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (filter) query.set("status", filter);
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]);
    void backendFetch<RecipePage>("/api/v1/admin/recipes?" + query, { cache: "no-store", signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setResult(data);
        setLoading(false);
      });
    return () => controller.abort();
  }, [page, filter, refresh]);

  const changePage = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-headline-lg text-headline-lg font-bold">Quản lý công thức</h1>
        <div className="flex items-center gap-3">
          <label htmlFor="recipe-status">Trạng thái</label>
          <select id="recipe-status" value={filter} className="rounded-xl bg-surface-container p-2"
            onChange={(event) => {
              setLoading(true);
              setPage(1);
              setFilter(event.target.value);
            }}>
            <option value="">Tất cả</option>
            {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button type="button" className="rounded-xl bg-primary px-4 py-2 text-on-primary"
            onClick={() => {
              setLoading(true);
              setRefresh((value) => value + 1);
            }}>Làm mới</button>
        </div>
      </header>
      {loading ? <p role="status">Đang tải công thức…</p> : !result ? (
        <p role="status">Chưa tải được danh sách. Kiểm tra kết nối API và phiên Admin.</p>
      ) : (
        <>
          <p>{result.totalCount.toLocaleString("vi-VN")} công thức</p>
          {result.items.length === 0 ? <p>Không có công thức phù hợp.</p> : (
            <div className="overflow-x-auto rounded-xl bg-surface-container-lowest">
              <table className="w-full text-left">
                <thead className="bg-surface-container">
                  <tr>
                    <th scope="col" className="p-3">Công thức</th>
                    <th scope="col" className="p-3">Tác giả</th>
                    <th scope="col" className="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((recipe) => (
                    <tr key={recipe.id} className="border-t border-surface-container">
                      <td className="p-3"><Link className="text-primary hover:underline" href={"/admin/recipes/" + recipe.id}>{recipe.title}</Link></td>
                      <td className="p-3">{recipe.author.displayName}</td>
                      <td className="p-3">{statuses[recipe.status] ?? recipe.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button type="button" disabled={page <= 1} className="text-primary disabled:opacity-50" onClick={() => changePage(page - 1)}>Trang trước</button>
            <span>Trang {page}/{Math.max(1, result.totalPages)}</span>
            <button type="button" disabled={page >= result.totalPages} className="text-primary disabled:opacity-50" onClick={() => changePage(page + 1)}>Trang sau</button>
          </div>
        </>
      )}
    </section>
  );
}
