"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { recipePlannerLink } from "@/lib/services/planning-api";

const button = "inline-flex min-h-11 items-center justify-center rounded-xl border border-outline-variant px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50";

export default function FavoritesPage() {
  const { user, isRestoringSession } = useAuth();
  const { favoriteItems, isLoading, error, refreshFavorites, removeFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("saved");
  const loading = isRestoringSession || isLoading;
  const items = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("vi");
    return favoriteItems.filter(({ recipe }) => !search || `${recipe.title} ${recipe.author.name}`.toLocaleLowerCase("vi").includes(search))
      .sort((a, b) => sort === "name" ? a.recipe.title.localeCompare(b.recipe.title, "vi")
        : sort === "time" ? a.recipe.prepTimeMinutes + a.recipe.cookTimeMinutes - b.recipe.prepTimeMinutes - b.recipe.cookTimeMinutes : 0);
  }, [favoriteItems, query, sort]);

  if (!isRestoringSession && !user) return <div className="flex min-h-screen flex-col bg-background text-on-surface"><Navbar /><main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-12"><h1 className="text-3xl font-bold">Lưu món yêu thích vào tài khoản</h1><p>Đăng nhập để lưu và xem lại công thức yêu thích trên các thiết bị.</p><Link className={button + " bg-primary text-on-primary"} href="/login?returnUrl=/favorites">Đăng nhập</Link><Link className={button + " ml-2"} href="/recipes">Tiếp tục khám phá</Link></main><Footer /></div>;

  return <div className="flex min-h-screen flex-col bg-background text-on-surface">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Đường dẫn" className="text-sm"><Link href="/" className="underline">Trang chủ</Link><span aria-hidden="true"> / </span>Yêu thích</nav>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2"><h1 className="text-3xl font-bold sm:text-4xl">Món yêu thích</h1><p className="max-w-2xl text-on-surface-variant">Các công thức đã lưu vào tài khoản của bạn. Chọn món để xem chi tiết hoặc thêm vào thực đơn.</p></div>
        <div className="flex flex-wrap gap-2"><button className={button} disabled={loading} onClick={refreshFavorites}>Làm mới</button><Link href="/recipes" className={button + " bg-primary text-on-primary"}>Khám phá món ăn</Link></div>
      </header>
      <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface p-4 sm:flex-row sm:items-end">
        <label className="flex-1 space-y-1"><span className="block text-sm font-medium">Tìm trong món đã lưu</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên món hoặc tác giả" className="min-h-11 w-full rounded-xl border border-outline-variant bg-background px-3" /></label>
        <label className="space-y-1"><span className="block text-sm font-medium">Sắp xếp</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 w-full rounded-xl border border-outline-variant bg-background px-3"><option value="saved">Thứ tự danh sách</option><option value="name">Tên món A–Z</option><option value="time">Thời gian nấu tăng dần</option></select></label>
      </div>
      {loading ? <p role="status" className="rounded-xl border p-6">Đang tải món yêu thích…</p>
        : error ? <div role="alert" className="space-y-3 rounded-xl border border-error p-6"><p>{error}</p><button className={button} onClick={refreshFavorites}>Thử lại</button></div>
        : <><p role="status">{favoriteItems.length} món yêu thích{query.trim() ? ` · ${items.length} kết quả phù hợp` : ""}</p>
          {!items.length ? <div className="space-y-3 rounded-2xl border border-dashed p-8 text-center"><h2 className="text-xl font-semibold">{favoriteItems.length ? "Không tìm thấy món phù hợp" : "Chưa có món yêu thích"}</h2><p>{favoriteItems.length ? "Thử tìm bằng tên món hoặc tác giả khác." : "Mở Khám phá, bấm lưu ở món bạn thích rồi quay lại đây."}</p>{query && <button className={button} onClick={() => setQuery("")}>Xóa bộ lọc</button>}</div>
            : <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(({ recipe, recipeId }) => <li key={recipeId} className="overflow-hidden rounded-2xl border border-outline-variant bg-surface">
              <Link href={"/recipes/" + recipeId} className="block"><div className="relative aspect-[4/3] bg-surface-container"><Image src={recipe.image} alt={recipe.title} fill unoptimized sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover" /></div></Link>
              <div className="space-y-3 p-4"><h2 className="text-xl font-semibold"><Link href={"/recipes/" + recipeId}>{recipe.title}</Link></h2><p className="text-sm text-on-surface-variant">{recipe.author.name} · {recipe.prepTimeMinutes + recipe.cookTimeMinutes} phút · {recipe.servings} khẩu phần</p><div className="flex flex-wrap gap-2"><Link className={button} href={user ? recipePlannerLink(recipeId, recipe.servings) : "/meal-planner"}>Thêm vào thực đơn</Link><button className={button} onClick={() => removeFavorite(recipeId)} aria-label={"Bỏ yêu thích " + recipe.title}>Bỏ yêu thích</button></div></div>
            </li>)}</ul>}</>}
    </main><Footer />
  </div>;
}
