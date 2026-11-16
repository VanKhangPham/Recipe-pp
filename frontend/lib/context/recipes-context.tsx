"use client";

import * as React from "react";
import { Recipe, Review } from "@/lib/types";
import { MASTER_RECIPES } from "@/lib/data/recipes";
import { recipeService } from "@/lib/services/recipe-service";

interface RecipesContextType {
  recipes: Recipe[];
  userRecipes: Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  createRecipe: (recipe: Omit<Recipe, "id"> & { id?: string }) => Recipe;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  moderateRecipe: (id: string, newStatus: "published" | "rejected") => void;
  addReview: (recipeId: string, review: Omit<Review, "id" | "createdAt">) => void;
}

const RecipesContext = React.createContext<RecipesContextType | undefined>(undefined);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [userRecipes, setUserRecipes] = React.useState<Recipe[]>([]);
  const [cloudRecipes, setCloudRecipes] = React.useState<Recipe[]>([]);

  React.useEffect(() => {
    try {
      const stored = recipeService.getLocalUserRecipes();
      setUserRecipes(stored);
    } catch (e) {
      console.warn("[RecipesContext] Load error", e);
    }

    recipeService
      .fetchCloudNeonRecipes()
      .then((liveRecipes) => {
        if (liveRecipes && liveRecipes.length > 0) {
          setCloudRecipes(liveRecipes);
        }
      })
      .catch((err) => {
        console.warn("[RecipesContext] Cloud Neon fetch fallback to presets", err);
      });
  }, []);

  const allRecipes = React.useMemo(() => {
    const seen = new Set<string>();
    const merged: Recipe[] = [];
    for (const item of [...userRecipes, ...cloudRecipes, ...MASTER_RECIPES]) {
      const key = item.title.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
    return merged;
  }, [userRecipes, cloudRecipes]);

  const getRecipeById = (id: string): Recipe | undefined => {
    return allRecipes.find((r) => r.id === id);
  };

  const createRecipe = (data: Omit<Recipe, "id"> & { id?: string }): Recipe => {
    const slug =
      data.id ||
      data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const newRecipe: Recipe = {
      ...data,
      id: slug,
      status: data.status || "published",
      createdAt: "Vừa xong",
      reviews: data.reviews || [],
      bookmarksCount: data.bookmarksCount || 0,
    };

    const next = [newRecipe, ...userRecipes];
    setUserRecipes(next);
    recipeService.saveLocalUserRecipes(next);
    return newRecipe;
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    const next = userRecipes.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setUserRecipes(next);
    recipeService.saveLocalUserRecipes(next);
  };

  const deleteRecipe = (id: string) => {
    const next = userRecipes.filter((r) => r.id !== id);
    setUserRecipes(next);
    recipeService.saveLocalUserRecipes(next);
  };

  const moderateRecipe = (id: string, newStatus: "published" | "rejected") => {
    const next = userRecipes.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setUserRecipes(next);
    recipeService.saveLocalUserRecipes(next);
  };

  const addReview = (recipeId: string, reviewData: Omit<Review, "id" | "createdAt">) => {
    const newRev: Review = {
      ...reviewData,
      id: "rev-" + Date.now(),
      createdAt: "Vừa xong",
    };

    const isUserRecipe = userRecipes.some((r) => r.id === recipeId);
    if (isUserRecipe) {
      const next = userRecipes.map((r) => {
        if (r.id !== recipeId) return r;
        const currentReviews = r.reviews || [];
        const updatedReviews = [newRev, ...currentReviews];
        const newRating = Number(
          (
            updatedReviews.reduce((sum, item) => sum + item.rating, 0) /
            updatedReviews.length
          ).toFixed(1)
        );
        return {
          ...r,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newRating,
        };
      });
      setUserRecipes(next);
      recipeService.saveLocalUserRecipes(next);
    }
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes: allRecipes,
        userRecipes,
        getRecipeById,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        moderateRecipe,
        addReview,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = React.useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
}
