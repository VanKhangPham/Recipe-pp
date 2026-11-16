import { Recipe, Review } from "@/lib/types";
import { MASTER_RECIPES } from "@/lib/data/recipes";
import { safeStorage } from "./storage";
import { ApiResponse, simulateNetworkDelay } from "./api-client";

const USER_RECIPES_STORAGE_KEY = "recipehub_user_recipes";

export interface RecipeFilterParams {
  query?: string;
  category?: string;
  region?: string;
  difficulty?: string;
  cookingTime?: string;
  status?: "published" | "draft" | "pending" | "rejected";
}

class RecipeService {
  /**
   * Retrieves all recipes (master presets + local user recipes)
   */
  async getAllRecipes(filters?: RecipeFilterParams): Promise<ApiResponse<Recipe[]>> {
    await simulateNetworkDelay();
    const userRecipes = this.getLocalUserRecipes();
    let combined = [...userRecipes, ...MASTER_RECIPES];

    if (filters) {
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        combined = combined.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (filters.category && filters.category !== "all") {
        combined = combined.filter((r) => r.category === filters.category);
      }
      if (filters.region && filters.region !== "all") {
        combined = combined.filter((r) => r.region === filters.region);
      }
      if (filters.difficulty && filters.difficulty !== "all") {
        combined = combined.filter((r) => r.difficulty === filters.difficulty);
      }
      if (filters.status) {
        combined = combined.filter((r) => (r.status || "published") === filters.status);
      }
    }

    return {
      data: combined,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get single recipe by ID
   */
  async getRecipeById(id: string): Promise<ApiResponse<Recipe | null>> {
    await simulateNetworkDelay(100);
    const userRecipes = this.getLocalUserRecipes();
    const found = [...userRecipes, ...MASTER_RECIPES].find((r) => r.id === id) || null;
    return {
      data: found,
      success: !!found,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create recipe (mock adapter saving to local storage)
   */
  async createRecipe(data: Omit<Recipe, "id"> & { id?: string }): Promise<ApiResponse<Recipe>> {
    await simulateNetworkDelay(300);
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

    const current = this.getLocalUserRecipes();
    const updated = [newRecipe, ...current];
    this.saveLocalUserRecipes(updated);

    return {
      data: newRecipe,
      success: true,
      message: "Công thức đã được lưu thành công [Dữ liệu demo]",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Update existing recipe
   */
  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe | null>> {
    await simulateNetworkDelay(200);
    const current = this.getLocalUserRecipes();
    let updatedRecipe: Recipe | null = null;

    const next = current.map((r) => {
      if (r.id === id) {
        updatedRecipe = { ...r, ...updates };
        return updatedRecipe;
      }
      return r;
    });

    if (updatedRecipe) {
      this.saveLocalUserRecipes(next);
    }

    return {
      data: updatedRecipe,
      success: !!updatedRecipe,
      message: updatedRecipe ? "Cập nhật thành công [Demo]" : "Không tìm thấy công thức",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Delete recipe
   */
  async deleteRecipe(id: string): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(200);
    const current = this.getLocalUserRecipes();
    const next = current.filter((r) => r.id !== id);
    this.saveLocalUserRecipes(next);
    return {
      data: true,
      success: true,
      message: "Đã xóa công thức [Demo]",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Admin: Approve or Reject a recipe
   */
  async moderateRecipe(id: string, newStatus: "published" | "rejected"): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(200);
    const current = this.getLocalUserRecipes();
    const next = current.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    this.saveLocalUserRecipes(next);
    return {
      data: true,
      success: true,
      message: `Đã ${newStatus === "published" ? "duyệt" : "từ chối"} công thức [Demo]`,
      timestamp: new Date().toISOString(),
    };
  }

  // Internal helper for user recipes storage
  getLocalUserRecipes(): Recipe[] {
    return safeStorage.getJSON<Recipe[]>(USER_RECIPES_STORAGE_KEY, []);
  }

  saveLocalUserRecipes(items: Recipe[]): void {
    safeStorage.setJSON(USER_RECIPES_STORAGE_KEY, items);
  }
}

export const recipeService = new RecipeService();
