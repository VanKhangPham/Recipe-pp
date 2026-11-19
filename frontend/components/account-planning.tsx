"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { dayOffset, weekMonday, planningRequest, PlanningError, isCloudRecipe, type MealPlan, type MealEntry, type ShoppingList, type ShoppingEntry, type Page } from "@/lib/services/planning-api";

const subscribe = () => () => {};
const control = "rounded-xl border border-orange-200 bg-white p-3 disabled:opacity-50";
const action = `${control} text-orange-800 font-semibold`;
const meals: Record<string, string> = { Breakfast: "Bữa sáng", Lunch: "Bữa trưa", Dinner: "Bữa tối", Snack: "Bữa phụ" };
const errorText = (error: unknown) => error instanceof PlanningError ? error.message : "Không thể kết nối máy chủ. Vui lòng thử lại.";

export function AccountPlanningGate({ kind, children }: { kind: "meals" | "shopping"; children: React.ReactNode }) {
  const { user, isRestoringSession } = useAuth();
  const hydrated = React.useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated || isRestoringSession) return <p className="p-6" role="status">Đang kiểm tra phiên đăng nhập…</p>;
  if (!user) return children;
  return <div key={user.id}><Navbar /><main className="mx-auto max-w-6xl space-y-6 p-6">
    {kind === "meals" ? <AccountMeals /> : <AccountShopping />}
  </main><Footer /></div>;
}

function AccountMeals() {
  const router = useRouter();
  const [week, setWeek] = React.useState(weekMonday);
  return <>
    <h1 className="text-3xl font-bold">Thực đơn của bạn</h1>
    <div className="flex flex-wrap items-center gap-3">
      <button className={action} disabled={!week} onClick={() => setWeek(dayOffset(week, -7))}>Tuần trước</button>
      <span>{week && `${week} — ${dayOffset(week, 6)}`}</span>
      <button className={action} disabled={!week} onClick={() => setWeek(dayOffset(week, 7))}>Tuần sau</button>
      <Link className={action} href="/shopping-list">Danh sách đi chợ</Link>
    </div>
    {week && <WeekPlan key={week} week={week} onShopping={(id) => router.push(`/shopping-list?list=${encodeURIComponent(id)}`)} />}
  </>;
}

