"use client";

import * as React from "react";
import { Recipe, Review } from "@/lib/types";
import { usePathname } from "next/navigation";
import { backendFetch } from "@/lib/services/api-client";
import { isCloudRecipe } from "@/lib/services/planning-api";
import { recipeService } from "@/lib/services/recipe-service";

interface RecipesContextType {
  recipes: Recipe[];
  isLoading: boolean;
  error: string;
  refreshRecipes: () => void;
  getRecipeById: (id: string) => Recipe | undefined;
  addReview: (recipeId: string, review: Omit<Review, "id" | "createdAt">) => Promise<void>;
}

const RecipesContext = React.createContext<RecipesContextType | undefined>(undefined);

function RecipesRouteRevalidator({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  React.useEffect(() => {
    const timer = window.setTimeout(onNavigate, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, onNavigate]);
  return null;
}

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [revision, setRevision] = React.useState(0);
  const requestKey = String(revision);
  const completedAt = React.useRef(0);
  const inFlight = React.useRef(false);
  const [snapshot, setSnapshot] = React.useState<{ key: string; recipes: Recipe[]; error: string } | null>(null);
  const isLoading = snapshot?.key !== requestKey;
  const recipes = snapshot?.recipes ?? [];
  const error = isLoading ? "" : snapshot.error;

  React.useEffect(() => {
    const controller = new AbortController();
    inFlight.current = true;
    // Defer startup so the Strict Mode setup/cleanup probe sends no request.
    const timer = window.setTimeout(() => {
      recipeService.fetchCloudNeonRecipes(controller.signal).then((loaded) => {
        if (!controller.signal.aborted) {
          completedAt.current = Date.now();
          setSnapshot({ key: requestKey, recipes: loaded, error: "" });
        }
      }).catch((cause) => {
        if (!controller.signal.aborted) setSnapshot({
          key: requestKey, recipes: [],
          error: cause instanceof Error ? cause.message : "Không tải được công thức.",
        });
      }).finally(() => {
        if (!controller.signal.aborted) inFlight.current = false;
      });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
      inFlight.current = false;
    };
  }, [requestKey]);

  // A route change must not cancel the shared catalog load. Revalidate a
  // completed catalog on navigation after one minute; manual refresh is immediate.
  const revalidateOnNavigate = React.useCallback(() => {
    if (!inFlight.current && completedAt.current > 0 && Date.now() - completedAt.current >= 60000) {
      setRevision((value) => value + 1);
    }
  }, []);

  const getRecipeById = (id: string) => recipes.find((recipe) => recipe.id === id);
  const refreshRecipes = () => setRevision((value) => value + 1);

  const addReview = async (recipeId: string, reviewData: Omit<Review, "id" | "createdAt">) => {
    if (!isCloudRecipe(recipeId)) {
      throw new Error("Hãy chọn công thức đã xuất bản trên máy chủ để gửi đánh giá.");
    }
    const saved = await backendFetch<{
      id: string; author: { displayName: string }; rating: number; comment: string; createdAt: string;
    }>(`/api/v1/recipes/${recipeId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating: reviewData.rating, comment: reviewData.content }),
      signal: AbortSignal.timeout(30000),
    });
    if (!saved) throw new Error("Chưa xác nhận được đánh giá đã lưu. Kiểm tra kết nối hoặc đăng nhập lại trước khi thử tiếp.");
    const review: Review = {
      id: saved.id, userName: saved.author.displayName,
      userAvatarText: saved.author.displayName.slice(0, 2).toUpperCase(),
      rating: saved.rating, content: saved.comment, createdAt: saved.createdAt,
    };
    setSnapshot((current) => current && ({
      ...current,
      recipes: current.recipes.map((recipe) => recipe.id === recipeId
        ? { ...recipe, reviews: [review, ...recipe.reviews.filter((item) => item.id !== review.id)] }
        : recipe),
    }));
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        isLoading,
        error,
        refreshRecipes,
        getRecipeById,
        addReview,
      }}
    >
      <React.Suspense fallback={null}>
        <RecipesRouteRevalidator onNavigate={revalidateOnNavigate} />
      </React.Suspense>
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

export function RecipeDataStatus() {
  const { isLoading, error, refreshRecipes } = useRecipes();
  if (!isLoading && !error) return null;
  return <div className="fixed bottom-20 left-4 right-4 z-50 rounded-xl border bg-surface p-4 shadow-lg">
    {isLoading ? <p role="status">Đang tải công thức…</p> : <><p role="alert">{error}</p><button className="mt-2 rounded border px-4 py-2" onClick={refreshRecipes}>Thử lại</button></>}
  </div>;
}
