"use client";

import * as React from "react";
import { AuthProvider } from "@/lib/context/auth-context";
import { FavoritesProvider } from "@/lib/context/favorites-context";
import { ShoppingListProvider } from "@/lib/context/shopping-list-context";
import { MealPlannerProvider } from "@/lib/context/meal-planner-context";
import { RecipesProvider } from "@/lib/context/recipes-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RecipesProvider>
        <FavoritesProvider>
          <ShoppingListProvider>
            <MealPlannerProvider>
              {children}
            </MealPlannerProvider>
          </ShoppingListProvider>
        </FavoritesProvider>
      </RecipesProvider>
    </AuthProvider>
  );
}