function WeekPlan({ week, onShopping }: { week: string; onShopping: (id: string) => void }) {
  const [requested] = React.useState(() => {
    const query = new URLSearchParams(window.location.search);
    const servings = Number(query.get("servings") ?? 1);
    return { id: query.get("recipe") ?? "", servings: Number.isInteger(servings) && servings >= 1 && servings <= 100 ? servings : 1 };
  });
  const [plan, setPlan] = React.useState<MealPlan | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const lock = React.useRef(false);
  const [error, setError] = React.useState("");
  const [reload, setReload] = React.useState(0);
  const [recipes, setRecipes] = React.useState<{ id: string; title: string; servings: number }[]>([]);
  const [query, setQuery] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [searchError, setSearchError] = React.useState("");
  const [recipeId, setRecipeId] = React.useState("");
  React.useEffect(() => {
    const controller = new AbortController();
    planningRequest<MealPlan>(`meal-plans?weekStart=${week}`, { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setPlan(data); }).catch((e) => { if (!controller.signal.aborted && !(e instanceof PlanningError && e.status === 404)) setError(errorText(e)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [week, reload]);
  React.useEffect(() => {
    const controller = new AbortController();
    planningRequest<Page<{ id: string; title: string; servings: number; status?: string }>>(`recipes?page=1&pageSize=100&status=Published&q=${encodeURIComponent(search)}`, { signal: controller.signal })
      .then(async (data) => {
        let choices = data.items.filter((r) => !r.status || r.status === "Published");
        // Preserve available published choices if the incoming recipe link is invalid.
        if (!controller.signal.aborted) setRecipes(choices);
        if (!search && requested.id) {
          if (!isCloudRecipe(requested.id)) throw new PlanningError(400, "Món này chưa có trên máy chủ. Hãy tìm một công thức đã xuất bản bên dưới.");
          const detail = await planningRequest<{ summary: { id: string; title: string; servings: number; status?: string } }>(`recipes/${requested.id}`, { signal: controller.signal });
          if (detail.summary.status && detail.summary.status !== "Published") throw new PlanningError(400, "Công thức chưa xuất bản, chưa thể thêm vào thực đơn.");
          choices = [detail.summary, ...choices.filter((r) => r.id !== requested.id)];
          if (!controller.signal.aborted) setRecipeId(requested.id);
        }
        if (!controller.signal.aborted) setRecipes(choices);
      })
      .catch((e) => { if (!controller.signal.aborted) setSearchError(errorText(e)); });
    return () => controller.abort();
  }, [search, requested.id]);
  async function mutate(work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try { await work(); } catch (e) { setError(errorText(e)); }
    finally { lock.current = false; setBusy(false); }
  }
  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    await mutate(async () => {
      let current = plan;
      if (!current) {
        try { current = await planningRequest<MealPlan>("meal-plans", { method: "POST", body: JSON.stringify({ weekStart: week }) }); }
        catch (e) {
          if (!(e instanceof PlanningError && e.status === 409)) throw e;
          current = await planningRequest<MealPlan>(`meal-plans?weekStart=${week}`);
        }
        setPlan(current);
      }
      const item = await planningRequest<MealEntry>(`meal-plans/${current.id}/items`, { method: "POST", body: JSON.stringify({
        recipeId, plannedDate: values.get("date"), mealType: values.get("mealType"), servings: Number(values.get("servings")),
      }) });
      setPlan({ ...current, items: [...current.items, item] });
    });
  }
  return <section className="space-y-5" aria-busy={busy || loading}>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <button className={action} disabled={busy || loading} onClick={() => { setLoading(true); setError(""); setPlan(null); setReload((n) => n + 1); }}>Làm mới</button>
    {loading ? <p role="status">Đang tải thực đơn…</p> : <>
      {!plan && !error && <p>Tuần này chưa có thực đơn. Chọn món để bắt đầu.</p>}
      <form className="flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); setRecipeId(""); setSearchError(""); setSearch(query); }}>
        <input className={control} aria-label="Tìm công thức" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm món đã xuất bản" />
        <button className={action} disabled={busy}>Tìm món</button>
      </form>
      {searchError && <p role="alert" className="text-red-700">{searchError}</p>}
      <form onSubmit={add} className="flex flex-wrap gap-3 rounded-2xl bg-orange-50 p-4">
        <label>Món ăn<select required className={`${control} block max-w-full`} value={recipeId} onChange={(e) => setRecipeId(e.target.value)}><option value="">Chọn công thức</option>{recipes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
        <label>Ngày<select name="date" className={`${control} block`}>{Array.from({ length: 7 }, (_, i) => <option key={i} value={dayOffset(week, i)}>{dayOffset(week, i)}</option>)}</select></label>
        <label>Bữa<select name="mealType" className={`${control} block`}>{Object.entries(meals).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <label>Khẩu phần<input key={recipeId} className={`${control} block w-24`} type="number" required min={1} max={100} name="servings" defaultValue={recipeId === requested.id ? requested.servings : recipes.find((r) => r.id === recipeId)?.servings ?? 1} /></label>
        <button className={action} disabled={busy || !recipeId || (!!error && !plan)}>Thêm món</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 7 }, (_, i) => {
        const date = dayOffset(week, i);
        return <section className="rounded-2xl border p-4" key={date}><h2 className="font-bold">{["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"][i]} · {date}</h2>
          {Object.entries(meals).map(([type, label]) => <div key={type} className="mt-3"><h3>{label}</h3>{plan?.items.filter((item) => item.plannedDate === date && item.mealType === type).map((item) => <div key={item.id} className="flex items-center justify-between gap-2 py-2">
            <span><Link className="underline" href={`/recipes/${item.recipeId}`}>{item.recipeTitle}</Link> · {item.servings} phần</span>
            <button className={action} disabled={busy} onClick={() => void mutate(async () => {
              await planningRequest(`meal-plans/${plan.id}/items/${item.id}`, { method: "DELETE" });
              setPlan({ ...plan, items: plan.items.filter((m) => m.id !== item.id) });
            })}>Bỏ món</button>
          </div>)}</div>)}
        </section>;
      })}</div>
      <p>Danh sách đi chợ tổng hợp nguyên liệu của cả tuần. Sau khi sửa thực đơn, bấm Cập nhật nguyên liệu để tính lại danh sách.</p>
      <button className={action} disabled={busy || !plan?.items.length} onClick={() => void mutate(async () => {
        const list = await planningRequest<ShoppingList>(`meal-plans/${plan!.id}/shopping-list`, { method: "PUT" });
        onShopping(list.id);
      })}>Tạo / mở danh sách đi chợ của tuần</button>
      <button className={action} disabled={busy || !plan} onClick={() => {
        if (!window.confirm("Cập nhật danh sách theo thực đơn hiện tại? Nguyên liệu không còn dùng sẽ được bỏ cùng ghi chú của chúng. Ghi chú và số lượng đã chỉnh tay của nguyên liệu còn dùng được giữ lại. Nguyên liệu thay đổi số lượng tự tính sẽ cần đánh dấu đã mua lại.")) return;
        void mutate(async () => {
          const list = await planningRequest<ShoppingList>(`meal-plans/${plan!.id}/shopping-list/refresh`, { method: "POST" });
          onShopping(list.id);
        });
      }}>Cập nhật nguyên liệu từ thực đơn</button>
    </>}
  </section>;
}

function AccountShopping() {
  const [page, setPage] = React.useState(1);
  const [reload, setReload] = React.useState(0);
  const [lists, setLists] = React.useState<Page<{ id: string; name: string }> | null>(null);
  const [selected, setSelected] = React.useState("");
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    const controller = new AbortController();
    planningRequest<Page<{ id: string; name: string }>>(`shopping-lists?page=${page}&pageSize=20`, { signal: controller.signal })
      .then((data) => { if (controller.signal.aborted) return; setLists(data); setSelected((id) => id || new URLSearchParams(window.location.search).get("list") || data.items[0]?.id || ""); })
      .catch((e) => { if (!controller.signal.aborted) setError(errorText(e)); });
    return () => controller.abort();
  }, [page, reload]);
  return <>
    <h1 className="text-3xl font-bold">Danh sách đi chợ của bạn</h1>
    <Link href="/meal-planner" className="underline">Lập thực đơn để tạo danh sách nguyên liệu</Link>
    <button className={action} onClick={() => { setLists(null); setError(""); setReload((n) => n + 1); }}>Làm mới</button>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!lists && !error && <p role="status">Đang tải danh sách…</p>}
    {lists && <>
      {!lists.items.length && <p>Chưa có danh sách đi chợ.</p>}
      <nav aria-label="Chọn danh sách đi chợ" className="flex flex-wrap gap-3">{lists.items.map((list) => <button aria-pressed={selected === list.id} className={`${action} ${selected === list.id ? "bg-orange-100" : ""}`} key={list.id} onClick={() => setSelected(list.id)}>{list.name}</button>)}</nav>
      {lists.totalPages > 1 && <div className="flex gap-3"><button className={action} disabled={page === 1} onClick={() => { setLists(null); setError(""); setPage(page - 1); }}>Trước</button><span>Trang {page} / {lists.totalPages}</span><button className={action} disabled={page >= lists.totalPages} onClick={() => { setLists(null); setError(""); setPage(page + 1); }}>Sau</button></div>}
    </>}
    {selected && <ShoppingDetails key={`${selected}:${reload}`} id={selected} />}
  </>;
}

