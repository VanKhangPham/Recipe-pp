"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { planningRequest, recipePlannerLink } from "@/lib/services/planning-api";
import { mapBackendToRecipe, type BackendRecipeSummary } from "@/lib/services/recipe-service";

interface Recommendation {
  recipe: BackendRecipeSummary;
  score: number;
  reasons: string[];
}
interface Category { id: string; name: string }
const reasons: Record<string, string> = {
  "ingredient-match": "Có nguyên liệu phù hợp",
  "category-match": "Phù hợp danh mục bạn quan tâm",
  "preference-match": "Khớp tùy chọn ăn uống",
  "within-cooking-time": "Trong thời gian nấu ưu tiên",
  "popularity-fallback": "Gợi ý theo mức độ quan tâm",
};
const control = "rounded-xl border border-outline-variant bg-surface px-4 py-2 disabled:opacity-50";

export default function RecommendationsPage() {
  const { user, isRestoringSession } = useAuth();
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
        <h1 className="text-3xl font-bold">Gợi ý món ăn</h1>
        {isRestoringSession ? <p role="status">Đang kiểm tra phiên đăng nhập…</p> : (
          <Recommendations key={user?.id ?? "guest"} personal={!!user} />
        )}
      </main>
      <Footer />
    </>
  );
}

function Recommendations({ personal }: { personal: boolean }) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [category, setCategory] = useState("");
  const [minutes, setMinutes] = useState("");
  const [filter, setFilter] = useState({ category: "", minutes: "" });
  const [revision, setRevision] = useState(0);
  const [snapshot, setSnapshot] = useState<{ key: string; items: Recommendation[]; error: string } | null>(null);
  const requestKey = filter.category + ":" + filter.minutes + ":" + revision;
  const loading = snapshot?.key !== requestKey;
  const items = loading ? [] : snapshot.items;
  const error = loading ? "" : snapshot.error;

  useEffect(() => {
    if (personal) return;
    const controller = new AbortController();
    planningRequest<Category[]>("categories", { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setCategories(data);
    }).catch(() => {
      if (!controller.signal.aborted) setCategoryError("Chưa tải được bộ lọc danh mục.");
    });
    return () => controller.abort();
  }, [personal, revision]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ limit: "12" });
    if (!personal && filter.category) query.set("categoryId", filter.category);
    if (!personal && filter.minutes) query.set("maxTotalMinutes", filter.minutes);
    const endpoint = personal ? "users/me/recommendations" : "recommendations";
    planningRequest<Recommendation[]>(endpoint + "?" + query, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setSnapshot({ key: requestKey, items: data, error: "" });
    }).catch((cause) => {
      if (!controller.signal.aborted) setSnapshot({
        key: requestKey, items: [],
        error: cause instanceof Error ? cause.message : "Không tải được gợi ý.",
      });
    });
    return () => controller.abort();
  }, [personal, filter.category, filter.minutes, requestKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {personal ? (
          <Link className={control} href="/settings">Chỉnh tùy chọn ăn uống</Link>
        ) : (
          <Link className="underline" href="/login?returnUrl=%2Frecommendations">Đăng nhập để nhận gợi ý riêng</Link>
        )}
        <button className={control} disabled={loading} onClick={() => {
          setCategoryError("");
          setRevision((value) => value + 1);
        }}>Làm mới gợi ý</button>
      </div>
      {!personal && (
        <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => {
          event.preventDefault();
          setFilter({ category, minutes });
          setRevision((value) => value + 1);
        }}>
          <label>Danh mục ưu tiên
            <select className={control + " mt-2 block"} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Tất cả</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>Thời gian tối đa (phút)
            <input className={control + " mt-2 block"} type="number" min={1} max={2880} step={1} placeholder="Không giới hạn" value={minutes} onChange={(event) => setMinutes(event.target.value)} />
          </label>
          <button className={control} disabled={loading}>Áp dụng</button>
        </form>
      )}
      {categoryError && <p role="alert">{categoryError}</p>}
      {loading ? <p role="status">Đang tìm món phù hợp…</p> : error ? (
        <p role="alert" className="text-error">{error}</p>
      ) : items.length === 0 ? (
        <p>Chưa có món phù hợp. Bạn có thể điều chỉnh tùy chọn rồi làm mới gợi ý.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ recipe, reasons: recipeReasons }) => (
            <article key={recipe.id} className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
              {recipe.coverImageUrl && (
                <Link href={"/recipes/" + recipe.id} className="relative block aspect-video">
                  <Image src={recipe.coverImageUrl} alt={recipe.title} fill unoptimized className="object-cover" />
                </Link>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="text-xl font-bold"><Link href={"/recipes/" + recipe.id}>{recipe.title}</Link></h2>
                <p>{recipe.totalMinutes} phút · {recipe.servings} khẩu phần</p>
                <p className="line-clamp-3">{recipe.description}</p>
                <ul className="space-y-1 text-sm text-on-surface-variant">
                  {recipeReasons.filter((reason) => reasons[reason]).map((reason) => <li key={reason}>{reasons[reason]}</li>)}
                </ul>
                <div className="mt-auto flex flex-wrap gap-3">
                  <button className={control} aria-pressed={isFavorited(recipe.id)} onClick={() => toggleFavorite(recipe.id, mapBackendToRecipe(recipe))}>
                    {isFavorited(recipe.id) ? "Bỏ yêu thích" : "Yêu thích"}
                  </button>
                  <Link className={control} href={personal ? recipePlannerLink(recipe.id, recipe.servings) : "/login?returnUrl=" + encodeURIComponent(recipePlannerLink(recipe.id, recipe.servings))}>Thêm vào thực đơn</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
