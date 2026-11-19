"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { planningRequest } from "@/lib/services/planning-api";
import type { BackendRecipeSummary } from "@/lib/services/recipe-service";

interface Profile {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAt: string;
}

interface RecipePage {
  items: BackendRecipeSummary[];
  totalCount: number;
}

interface CountPage {
  totalCount: number;
}

interface ProfileData {
  profile: Profile | null;
  recipes: RecipePage | null;
  favorites: CountPage | null;
  shopping: CountPage | null;
}

const control = "rounded-xl border border-outline-variant bg-surface px-4 py-2 disabled:opacity-50";
const statusLabels: Record<string, string> = {
  Draft: "Bản nháp",
  Published: "Đã xuất bản",
  Archived: "Đã lưu trữ",
};

export default function PersonalProfilePage() {
  const { user, isRestoringSession } = useAuth();
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        {isRestoringSession ? (
          <p role="status">Đang kiểm tra phiên đăng nhập…</p>
        ) : user ? (
          <ProfileContent key={user.id} />
        ) : (
          <Link className="underline" href="/login?returnUrl=%2Fprofile">Đăng nhập để xem hồ sơ</Link>
        )}
      </main>
      <Footer />
    </>
  );
}

function ProfileContent() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    void Promise.allSettled([
      planningRequest<Profile>("users/me", options),
      planningRequest<RecipePage>("users/me/recipes?page=1&pageSize=5", options),
      planningRequest<CountPage>("users/me/favorites?page=1&pageSize=1", options),
      planningRequest<CountPage>("shopping-lists?page=1&pageSize=1", options),
    ]).then(([profile, recipes, favorites, shopping]) => {
      if (controller.signal.aborted) return;
      setData({
        profile: profile.status === "fulfilled" ? profile.value : null,
        recipes: recipes.status === "fulfilled" ? recipes.value : null,
        favorites: favorites.status === "fulfilled" ? favorites.value : null,
        shopping: shopping.status === "fulfilled" ? shopping.value : null,
      });
    });
    return () => controller.abort();
  }, [revision]);

  function refresh() {
    setData(null);
    setRevision((value) => value + 1);
  }

  if (!data) return <p role="status">Đang tải hồ sơ…</p>;

  const metrics = [
    { label: "Công thức của tôi", count: data.recipes?.totalCount, href: "/my-recipes" },
    { label: "Công thức yêu thích", count: data.favorites?.totalCount, href: "/favorites" },
    { label: "Danh sách đi chợ", count: data.shopping?.totalCount, href: "/shopping-list" },
  ];
  const incomplete = !data.profile || !data.recipes || !data.favorites || !data.shopping;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button className={control} onClick={refresh}>Làm mới</button>
        <Link className={control} href="/settings">Cài đặt tài khoản</Link>
        <Link className={control} href="/meal-planner">Thực đơn</Link>
      </div>
      {incomplete && (
        <p role="alert" className="rounded-xl border border-error p-4 text-error">
          Chưa tải đủ dữ liệu hồ sơ. Kiểm tra kết nối hoặc đăng nhập lại, rồi bấm Làm mới.
        </p>
      )}
      {data.profile && (
        <section className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-xl font-bold text-on-primary-fixed">
              {data.profile.displayName.slice(0, 2).toUpperCase()}
            </span>
            <h2 className="text-2xl font-bold">{data.profile.displayName}</h2>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-on-surface-variant">Email</dt>
              <dd className="break-all">{data.profile.email}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Vai trò</dt>
              <dd>{data.profile.roles.map((role) => role === "Admin" ? "Quản trị viên" : role === "User" ? "Thành viên" : role).join(", ") || "Thành viên"}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Ngày tham gia</dt>
              <dd>{new Date(data.profile.createdAt).toLocaleDateString("vi-VN")}</dd>
            </div>
          </dl>
        </section>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Link key={metric.href} href={metric.href} className="space-y-2 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <p>{metric.label}</p>
            <p className="text-3xl font-bold">{metric.count === undefined ? "—" : metric.count.toLocaleString("vi-VN")}</p>
          </Link>
        ))}
      </div>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Công thức mới nhất của bạn</h2>
          <Link className="underline" href="/my-recipes">Xem tất cả</Link>
        </div>
        {!data.recipes ? (
          <p>Chưa tải được danh sách công thức.</p>
        ) : data.recipes.items.length === 0 ? (
          <div className="space-y-3">
            <p>Bạn chưa có công thức nào.</p>
            <Link className="underline" href="/recipes/new">Đăng công thức đầu tiên</Link>
          </div>
        ) : (
          <ul className="divide-y rounded-xl border border-outline-variant">
            {data.recipes.items.map((recipe) => (
              <li key={recipe.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <Link className="font-semibold underline" href={"/recipes/" + recipe.id}>{recipe.title}</Link>
                <span>{statusLabels[recipe.status ?? ""] ?? recipe.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