function ShoppingDetails({ id }: { id: string }) {
  const [list, setList] = React.useState<ShoppingList | null>(null);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const lock = React.useRef(false);
  React.useEffect(() => {
    const controller = new AbortController();
    planningRequest<ShoppingList>(`shopping-lists/${encodeURIComponent(id)}`, { signal: controller.signal }).then((data) => { if (!controller.signal.aborted) setList(data); })
      .catch((e) => { if (!controller.signal.aborted) setError(errorText(e)); });
    return () => controller.abort();
  }, [id]);
  async function toggle(item: ShoppingEntry) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const updated = await planningRequest<ShoppingEntry>(`shopping-lists/${encodeURIComponent(id)}/items/${item.id}`, { method: "PATCH", body: JSON.stringify({ isPurchased: !item.isPurchased }) });
      setList((current) => current && ({ ...current, items: current.items.map((entry) => entry.id === updated.id ? updated : entry) }));
    } catch (e) { setError(errorText(e)); } finally { lock.current = false; setBusy(false); }
  }
  return <section className="space-y-3" aria-busy={busy}>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!list && !error && <p role="status">Đang tải nguyên liệu…</p>}
    {list && <><h2 className="text-xl font-bold">{list.name}</h2><p>Đã mua {list.items.filter((i) => i.isPurchased).length} / {list.items.length} nguyên liệu</p>
      {!list.items.length && <p>Danh sách không có nguyên liệu.</p>}
      {list.items.map((item) => <label key={item.id} className="flex items-center gap-4 rounded-xl border p-4"><input type="checkbox" checked={item.isPurchased} disabled={busy} onChange={() => void toggle(item)} /><span className={item.isPurchased ? "line-through" : ""}>{item.ingredientName} · {item.quantity} {item.unit}{item.note && ` · ${item.note}`}</span></label>)}
    </>}
  </section>;
}
