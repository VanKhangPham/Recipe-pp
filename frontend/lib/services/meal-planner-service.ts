import { DayMealPlan } from "@/lib/types";
import { safeStorage } from "./storage";
import { ApiResponse, simulateNetworkDelay } from "./api-client";

const MEAL_PLAN_STORAGE_KEY = "recipehub_week_plans";

class MealPlannerService {
  async getMealPlans(fallback: DayMealPlan[]): Promise<ApiResponse<DayMealPlan[]>> {
    await simulateNetworkDelay(100);
    const plans = safeStorage.getJSON<DayMealPlan[]>(MEAL_PLAN_STORAGE_KEY, fallback);
    return {
      data: plans,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async saveMealPlans(plans: DayMealPlan[]): Promise<ApiResponse<boolean>> {
    safeStorage.setJSON(MEAL_PLAN_STORAGE_KEY, plans);
    return {
      data: true,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export const mealPlannerService = new MealPlannerService();
