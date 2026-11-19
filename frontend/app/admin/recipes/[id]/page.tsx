"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { backendFetch } from "@/lib/services/api-client";
import { useRecipes } from "@/lib/context/recipes-context";

interface RecipeDetail {
  summary: { title: string; description: string; status: string };
  ingredients: { id: string; ingredientName: string; quantity: number; unit: string }[];
  steps: { id: string; instruction: string }[];
}

type ReviewStatus = "Pending" | "Approved" | "Rejected";

interface DatasetReview {
  recipeId: string;
  datasetKey: string;
  status: ReviewStatus;
  sourceName: string | null;
  sourceUrl: string | null;
  licenseIdentifier: string | null;
}

const reviewLabels: Record<ReviewStatus, string> = {
  Pending: "Chờ duyệt",
  Approved: "Đã duyệt",
  Rejected: "Từ chối",
};

function ReviewForm({ review, onSaved }: { review: DatasetReview; onSaved: (review: DatasetReview) => void }) {
  const { refreshRecipes } = useRecipes();
  const [status, setStatus] = useState(review.status);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const fields = new FormData(event.currentTarget);
    const sourceName = String(fields.get("sourceName") ?? "").trim();
    const sourceUrl = String(fields.get("sourceUrl") ?? "").trim();
    const licenseIdentifier = String(fields.get("licenseIdentifier") ?? "").trim();
    if (status === "Approved" && (!sourceName || !licenseIdentifier)) {
      setMessage("Cần nhập tên nguồn đã xác minh và mã giấy phép để duyệt.");
      return;
    }
    if (sourceUrl && !/^https:\/\//i.test(sourceUrl)) {
      setMessage("Đường dẫn nguồn phải bắt đầu bằng https://.");
      return;
    }

    setSaving(true);
    setMessage("");
    const updated = await backendFetch<DatasetReview>("/api/v1/admin/dataset/" + review.recipeId + "/review", {
      method: "PATCH",
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({ status, sourceName: sourceName || null, sourceUrl: sourceUrl || null,
        licenseIdentifier: licenseIdentifier || null }),
    });
    setSaving(false);
    if (updated?.recipeId === review.recipeId) {
      refreshRecipes();
      onSaved(updated);
      setMessage("Đã lưu kết quả duyệt.");
    } else {
      setMessage("Chưa xác nhận được kết quả. Tải lại trang để kiểm tra trạng thái đã lưu.");
    }
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-xl bg-surface-container-lowest p-5">
      <h2 className="font-semibold">Duyệt nguồn công thức</h2>
      <p>Trạng thái đã lưu · {reviewLabels[review.status]}</p>
      <p className="text-on-surface-variant">Duyệt nguồn và xuất bản là hai thao tác riêng. Đổi kết quả duyệt của món đã xuất bản sang Chờ duyệt hoặc Từ chối sẽ đưa món về bản nháp.</p>
      <fieldset disabled={saving} className="grid gap-3">
        <label>Trạng thái duyệt
          <select className="ml-2 rounded border p-2" value={status}
            onChange={(event) => setStatus(event.target.value as ReviewStatus)}>
            {Object.entries(reviewLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>Tên nguồn
          <input className="block w-full rounded border p-2" name="sourceName" maxLength={200}
            defaultValue={review.sourceName ?? ""} required={status === "Approved"} />
        </label>
        <label>Đường dẫn nguồn
          <input className="block w-full rounded border p-2" name="sourceUrl" type="url" maxLength={2048}
            defaultValue={review.sourceUrl ?? ""} />
        </label>
        <label>Mã giấy phép
          <input className="block w-full rounded border p-2" name="licenseIdentifier" maxLength={100}
            defaultValue={review.licenseIdentifier ?? ""} required={status === "Approved"} />
        </label>
        <button type="submit" className="w-fit rounded-xl bg-primary px-4 py-2 text-on-primary">
          {saving ? "Đang lưu…" : "Lưu kết quả duyệt"}
        </button>
      </fieldset>
      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default function AdminRecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<{ id: string; recipe: RecipeDetail | null }>();
  const [reviewResult, setReviewResult] = useState<{ id: string; review: Partial<DatasetReview> | null }>();

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]);
    void backendFetch<RecipeDetail>("/api/v1/recipes/" + encodeURIComponent(id), { cache: "no-store", signal })
      .then((recipe) => {
        if (!controller.signal.aborted) setResult({ id, recipe });
      });
    void backendFetch<Partial<DatasetReview>>("/api/v1/admin/dataset/" + encodeURIComponent(id) + "/review", { cache: "no-store", signal })
      .then((review) => {
        if (!controller.signal.aborted) setReviewResult({ id, review });
      });
    return () => controller.abort();
  }, [id]);

  const recipe = result?.id === id ? result.recipe : undefined;
  const review = reviewResult?.id === id ? reviewResult.review : undefined;

  return (
    <section className="space-y-5">
      <Link className="text-primary hover:underline" href="/admin/recipes">Quay lại danh sách</Link>
      {recipe === undefined ? <p role="status">Đang tải công thức…</p> : !recipe ? (
        <p role="status">Chưa tải được công thức. Kiểm tra kết nối API và phiên Admin.</p>
      ) : (
        <>
          <h1 className="font-headline-lg text-headline-lg font-bold">{recipe.summary.title}</h1>
          <p>{recipe.summary.description}</p>
          <h2 className="font-semibold">Nguyên liệu</h2>
          <ul className="list-disc pl-6">
            {recipe.ingredients.map((item) => <li key={item.id}>{item.ingredientName} · {item.quantity} {item.unit}</li>)}
          </ul>
          <h2 className="font-semibold">Cách làm</h2>
          <ol className="list-decimal pl-6">
            {recipe.steps.map((step) => <li key={step.id}>{step.instruction}</li>)}
          </ol>
          {review === undefined ? <p role="status">Đang tải trạng thái duyệt…</p> : review === null ? (
            <p role="status">Chưa tải được trạng thái duyệt.</p>
          ) : review.recipeId === id ? (
            <ReviewForm key={id} review={review as DatasetReview} onSaved={(updated) => setReviewResult({ id, review: updated })} />
          ) : <p>Công thức này không thuộc bộ dữ liệu nhập.</p>}
        </>
      )}
    </section>
  );
}
