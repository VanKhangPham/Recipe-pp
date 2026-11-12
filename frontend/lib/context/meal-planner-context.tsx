"use client";

import * as React from "react";
import { DayMealPlan, PlannedMeal, Recipe } from "@/lib/types";
import { MASTER_RECIPES } from "@/lib/data/recipes";
import { useShoppingList } from "@/lib/context/shopping-list-context";
import { mealPlannerService } from "@/lib/services/meal-planner-service";

interface MealPlannerContextType {
  weekPlans: DayMealPlan[];
  selectedDayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";
  setSelectedDayId: (dayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN") => void;
  activeDayPlan: DayMealPlan;
  addMealToPlan: (dayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN", recipe: Recipe, mealType: "breakfast" | "lunch" | "dinner" | "snack") => void;
  removeMealFromPlan: (dayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN", mealId: string) => void;
  generateShoppingList: () => number;
}

const INITIAL_WEEK_PLANS: DayMealPlan[] = [
  {
    dayId: "T2",
    dayShort: "T2",
    dayName: "Thứ Hai",
    dateStr: "28/04",
    targetCalories: 2000,
    meals: [
      { id: "m-t2-1", recipeId: "pho-bo-tai-lan", recipeTitle: "Phở bò tái lăn", calories: 420, time: "25p", image: MASTER_RECIPES[1].image, mealType: "breakfast" },
      { id: "m-t2-2", recipeId: "ca-loc-kho-to", recipeTitle: "Cá lóc kho tộ", calories: 340, time: "35p", image: MASTER_RECIPES[0].image, mealType: "lunch" },
      { id: "m-t2-3", recipeId: "canh-suon-non-sau", recipeTitle: "Canh sườn non sấu chua", calories: 285, time: "30p", image: MASTER_RECIPES[4].image, mealType: "dinner" },
    ],
  },
  {
    dayId: "T3",
    dayShort: "T3",
    dayName: "Thứ Ba",
    dateStr: "29/04",
    targetCalories: 2000,
    meals: [
      { id: "m-t3-1", recipeId: "pho-bo-tai-lan", recipeTitle: "Phở bò tái lăn", calories: 380, time: "25p", image: MASTER_RECIPES[1].image, mealType: "breakfast" },
      { id: "m-t3-2", recipeId: "dau-phu-sot-ca-chua", recipeTitle: "Đậu phụ sốt cà chua", calories: 260, time: "20p", image: MASTER_RECIPES[6].image, mealType: "lunch" },
      { id: "m-t3-3", recipeId: "canh-chua-ca-loc", recipeTitle: "Canh chua cá lóc Nam Bộ", calories: 310, time: "30p", image: MASTER_RECIPES[7].image, mealType: "dinner" },
      { id: "m-t3-4", recipeId: "goi-cuon-tom-thit", recipeTitle: "Gỏi cuốn tôm thịt", calories: 220, time: "20p", image: MASTER_RECIPES[3].image, mealType: "snack" },
    ],
  },
  {
    dayId: "T4",
    dayShort: "T4",
    dayName: "Thứ Tư",
    dateStr: "30/04",
    targetCalories: 2000,
    meals: [
      { id: "m-t4-1", recipeId: "bun-bo-hue", recipeTitle: "Bún bò Huế giò heo", calories: 620, time: "60p", image: MASTER_RECIPES[2].image, mealType: "breakfast" },
      { id: "m-t4-2", recipeId: "thit-kho-hot-vit", recipeTitle: "Thịt kho hột vịt nước dừa", calories: 480, time: "60p", image: MASTER_RECIPES[7].image, mealType: "lunch" },
      { id: "m-t4-3", recipeId: "canh-nam-hat-sen", recipeTitle: "Canh nấm hạt sen thanh nhiệt", calories: 180, time: "25p", image: MASTER_RECIPES[8].image, mealType: "dinner" },
    ],
  },
  {
    dayId: "T5",
    dayShort: "T5",
    dayName: "Thứ Năm",
    dateStr: "01/05",
    targetCalories: 2000,
    meals: [
      { id: "m-t5-1", recipeId: "bo-sot-vang", recipeTitle: "Bò sốt vang bánh mì giòn", calories: 510, time: "50p", image: MASTER_RECIPES[5].image, mealType: "breakfast" },
      { id: "m-t5-2", recipeId: "ca-loc-kho-to", recipeTitle: "Cá lóc kho tộ", calories: 340, time: "35p", image: MASTER_RECIPES[0].image, mealType: "lunch" },
    ],
  },
  {
    dayId: "T6",
    dayShort: "T6",
    dayName: "Thứ Sáu",
    dateStr: "02/05",
    targetCalories: 2000,
    meals: [
      { id: "m-t6-1", recipeId: "goi-cuon-tom-thit", recipeTitle: "Gỏi cuốn tôm thịt", calories: 220, time: "20p", image: MASTER_RECIPES[3].image, mealType: "lunch" },
      { id: "m-t6-2", recipeId: "suon-nuong-mat-ong", recipeTitle: "Sườn nướng mật ong", calories: 420, time: "30p", image: MASTER_RECIPES[9].image, mealType: "dinner" },
    ],
  },
  {
    dayId: "T7",
    dayShort: "T7",
    dayName: "Thứ Bảy",
    dateStr: "03/05",
    targetCalories: 2000,
    meals: [
      { id: "m-t7-1", recipeId: "bun-bo-hue", recipeTitle: "Bún bò Huế", calories: 620, time: "60p", image: MASTER_RECIPES[2].image, mealType: "breakfast" },
      { id: "m-t7-2", recipeId: "suon-nuong-mat-ong", recipeTitle: "Sườn nướng mật ong", calories: 420, time: "30p", image: MASTER_RECIPES[9].image, mealType: "dinner" },
    ],
  },
  {
    dayId: "CN",
    dayShort: "CN",
    dayName: "Chủ Nhật",
    dateStr: "04/05",
    targetCalories: 2000,
    meals: [
      { id: "m-cn-1", recipeId: "pho-bo-tai-lan", recipeTitle: "Phở bò tái lăn gia đình", calories: 520, time: "45p", image: MASTER_RECIPES[1].image, mealType: "breakfast" },
      { id: "m-cn-2", recipeId: "bo-sot-vang", recipeTitle: "Bò sốt vang tiệc cuối tuần", calories: 510, time: "50p", image: MASTER_RECIPES[5].image, mealType: "lunch" },
      { id: "m-cn-3", recipeId: "canh-nam-hat-sen", recipeTitle: "Canh nấm hạt sen thanh mát", calories: 180, time: "25p", image: MASTER_RECIPES[8].image, mealType: "dinner" },
    ],
  },
];

const MealPlannerContext = React.createContext<MealPlannerContextType | undefined>(undefined);

export function MealPlannerProvider({ children }: { children: React.ReactNode }) {
  const [weekPlans, setWeekPlans] = React.useState<DayMealPlan[]>(INITIAL_WEEK_PLANS);
  const [selectedDayId, setSelectedDayId] = React.useState<"T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN">("T3");
  const { addIngredientsFromRecipe } = useShoppingList();

  React.useEffect(() => {
    mealPlannerService.getMealPlans(INITIAL_WEEK_PLANS).then((res) => {
      if (res.data) setWeekPlans(res.data);
    });
  }, []);

  const saveToStorage = (plans: DayMealPlan[]) => {
    mealPlannerService.saveMealPlans(plans);
  };

  const activeDayPlan = weekPlans.find((p) => p.dayId === selectedDayId) || weekPlans[1];

  const addMealToPlan = (
    dayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN",
    recipe: Recipe,
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    const newMeal: PlannedMeal = {
      id: "meal-" + Date.now(),
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      calories: recipe.calories,
      time: recipe.totalTime,
      image: recipe.image,
      mealType,
      servings: recipe.servings,
    };

    const next = weekPlans.map((dp) => {
      if (dp.dayId !== dayId) return dp;
      return {
        ...dp,
        meals: [...dp.meals, newMeal],
      };
    });

    setWeekPlans(next);
    saveToStorage(next);
  };

  const removeMealFromPlan = (
    dayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN",
    mealId: string
  ) => {
    const next = weekPlans.map((dp) => {
      if (dp.dayId !== dayId) return dp;
      return {
        ...dp,
        meals: dp.meals.filter((m) => m.id !== mealId),
      };
    });

    setWeekPlans(next);
    saveToStorage(next);
  };

  const generateShoppingList = (): number => {
    let count = 0;
    activeDayPlan.meals.forEach((meal) => {
      const fullRecipe = MASTER_RECIPES.find((r) => r.id === meal.recipeId);
      if (fullRecipe && fullRecipe.ingredients && fullRecipe.ingredients.length > 0) {
        addIngredientsFromRecipe(fullRecipe.title, fullRecipe.ingredients);
        count += fullRecipe.ingredients.length;
      }
    });
    return count;
  };

  return (
    <MealPlannerContext.Provider
      value={{
        weekPlans,
        selectedDayId,
        setSelectedDayId,
        activeDayPlan,
        addMealToPlan,
        removeMealFromPlan,
        generateShoppingList,
      }}
    >
      {children}
    </MealPlannerContext.Provider>
  );
}

export function useMealPlanner() {
  const context = React.useContext(MealPlannerContext);
  if (!context) {
    throw new Error("useMealPlanner must be used within a MealPlannerProvider");
  }
  return context;
}
