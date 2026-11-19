"use client";

import * as React from "react";
import { Recipe } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { useRecipes } from "@/lib/context/recipes-context";
import { isCloudRecipe } from "@/lib/services/planning-api";
import { useAuth } from "@/lib/context/auth-context";
import { backendFetch } from "@/lib/services/api-client";
import { BackendRecipeSummary, mapBackendToRecipe } from "@/lib/services/recipe-service";
import {
  favoritesService,
  INITIAL_COLLECTIONS,
} from "@/lib/services/favorites-service";

export interface FavoriteItem {
  id: string;
  recipeId: string;
  recipe: Recipe;
  collectionName?: string;
  note?: string;
  createdAt: string;
}

interface FavoritesContextType {
  isLoading: boolean;
  error: string;
  refreshFavorites: () => void;
  favorites: string[];
  favoriteItems: FavoriteItem[];
  collections: string[];
  isFavorited: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string, customRecipe?: Recipe) => boolean;
  addCollection: (name: string) => void;
  assignCollection: (recipeId: string, collectionName: string) => void;
  updateNote: (recipeId: string, note: string) => void;
  removeFavorite: (recipeId: string) => void;
}

const FavoritesContext = React.createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isRestoringSession } = useAuth();
  return <FavoritesSessionProvider key={isRestoringSession ? "restoring" : user?.id ?? "guest"}>{children}</FavoritesSessionProvider>;
}

function FavoritesSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [favoriteItems, setFavoriteItems] = React.useState<FavoriteItem[]>([]);
  const { user, isRestoringSession } = useAuth();
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const ready = React.useRef(false);
  const [revision, setRevision] = React.useState(0);
  const owner = user?.id;
  const { getRecipeById } = useRecipes();
  const mounted = React.useRef(true);
  React.useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const pending = React.useRef(new Set<string>());
  const [collections, setCollections] = React.useState<string[]>(INITIAL_COLLECTIONS);

  React.useEffect(() => {
    if (isRestoringSession) return;
    ready.current = false;
    const controller = new AbortController();
    let active = true;
    async function load() {
      let items: FavoriteItem[] = [];
      if (owner) {
        let page = 1;
        let totalPages = 1;
        do {
          const result = await backendFetch<{ items: BackendRecipeSummary[]; totalPages: number }>(
            "/api/v1/users/me/favorites?page=" + page + "&pageSize=100",
            { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]) });
          if (!active) return;
          if (!result) {
            setFavoriteItems([]);
            setError("Chưa tải được danh sách yêu thích. Hãy thử đăng nhập lại.");
            return;
          }
          items = items.concat(result.items.map((recipe) => ({
            id: recipe.id, recipeId: recipe.id, recipe: mapBackendToRecipe(recipe),
            createdAt: "", collectionName: "Hôm nay nấu",
          })));
          totalPages = result.totalPages;
          page++;
        } while (page <= totalPages);
      }
      if (active) {
        setFavoriteItems(items);
        ready.current = true;
        setError("");
      }
    }
    void load().catch(() => {
      if (active) setError("Không tải được danh sách yêu thích. Vui lòng thử lại.");
    }).finally(() => { if (active) setIsLoading(false); });
    favoritesService.getCollections().then((res) => {
      if (active && res.data) setCollections(res.data);
    });
    return () => { active = false; controller.abort(); };
  }, [owner, isRestoringSession, revision]);

  const persistFavorite = (recipeId: string, added: boolean, previous: FavoriteItem | undefined) => {
    if (!owner) return;
    pending.current.add(recipeId);
    void backendFetch("/api/v1/users/me/favorites/" + encodeURIComponent(recipeId), {
      method: added ? "PUT" : "DELETE",
      signal: AbortSignal.timeout(30_000),
    }).then((result) => {
      pending.current.delete(recipeId);
      if (!mounted.current || result !== null) return;
      setFavoriteItems((items) => previous
        ? [previous, ...items.filter((item) => item.recipeId !== recipeId)]
        : items.filter((item) => item.recipeId !== recipeId));
      setError("Chưa xác nhận được thay đổi yêu thích. Hãy tải lại trang để kiểm tra.");
    });
  };

  const saveCollectionsToStorage = (colls: string[]) => {
    favoritesService.saveCollections(colls);
  };

  const favorites = React.useMemo(() => {
    return favoriteItems.map((item) => item.recipeId);
  }, [favoriteItems]);

  const isFavorited = (recipeId: string): boolean => {
    return favoriteItems.some((item) => item.recipeId === recipeId);
  };

  const toggleFavorite = (recipeId: string, customRecipe?: Recipe): boolean => {
    if (isRestoringSession) return false;
    if (!owner) {
      router.push("/login?returnUrl=" + encodeURIComponent(pathname));
      return false;
    }
    if (!ready.current) {
      setError("Danh sách yêu thích chưa tải xong. Hãy thử lại sau khi tải dữ liệu.");
      return isFavorited(recipeId);
    }
    if (owner && !isCloudRecipe(recipeId)) { setError("Món này chưa có trên máy chủ để lưu vào tài khoản."); return isFavorited(recipeId); }
    if (pending.current.has(recipeId)) return isFavorited(recipeId);
    const existingIndex = favoriteItems.findIndex((item) => item.recipeId === recipeId);
    if (existingIndex >= 0) {
      setFavoriteItems((items) => items.filter((item) => item.recipeId !== recipeId));
      persistFavorite(recipeId, false, favoriteItems[existingIndex]);
      return false;
    } else {
      const recipeToSave = customRecipe || getRecipeById(recipeId);
      if (!recipeToSave) {
        setError("Chưa tải được thông tin món ăn. Hãy mở công thức rồi thử lưu lại.");
        return false;
      }

      const newItem: FavoriteItem = {
        id: "fav-" + Date.now(),
        recipeId,
        recipe: recipeToSave,
        collectionName: "Hôm nay nấu",
        createdAt: "Vừa xong",
      };
      setFavoriteItems((items) => [newItem, ...items.filter((item) => item.recipeId !== recipeId)]);
      persistFavorite(recipeId, true, undefined);
      return true;
    }
  };

  const removeFavorite = (recipeId: string) => {
    if (!owner || isRestoringSession) return;
    if (!ready.current) return;
    if (pending.current.has(recipeId)) return;
    const previous = favoriteItems.find((item) => item.recipeId === recipeId);
    setFavoriteItems((items) => items.filter((item) => item.recipeId !== recipeId));
    persistFavorite(recipeId, false, previous);
  };

  const addCollection = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || collections.includes(trimmed)) return;
    const next = [...collections, trimmed];
    setCollections(next);
    saveCollectionsToStorage(next);
  };

  const assignCollection = (recipeId: string, collectionName: string) => {
    setFavoriteItems((items) => items.map((item) => item.recipeId === recipeId ? { ...item, collectionName } : item));
  };

  const updateNote = (recipeId: string, note: string) => {
    setFavoriteItems((items) => items.map((item) => item.recipeId === recipeId ? { ...item, note } : item));
  };

  return (
    <FavoritesContext.Provider
      value={{
        isLoading,
        error,
        refreshFavorites: () => {
          if (pending.current.size > 0) return;
          setError(""); setIsLoading(true); setRevision((value) => value + 1);
        },
        favorites,
        favoriteItems,
        collections,
        isFavorited,
        toggleFavorite,
        addCollection,
        assignCollection,
        updateNote,
        removeFavorite,
      }}
    >
      {children}
      {error && <div role="alert" className="fixed bottom-5 left-5 z-50 max-w-sm rounded-xl bg-error-container p-4 text-on-error-container">
        {error}<button type="button" className="ml-3 underline" onClick={() => {
          if (pending.current.size > 0) { setError("Đang lưu thay đổi yêu thích. Hãy chờ trước khi tải lại."); return; }
          setError(""); setRevision((value) => value + 1);
        }}>Tải lại</button>
        <button type="button" className="ml-3 underline" onClick={() => setError("")}>Đóng</button>
      </div>}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
