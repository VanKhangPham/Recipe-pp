import { FavoriteItem } from "@/lib/context/favorites-context";
import { MASTER_RECIPES } from "@/lib/data/recipes";
import { safeStorage } from "./storage";
import { ApiResponse, simulateNetworkDelay } from "./api-client";

const FAVORITES_STORAGE_KEY = "recipehub_favorites_data";
const COLLECTIONS_STORAGE_KEY = "recipehub_collections";

export const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: "fav-1",
    recipeId: "ca-loc-kho-to",
    recipe: MASTER_RECIPES[0],
    collectionName: "Mâm cơm Nam Bộ",
    note: "Mẹ dặn cho thêm chút tiêu sọ đập dập cuối bữa và để lửa riu riu cho thấm.",
    createdAt: "3 ngày trước",
  },
  {
    id: "fav-2",
    recipeId: "pho-bo-tai-lan",
    recipe: MASTER_RECIPES[1],
    collectionName: "Hôm nay nấu",
    note: "Chảo gang phải thật nóng già trước khi cho thịt bò vào.",
    createdAt: "4 ngày trước",
  },
  {
    id: "fav-3",
    recipeId: "canh-chua-ca-loc",
    recipe: MASTER_RECIPES[6],
    collectionName: "Mâm cơm Nam Bộ",
    createdAt: "5 ngày trước",
  },
  {
    id: "fav-4",
    recipeId: "thit-kho-hot-vit",
    recipe: MASTER_RECIPES[5],
    collectionName: "Món kho kẹo đưa cơm",
    createdAt: "1 tuần trước",
  },
  {
    id: "fav-5",
    recipeId: "goi-cuon-tom-thit",
    recipe: MASTER_RECIPES[3],
    collectionName: "Món chay & thanh đạm",
    createdAt: "2 tuần trước",
  },
];

export const INITIAL_COLLECTIONS: string[] = [
  "Tất cả",
  "Hôm nay nấu",
  "Mâm cơm Nam Bộ",
  "Món kho kẹo đưa cơm",
  "Món chay & thanh đạm",
];

class FavoritesService {
  async getFavorites(): Promise<ApiResponse<FavoriteItem[]>> {
    await simulateNetworkDelay();
    const favs = safeStorage.getJSON<FavoriteItem[]>(FAVORITES_STORAGE_KEY, []);
    return {
      data: favs,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async saveFavorites(items: FavoriteItem[]): Promise<ApiResponse<boolean>> {
    safeStorage.setJSON(FAVORITES_STORAGE_KEY, items);
    safeStorage.setJSON("recipehub_guest_favs", items.map((i) => i.recipeId));
    return {
      data: true,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async getCollections(): Promise<ApiResponse<string[]>> {
    const colls = safeStorage.getJSON<string[]>(COLLECTIONS_STORAGE_KEY, INITIAL_COLLECTIONS);
    return {
      data: colls,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async saveCollections(collections: string[]): Promise<ApiResponse<boolean>> {
    safeStorage.setJSON(COLLECTIONS_STORAGE_KEY, collections);
    return {
      data: true,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export const favoritesService = new FavoritesService();
