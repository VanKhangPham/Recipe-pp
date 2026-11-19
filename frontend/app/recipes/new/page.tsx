"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { useRecipes } from "@/lib/context/recipes-context";
import { planningRequest } from "@/lib/services/planning-api";
import type { BackendRecipeDetail } from "@/lib/services/recipe-service";

interface Named { id: string; name: string }
interface Ingredient extends Named { defaultUnit: string }
interface IngredientRow { ingredientId: string; quantity: number; unit: string; note: string }
interface Step { instruction: string; durationMinutes: number | null }
interface ImageRow { url: string; altText: string }
const control = "rounded-xl border border-outline-variant bg-surface p-3 disabled:opacity-50";
const units = ["g", "kg", "ml", "l", "tsp", "tbsp", "piece"];
const blankIngredient = (): IngredientRow => ({ ingredientId: "", quantity: 1, unit: "g", note: "" });

export default function NewRecipePage() {
  return <Suspense fallback={<p role="status">Đang tải…</p>}><RecipeEditorGate /></Suspense>;
}
function RecipeEditorGate() {
  const { user, isRestoringSession } = useAuth();
  const id = useSearchParams().get("edit");
  return <><Navbar /><main className="mx-auto max-w-5xl space-y-5 p-6">
    {isRestoringSession ? <p role="status">Đang kiểm tra đăng nhập…</p> : !user ? <Link href="/login" className="underline">Đăng nhập để đăng công thức</Link> : <RecipeEditor key={user.id + ":" + (id ?? "new")} id={id} />}
  </main><Footer /></>;
}
function RecipeEditor({ id }: { id: string | null }) {
  const router = useRouter();
  const { refreshRecipes } = useRecipes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState(2);
  const [prep, setPrep] = useState(0);
  const [cook, setCook] = useState(0);
  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("Draft");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([blankIngredient()]);
  const [steps, setSteps] = useState<Step[]>([{ instruction: "", durationMinutes: null }]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [categories, setCategories] = useState<Named[]>([]);
  const [tags, setTags] = useState<Named[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    async function load() {
      try {
        const [categoryData, tagData, detail] = await Promise.all([
          planningRequest<Named[]>("categories", options),
          planningRequest<Named[]>("tags", options),
          id ? planningRequest<BackendRecipeDetail>("recipes/" + encodeURIComponent(id), options) : Promise.resolve(null),
        ]);
        const allIngredients: Ingredient[] = [];
        let page = 1;
        let totalPages = 1;
        do {
          const result = await planningRequest<{ items: Ingredient[]; totalPages: number }>("ingredients?page=" + page + "&pageSize=100", options);
          allIngredients.push(...result.items);
          totalPages = result.totalPages;
          page++;
        } while (page <= totalPages);
        if (controller.signal.aborted) return;
        setCategories(categoryData);
        setTags(tagData);
        setCatalog(allIngredients);
        if (detail) {
          setTitle(detail.summary.title); setDescription(detail.summary.description);
          setServings(detail.summary.servings); setPrep(detail.summary.prepMinutes); setCook(detail.summary.cookMinutes);
          setDifficulty(detail.summary.difficulty); setStatus(detail.summary.status === "Published" ? "Published" : "Draft");
          setIngredients(detail.ingredients.map((item) => ({ ingredientId: item.ingredientId, quantity: item.quantity, unit: item.unit, note: item.note ?? "" })));
          setSteps(detail.steps.map((item) => ({ instruction: item.instruction, durationMinutes: item.durationMinutes ?? null })));
          setImages(detail.images.map((item) => ({ url: item.url, altText: item.altText })));
          setCategoryIds(detail.summary.categories.map((item) => item.id));
          setTagIds(detail.tags.map((item) => item.id));
        }
        setLoading(false);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Không tải được dữ liệu.");
      }
    }
    void load();
    return () => controller.abort();
  }, [id, revision]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const detail = await planningRequest<BackendRecipeDetail>("recipes" + (id ? "/" + encodeURIComponent(id) : ""), {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({
          title: title.trim(), description: description.trim(), servings,
          prepMinutes: prep, cookMinutes: cook, difficulty, status,
          ingredients: ingredients.map((item, index) => ({ ...item, note: item.note.trim() || null, position: index + 1 })),
          steps: steps.map((item, index) => ({ ...item, instruction: item.instruction.trim(), position: index + 1 })),
          categoryIds, tagIds, images: images.map((item, index) => ({ url: item.url.trim(), altText: item.altText.trim(), position: index })),
        }),
      });
      refreshRecipes();
      router.push("/recipes/" + detail.summary.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không lưu được công thức.");
    } finally { lock.current = false; setBusy(false); }
  }
  function toggle(values: string[], id: string) {
    return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
  }
  if (loading) return <><p role={error ? "alert" : "status"}>{error || "Đang tải dữ liệu công thức…"}</p>{error && <button className={control} onClick={() => { setError(""); setRevision((value) => value + 1); }}>Thử lại</button>}</>;
  return <form onSubmit={save} className="space-y-6">
    <h1 className="text-3xl font-bold">{id ? "Chỉnh sửa công thức" : "Đăng công thức"}</h1>
    <fieldset disabled={busy} className="space-y-5">
      <label className="block">Tên món<input className={control + " block w-full"} required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label className="block">Mô tả<textarea className={control + " block w-full"} required maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <div className="flex flex-wrap gap-3">
        <label>Khẩu phần<input className={control + " block w-28"} type="number" required min={1} max={100} value={servings} onChange={(e) => setServings(Number(e.target.value))} /></label>
        <label>Chuẩn bị (phút)<input className={control + " block w-32"} type="number" required min={0} max={1440} value={prep} onChange={(e) => setPrep(Number(e.target.value))} /></label>
        <label>Nấu (phút)<input className={control + " block w-32"} type="number" required min={0} max={1440} value={cook} onChange={(e) => setCook(Number(e.target.value))} /></label>
        <label>Độ khó<select className={control + " block"} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="Easy">Dễ</option><option value="Medium">Trung bình</option><option value="Hard">Khó</option></select></label>
        <label>Trạng thái<select className={control + " block"} value={status} onChange={(e) => setStatus(e.target.value)}><option value="Draft">Bản nháp</option><option value="Published">Xuất bản</option></select></label>
      </div>
      <section className="space-y-3"><h2 className="text-xl font-bold">Nguyên liệu</h2>
        {ingredients.map((item, index) => <div className="flex flex-wrap gap-2" key={index}>
          <select aria-label={"Nguyên liệu " + (index + 1)} className={control} required value={item.ingredientId} onChange={(e) => {
            const selected = catalog.find((entry) => entry.id === e.target.value);
            setIngredients(ingredients.map((entry, position) => position === index ? { ...entry, ingredientId: e.target.value, unit: selected?.defaultUnit ?? "g" } : entry));
          }}><option value="">Chọn nguyên liệu</option>{catalog.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select>
          <input aria-label="Số lượng" className={control + " w-28"} required type="number" step="0.001" min="0.001" max="999999999.999" value={item.quantity} onChange={(e) => setIngredients(ingredients.map((entry, position) => position === index ? { ...entry, quantity: Number(e.target.value) } : entry))} />
          <select aria-label="Đơn vị" className={control} value={item.unit} onChange={(e) => setIngredients(ingredients.map((entry, position) => position === index ? { ...entry, unit: e.target.value } : entry))}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select>
          <input aria-label="Ghi chú nguyên liệu" placeholder="Ghi chú" maxLength={300} className={control} value={item.note} onChange={(e) => setIngredients(ingredients.map((entry, position) => position === index ? { ...entry, note: e.target.value } : entry))} />
          <button type="button" className={control} disabled={ingredients.length <= 1} onClick={() => setIngredients(ingredients.filter((_, position) => position !== index))}>Bỏ</button>
        </div>)}
        <button type="button" className={control} disabled={ingredients.length >= 100} onClick={() => setIngredients([...ingredients, blankIngredient()])}>Thêm nguyên liệu</button>
      </section>
      <section className="space-y-3"><h2 className="text-xl font-bold">Các bước nấu</h2>
        {steps.map((item, index) => <div className="flex flex-wrap gap-2" key={index}>
          <label className="flex-1">Bước {index + 1}<textarea required maxLength={5000} className={control + " block w-full"} value={item.instruction} onChange={(e) => setSteps(steps.map((entry, position) => position === index ? { ...entry, instruction: e.target.value } : entry))} /></label>
          <label>Phút<input className={control + " block w-24"} type="number" min={0} max={1440} value={item.durationMinutes ?? ""} onChange={(e) => setSteps(steps.map((entry, position) => position === index ? { ...entry, durationMinutes: e.target.value === "" ? null : Number(e.target.value) } : entry))} /></label>
          <button type="button" className={control} disabled={steps.length <= 1} onClick={() => setSteps(steps.filter((_, position) => position !== index))}>Bỏ bước</button>
        </div>)}
        <button type="button" className={control} disabled={steps.length >= 100} onClick={() => setSteps([...steps, { instruction: "", durationMinutes: null }])}>Thêm bước</button>
      </section>
      <section><h2 className="text-xl font-bold">Danh mục</h2><div className="flex flex-wrap gap-4">{categories.map((item) => <label key={item.id}><input type="checkbox" checked={categoryIds.includes(item.id)} disabled={!categoryIds.includes(item.id) && categoryIds.length >= 20} onChange={() => setCategoryIds(toggle(categoryIds, item.id))} /> {item.name}</label>)}</div></section>
      <section><h2 className="text-xl font-bold">Thẻ</h2><div className="flex flex-wrap gap-4">{tags.map((item) => <label key={item.id}><input type="checkbox" checked={tagIds.includes(item.id)} disabled={!tagIds.includes(item.id) && tagIds.length >= 20} onChange={() => setTagIds(toggle(tagIds, item.id))} /> {item.name}</label>)}</div></section>
      <section className="space-y-3"><h2 className="text-xl font-bold">Ảnh</h2>
        {images.map((item, index) => <div key={index} className="flex flex-wrap gap-2">
          <input aria-label="Đường dẫn ảnh HTTPS" required type="url" pattern="https://.*" maxLength={2048} placeholder="https://…" className={control + " flex-1"} value={item.url} onChange={(e) => setImages(images.map((entry, position) => position === index ? { ...entry, url: e.target.value } : entry))} />
          <input aria-label="Mô tả ảnh" required maxLength={200} placeholder="Mô tả ảnh" className={control} value={item.altText} onChange={(e) => setImages(images.map((entry, position) => position === index ? { ...entry, altText: e.target.value } : entry))} />
          <button type="button" className={control} onClick={() => setImages(images.filter((_, position) => position !== index))}>Bỏ ảnh</button>
        </div>)}
        <button type="button" className={control} disabled={images.length >= 10} onClick={() => setImages([...images, { url: "", altText: "" }])}>Thêm đường dẫn ảnh</button>
      </section>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <button className="rounded-xl bg-primary px-6 py-3 text-on-primary" disabled={busy || !title.trim() || !description.trim()}>{busy ? "Đang lưu…" : "Lưu công thức"}</button>
      <Link className="ml-4 underline" href="/my-recipes">Công thức của tôi</Link>
    </fieldset>
  </form>;
}
