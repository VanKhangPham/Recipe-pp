import { authenticatedFetch } from "./api-client";

export interface MealEntry {
  id: string; recipeId: string; recipeTitle: string; plannedDate: string;
  mealType: string; servings: number;
}
export interface MealPlan { id: string; weekStart: string; items: MealEntry[] }
export interface ShoppingEntry {
  id: string; ingredientName: string; quantity: number; unit: string;
  isPurchased: boolean; note: string | null;
}
export interface ShoppingList { id: string; name: string; mealPlanId: string | null; items: ShoppingEntry[] }
export interface Page<T> { items: T[]; totalCount: number; totalPages: number }
export class PlanningError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

// Keep HTTP status: a missing weekly plan must not be confused with a connection failure.
export async function planningRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await authenticatedFetch(`/api/v1/${path}`, {
    ...options, cache: "no-store",
  });
  if (!response.ok) throw new PlanningError(response.status,
    response.status === 401 ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." :
    response.status === 409 ? "Dữ liệu đã thay đổi. Vui lòng làm mới rồi thử lại." :
    "Không thể hoàn tất thao tác. Vui lòng kiểm tra kết nối và thử lại.");
  return response.status === 204 ? undefined as T : response.json();
}

export function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function weekMonday(): string {
  const date = new Date();
  date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  return localDate(date);
}
export function dayOffset(week: string, offset: number): string {
  const date = new Date(`${week}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return localDate(date);
}

export async function ensureMealPlan(week: string): Promise<MealPlan> {
  try { return await planningRequest<MealPlan>(`meal-plans?weekStart=${week}`); }
  catch (error) {
    if (!(error instanceof PlanningError && error.status === 404)) throw error;
  }
  try {
    return await planningRequest<MealPlan>("meal-plans", { method: "POST", body: JSON.stringify({ weekStart: week }) });
  } catch (error) {
    if (!(error instanceof PlanningError && error.status === 409)) throw error;
    return planningRequest<MealPlan>(`meal-plans?weekStart=${week}`);
  }
}

export function isCloudRecipe(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function recipePlannerLink(id: string, servings = 1): string {
  return `/meal-planner?recipe=${encodeURIComponent(id)}&servings=${encodeURIComponent(servings)}`;
}

export async function addRecipeToCurrentWeek(recipeId: string, day: string, mealType: string, servings: number) {
  const offset = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].indexOf(day);
  const type = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" }[mealType];
  if (!isCloudRecipe(recipeId) || offset < 0 || !type || !Number.isInteger(servings) || servings < 1 || servings > 100)
    throw new Error("Vui lòng chọn công thức đã xuất bản và khẩu phần hợp lệ trong trang Thực đơn.");
  const week = weekMonday();
  const plan = await ensureMealPlan(week);
  return planningRequest<MealEntry>(`meal-plans/${plan.id}/items`, { method: "POST", body: JSON.stringify({
    recipeId, plannedDate: dayOffset(week, offset), mealType: type, servings,
  }) });
}
