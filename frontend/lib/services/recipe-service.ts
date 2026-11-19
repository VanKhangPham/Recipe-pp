import { Recipe, Ingredient, CookingStep } from "@/lib/types";
import { MASTER_RECIPES } from "@/lib/data/recipes";
import { safeStorage } from "./storage";
import { ApiResponse, backendFetch, simulateNetworkDelay } from "./api-client";

const USER_RECIPES_STORAGE_KEY = "recipehub_user_recipes";

export interface RecipeFilterParams {
  query?: string;
  category?: string;
  region?: string;
  difficulty?: string;
  cookingTime?: string;
  status?: "published" | "draft" | "pending" | "rejected";
}

interface BackendNamedItem {
  id: string;
  name: string;
  slug: string;
}

export interface BackendRecipeSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string | null;
  author: { id: string; displayName: string };
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  averageRating?: number | null;
  reviewCount: number;
  categories: BackendNamedItem[];
  createdAt: string;
  status?: string | null;
  ingredients?: BackendRecipeDetail["ingredients"];
}

interface BackendPageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface BackendRecipeDetail {
  summary: BackendRecipeSummary;
  ingredients: {
    id: string;
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    note?: string | null;
    position: number;
  }[];
  steps: {
    id: string;
    position: number;
    instruction: string;
    durationMinutes?: number | null;
  }[];
  tags: BackendNamedItem[];
  images: { id: string; url: string; altText: string; position: number }[];
  nutrition?: {
    calories?: number | null;
    proteinGrams?: number | null;
    carbsGrams?: number | null;
    fatGrams?: number | null;
    source: string;
  } | null;
}

const CATEGORY_MAP: Record<
  string,
  { code: Recipe["category"]; name: string; image: string; dietTags: Recipe["dietTags"] }
> = {
  "Các món canh": {
    code: "canh-sup",
    name: "Canh & Súp",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Thanh đạm", "Ít dầu mỡ"],
  },
  "Thịt, gà, vịt": {
    code: "kho-rim",
    name: "Món Kho & Rim",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Giàu Protein"],
  },
  "Cá, tôm, hải sản": {
    code: "kho-rim",
    name: "Hải Sản & Kho",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Giàu Protein"],
  },
  "Trứng và đậu hũ": {
    code: "xao",
    name: "Trứng & Đậu Hũ",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Giàu Protein", "Eat Clean"],
  },
  "Rau, củ, quả": {
    code: "xao",
    name: "Món Xào & Luộc",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Thanh đạm", "Eat Clean"],
  },
  "Cơm, cháo, bún, mì": {
    code: "bun-pho",
    name: "Bún, Phở & Cơm",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Giàu Protein"],
  },
  "Món chay": {
    code: "xao",
    name: "Món Chay",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Thuần chay", "Thanh đạm"],
  },
};

export function mapBackendToRecipe(
  summary: BackendRecipeSummary,
  detail?: BackendRecipeDetail | null
): Recipe {
  const catRaw = summary.categories?.[0]?.name || "Thịt, gà, vịt";
  const catInfo = CATEGORY_MAP[catRaw] || {
    code: "kho-rim" as const,
    name: catRaw,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    dietTags: ["Giàu Protein" as const],
  };

  const diffMap: Record<
    string,
    { label: Recipe["difficulty"]; badge: Recipe["difficultyBadgeColor"] }
  > = {
    Easy: { label: "Dễ làm", badge: "secondary" },
    Medium: { label: "Trung bình", badge: "primary" },
    Hard: { label: "Cầu kỳ", badge: "error" },
  };
  const diff = diffMap[summary.difficulty] || diffMap.Easy;

  const ingredients: Ingredient[] = (detail?.ingredients || summary.ingredients || []).map((ing) => ({
    id: ing.ingredientId || ing.id,
    name: ing.ingredientName,
    amount: `${Number(ing.quantity)} ${ing.unit}`,
    unit: ing.unit,
    note: ing.note || undefined,
    category: "thit-ca",
  }));

  const steps: CookingStep[] = (detail?.steps || []).map((st) => ({
    number: st.position,
    title: `Bước ${st.position}`,
    description: st.instruction,
    durationMinutes: st.durationMinutes ?? Math.max(3, Math.round(summary.cookMinutes / Math.max(1, detail?.steps?.length || 2))),
  }));

  const statusLower = (summary.status || "Published").toLowerCase();
  const mappedStatus: Recipe["status"] =
    statusLower === "draft"
      ? "pending"
      : statusLower === "archived"
      ? "rejected"
      : "published";

  const authorName = summary.author?.displayName || "Bếp RecipeHub";
  const initials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: summary.id,
    title: summary.title,
    description: summary.description,
    author: {
      id: summary.author?.id || "neon-author",
      name: authorName,
      avatarText: initials || "RH",
      title: "Cloud Neon RecipeHub",
    },
    region: "Nam",
    category: catInfo.code,
    categoryName: catInfo.name,
    difficulty: diff.label,
    difficultyBadgeColor: diff.badge,
    prepTimeMinutes: summary.prepMinutes,
    cookTimeMinutes: summary.cookMinutes,
    totalTime: `${summary.totalMinutes} phút`,
    servings: summary.servings,
    calories: detail?.nutrition?.calories ? Number(detail.nutrition.calories) : 320,
    rating: summary.averageRating != null ? Number(summary.averageRating.toFixed(1)) : 0,
    reviewsCount: summary.reviewCount ?? 0,
    bookmarksCount: 24,
    image: summary.coverImageUrl || detail?.images?.[0]?.url || catInfo.image,
    imageAlt: summary.title,
    tags: [catRaw, "Món Việt", "Cloud Neon"],
    dietTags: catInfo.dietTags,
    ingredients,
    steps,
    reviews: [],
    status: mappedStatus,
    createdAt: new Date(summary.createdAt).toLocaleDateString("vi-VN"),
  };
}

