"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { backendFetch } from "@/lib/services/api-client";

type Status = "Visible" | "Hidden";
interface Review {
  id: string;
  recipeId: string;
  author: { displayName: string };
  rating: number;
  comment: string;
  moderationStatus: Status;
}
interface Page { items: Review[]; totalCount: number; totalPages: number }
const labels = { Visible: "Hiển thị", Hidden: "Đã ẩn" };
const control = "rounded-xl border border-outline-variant px-4 py-2 disabled:opacity-50";

export default function AdminReportsPage() {
  const [filter, setFilter] = useState<Status | "">("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<Page | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const pending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (filter) query.set("moderationStatus", filter);
    backendFetch<Page>("/api/v1/admin/reviews?" + query, {
      cache: "no-store",
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]),
    }).then((data) => {
      if (controller.signal.aborted) return;
      if (data) setResult(data);
      else setError("Không tải được đánh giá. Kiểm tra kết nối hoặc đăng nhập lại.");
    });
    return () => controller.abort();
  }, [filter, page, revision]);

  function reload(nextPage = page) {
    setResult(null);
    setError("");
    setPage(nextPage);
    setRevision((value) => value + 1);
  }

  async function moderate(review: Review) {
    if (pending.current) return;
    const status = review.moderationStatus === "Hidden" ? "Visible" : "Hidden";
    pending.current = true;
    setSaving(review.id);
    setError("");
    try {
      const updated = await backendFetch<Review>("/api/v1/admin/reviews/" + review.id + "/moderation", {
        method: "PATCH",
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(30000),
      });
      if (!updated) {
        setError("Không xác nhận được thay đổi. Làm mới để kiểm tra trạng thái.");
        return;
      }
      reload(filter && result?.items.length === 1 ? Math.max(1, page - 1) : page);
    } finally {
      pending.current = false;
      setSaving(null);
    }
  }

  return (
    <section className="space-y-5 p-6">
      <h1 className="text-3xl font-bold">Kiểm duyệt đánh giá</h1>
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2">
          Trạng thái
          <select className={control} disabled={!!saving} value={filter} onChange={(event) => {
            setFilter(event.target.value as Status | "");
            reload(1);
          }}>
            <option value="">Tất cả</option>
            <option value="Visible">Hiển thị</option>
            <option value="Hidden">Đã ẩn</option>
          </select>
        </label>
        <button className={control} disabled={!!saving} onClick={() => reload()}>Làm mới</button>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!result && !error && <p role="status">Đang tải đánh giá…</p>}
      {result && (
        <>
          <p>{result.totalCount} đánh giá</p>
          {!result.items.length && <p>Không có đánh giá phù hợp.</p>}
          <ul className="space-y-3">
            {result.items.map((review) => (
              <li key={review.id} className="space-y-2 rounded-xl border border-outline-variant p-4">
                <p><strong>{review.author.displayName}</strong> · {review.rating}/5 sao · {labels[review.moderationStatus]}</p>
                <p className="whitespace-pre-wrap break-words">{review.comment}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link className="underline" href={"/admin/recipes/" + review.recipeId}>Xem công thức</Link>
                  <button className={control} disabled={!!saving} onClick={() => void moderate(review)}>
                    {saving === review.id ? "Đang lưu…" : review.moderationStatus === "Hidden" ? "Hiện lại đánh giá" : "Ẩn đánh giá"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {(page > 1 || result.totalPages > 1) && (
            <nav aria-label="Phân trang đánh giá" className="flex items-center gap-3">
              <button className={control} disabled={page <= 1 || !!saving} onClick={() => reload(page - 1)}>Trước</button>
              <span>Trang {page}</span>
              <button className={control} disabled={page >= result.totalPages || !!saving} onClick={() => reload(page + 1)}>Sau</button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
