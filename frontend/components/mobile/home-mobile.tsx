"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { useRecipes, RecipeDataStatus } from "@/lib/context/recipes-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { useAuth } from "@/lib/context/auth-context";

export function HomeMobile() {
  const router = useRouter();
  const { recipes, isLoading, error } = useRecipes();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { user, isRestoringSession } = useAuth();
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState(false);
  const categories = useMemo(() => {
    const groups = new Map<string, { name: string; count: number }>();
    for (const recipe of recipes) {
      const group = groups.get(recipe.category);
      groups.set(recipe.category, { name: recipe.categoryName, count: (group?.count ?? 0) + 1 });
    }
    return [...groups.entries()];
  }, [recipes]);
  const featured = recipes.filter((recipe) => !quick || recipe.prepTimeMinutes + recipe.cookTimeMinutes <= 30).slice(0, 6);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <RecipeDataStatus />
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Hôm nay nấu gì?</h1>
        <form className="flex gap-2" onSubmit={(event) => {
          event.preventDefault();
          router.push("/recipes?q=" + encodeURIComponent(query.trim()));
        }}>
          <label className="flex-1">
            <span className="sr-only">Tìm món ăn</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món ăn…" className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3" />
          </label>
          <button className="rounded-xl bg-primary px-4 text-on-primary">Tìm</button>
        </form>
        <div className="flex gap-3">
          <button aria-pressed={!quick} className="rounded-full border px-4 py-2" onClick={() => setQuick(false)}>Tất cả</button>
          <button aria-pressed={quick} className="rounded-full border px-4 py-2" onClick={() => setQuick(true)}>Trong 30 phút</button>
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Khám phá món ngon</h2>
            <Link className="underline" href="/recipes">Xem tất cả</Link>
          </div>
          {!isLoading && !error && featured.length === 0 && <p>Chưa có công thức phù hợp.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((recipe) => (
              <article key={recipe.id} className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
                <Link href={"/recipes/" + recipe.id} className="relative block aspect-video">
                  <Image src={recipe.image} alt={recipe.title} fill unoptimized className="object-cover" />
                </Link>
                <div className="space-y-3 p-4">
                  <h3 className="text-xl font-bold"><Link href={"/recipes/" + recipe.id}>{recipe.title}</Link></h3>
                  <p>{recipe.totalTime} · {recipe.servings} khẩu phần</p>
                  <p>{recipe.reviewsCount} đánh giá{recipe.reviewsCount > 0 && " · " + recipe.rating + "/5"}</p>
                  <button disabled={isRestoringSession} aria-pressed={isFavorited(recipe.id)} className="rounded-xl border px-4 py-2 disabled:opacity-50" onClick={() => toggleFavorite(recipe.id, recipe)}>
                    {!user ? "Đăng nhập để lưu" : isFavorited(recipe.id) ? "Bỏ yêu thích" : "Yêu thích"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        {categories.length > 0 && <section className="space-y-3">
          <h2 className="text-xl font-bold">Danh mục món ăn</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {categories.map(([code, category]) => <Link key={code} className="rounded-xl border border-outline-variant p-4" href={"/recipes?category=" + encodeURIComponent(code)}>
              <p className="font-semibold">{category.name}</p><p>{category.count} món</p>
            </Link>)}
          </div>
        </section>}
        <Link className="block rounded-xl bg-primary p-4 text-center text-on-primary" href="/recommendations">Gợi ý món ăn</Link>
      </main>
      <Footer />
    </div>
  );
}