class RecipeService {
  /**
   * Fetch catalog cards and ingredients; load cooking details only when a recipe opens.
   */
  async fetchCloudNeonRecipes(signal?: AbortSignal): Promise<Recipe[]> {
    const summaries: BackendRecipeSummary[] = [];
    let pageNumber = 1;
    let totalPages = 1;
    const options = () => ({
      cache: "no-store" as const,
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000),
    });
    do {
      const page = await backendFetch<BackendPageResult<BackendRecipeSummary>>(
        `/api/v1/recipes?page=${pageNumber}&pageSize=100`, options()
      );
      if (!page) throw new Error("Không tải được danh sách công thức. Vui lòng thử lại.");
      summaries.push(...page.items);
      totalPages = page.totalPages;
      pageNumber++;
    } while (pageNumber <= totalPages);

    const recipes: Recipe[] = [];
    // Older running API versions may not expose catalog ingredients until restarted.
    // Keep that compatibility path bounded; current API needs only the list requests.
    for (let offset = 0; offset < summaries.length; offset += 6) {
      const batch = await Promise.all(summaries.slice(offset, offset + 6).map(async (item) => {
        if (Array.isArray(item.ingredients)) return mapBackendToRecipe(item);
        const detail = await backendFetch<BackendRecipeDetail>(`/api/v1/recipes/${item.id}`, options());
        if (!detail) throw new Error("Không tải đủ dữ liệu công thức. Vui lòng thử lại.");
        return mapBackendToRecipe(detail.summary, detail);
      }));
      recipes.push(...batch);
    }
    return recipes;
  }

  /**
   * Retrieves published recipes from the backend
   */
  async getAllRecipes(filters?: RecipeFilterParams): Promise<ApiResponse<Recipe[]>> {
    let combined = await this.fetchCloudNeonRecipes();

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
   * Get single recipe by ID (checks Cloud Neon API first if UUID, then local + presets)
   */
  async getRecipeById(id: string): Promise<ApiResponse<Recipe | null>> {
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const detail = await backendFetch<BackendRecipeDetail>(`/api/v1/recipes/${id}`);
      if (detail) {
        return {
          data: mapBackendToRecipe(detail.summary, detail),
          success: true,
          timestamp: new Date().toISOString(),
        };
      }
    }

    await simulateNetworkDelay(80);
    const userRecipes = this.getLocalUserRecipes();
    const found = [...userRecipes, ...MASTER_RECIPES].find((r) => r.id === id) || null;
    return {
      data: found,
      success: !!found,
      timestamp: new Date().toISOString(),
    };
  }

  async createRecipe(data: Omit<Recipe, "id"> & { id?: string }): Promise<ApiResponse<Recipe>> {
    await simulateNetworkDelay(200);
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
      message: "Công thức đã được lưu thành công",
      timestamp: new Date().toISOString(),
    };
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<ApiResponse<Recipe | null>> {
    await simulateNetworkDelay(150);
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
      message: updatedRecipe ? "Cập nhật thành công" : "Không tìm thấy công thức",
      timestamp: new Date().toISOString(),
    };
  }

  async deleteRecipe(id: string): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(150);
    const current = this.getLocalUserRecipes();
    const next = current.filter((r) => r.id !== id);
    this.saveLocalUserRecipes(next);
    return {
      data: true,
      success: true,
      message: "Đã xóa công thức",
      timestamp: new Date().toISOString(),
    };
  }

  async moderateRecipe(id: string, newStatus: "published" | "rejected"): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(150);
    const current = this.getLocalUserRecipes();
    const next = current.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    this.saveLocalUserRecipes(next);
    return {
      data: true,
      success: true,
      message: `Đã ${newStatus === "published" ? "duyệt" : "từ chối"} công thức`,
      timestamp: new Date().toISOString(),
    };
  }

  getLocalUserRecipes(): Recipe[] {
    return safeStorage.getJSON<Recipe[]>(USER_RECIPES_STORAGE_KEY, []);
  }

  saveLocalUserRecipes(items: Recipe[]): void {
    safeStorage.setJSON(USER_RECIPES_STORAGE_KEY, items);
  }
}

export const recipeService = new RecipeService();
