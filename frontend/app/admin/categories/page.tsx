"use client";

import * as React from "react";
import { backendFetch } from "@/lib/services/api-client";

type Kind = "ingredients" | "categories" | "tags";
interface Item { id: string; name: string; defaultUnit?: string; slug?: string }
interface Result { items: Item[]; totalCount: number; totalPages: number }
const labels: Record<Kind, string> = { ingredients: "Nguyên liệu", categories: "Danh mục", tags: "Thẻ" };
const control = "rounded-xl border border-orange-200 bg-white p-3 disabled:opacity-50";

export default function AdminCategoriesPage() {
  const [kind, setKind] = React.useState<Kind>("ingredients");
  return <div className="space-y-6 p-6"><h1 className="text-3xl font-bold">Danh mục & Nguyên liệu</h1>
    <nav className="flex gap-3">{(Object.keys(labels) as Kind[]).map((key) => <button key={key} className={control} aria-pressed={key === kind} onClick={() => setKind(key)}>{labels[key]}</button>)}</nav>
    <Catalog key={kind} kind={kind} />
  </div>;
}

function Catalog({ kind }: { kind: Kind }) {
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [revision, setRevision] = React.useState(0);
  const [data, setData] = React.useState<Result | null>(null);
  const [error, setError] = React.useState("");
  const [editing, setEditing] = React.useState<Item | null>(null);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [unit, setUnit] = React.useState("g");
  const [busy, setBusy] = React.useState(false);
  const lock = React.useRef(false);
  const writePath = kind === "ingredients" ? kind : `admin/${kind}`;
  React.useEffect(() => {
    const controller = new AbortController();
    const path = kind === "ingredients" ? `/api/v1/ingredients?page=${page}&pageSize=20&q=${encodeURIComponent(search)}` : `/api/v1/${kind}`;
    backendFetch<Result | Item[]>(path, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]), cache: "no-store" }).then((result) => {
      if (controller.signal.aborted) return;
      if (!result) { setError("Không tải được dữ liệu. Kiểm tra kết nối và phiên đăng nhập rồi làm mới."); return; }
      if (Array.isArray(result)) {
        const items = result.filter((item) => item.name.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")));
        setData({ items, totalCount: items.length, totalPages: 1 });
      } else setData(result);
    });
    return () => controller.abort();
  }, [kind, page, search, revision]);
  function refresh() { setError(""); setData(null); setRevision((n) => n + 1); }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const result = await backendFetch<Item>(`/api/v1/${writePath}${editing ? `/${editing.id}` : ""}`, {
        method: editing ? "PUT" : "POST", signal: AbortSignal.timeout(30000),
        body: JSON.stringify(kind === "ingredients" ? { name: name.trim(), defaultUnit: unit.trim() } : { name: name.trim(), slug: slug.trim() }),
      });
      if (!result) { setError("Không lưu được. Kiểm tra tên trùng, dữ liệu nhập hoặc phiên đăng nhập. Làm mới để đối chiếu trước khi thử lại."); return; }
      setEditing(null); setName(""); setSlug(""); setUnit("g"); refresh();
    } finally { lock.current = false; setBusy(false); }
  }
  return <section className="space-y-5" aria-busy={busy}>
    <form className="flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); setData(null); setError(""); setPage(1); setSearch(query.trim()); setRevision((n) => n + 1); }}>
      <input className={control} aria-label="Tìm theo tên" placeholder="Tìm theo tên" value={query} maxLength={150} onChange={(e) => setQuery(e.target.value)} />
      <button className={control} disabled={busy}>Tìm kiếm</button><button className={control} type="button" disabled={busy} onClick={refresh}>Làm mới</button>
    </form>
    <form onSubmit={save} className="flex flex-wrap items-end gap-3 rounded-2xl bg-orange-50 p-4">
      <label>{editing ? "Sửa tên" : `Thêm ${labels[kind].toLowerCase()}`}<input required maxLength={kind === "ingredients" ? 150 : 100} className={`${control} block`} value={name} onChange={(e) => setName(e.target.value)} /></label>
      {kind === "ingredients" ? <label>Đơn vị mặc định<select className={`${control} block`} value={unit} onChange={(e) => setUnit(e.target.value)}>{["g", "kg", "ml", "l", "tsp", "tbsp", "piece"].map((u) => <option key={u}>{u}</option>)}</select></label> : <label>Mã đường dẫn<input required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="mon-chay" className={`${control} block`} value={slug} onChange={(e) => setSlug(e.target.value)} /></label>}
      <button className={control} disabled={busy || !name.trim() || (kind === "ingredients" && !unit.trim())}>{busy ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Thêm mới"}</button>
      {editing && <button type="button" className={control} disabled={busy} onClick={() => { setEditing(null); setName(""); setSlug(""); setUnit("g"); }}>Hủy sửa</button>}
    </form>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!data && !error && <p role="status">Đang tải dữ liệu…</p>}
    {data && <><p>{data.totalCount} {labels[kind].toLowerCase()}{search && " khớp tìm kiếm"}</p>
      {!data.items.length && <p>Chưa có dữ liệu phù hợp.</p>}
      <ul className="divide-y rounded-xl border">{data.items.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><span>{item.name}{item.defaultUnit && ` · ${item.defaultUnit}`}</span><button className={control} disabled={busy} onClick={() => { setEditing(item); setName(item.name); setSlug(item.slug ?? ""); setUnit(item.defaultUnit ?? "g"); }}>Chỉnh sửa</button></li>)}</ul>
      {data.totalPages > 1 && <div className="flex items-center gap-3"><button className={control} disabled={busy || page <= 1} onClick={() => { setData(null); setError(""); setPage(page - 1); }}>Trước</button><span>Trang {page} / {data.totalPages}</span><button className={control} disabled={busy || page >= data.totalPages} onClick={() => { setData(null); setError(""); setPage(page + 1); }}>Sau</button></div>}
    </>}
  </section>;
}
