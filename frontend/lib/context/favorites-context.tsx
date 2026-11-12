"use client";

import * as React from "react";
import { Recipe } from "@/lib/types";
import { MASTER_RECIPES } from "@/lib/data/recipes";
import {
  favoritesService,
  INITIAL_FAVORITES,
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
  const [favoriteItems, setFavoriteItems] = React.useState<FavoriteItem[]>(INITIAL_FAVORITES);
  const [collections, setCollections] = React.useState<string[]>(INITIAL_COLLECTIONS);

  React.useEffect(() => {
    favoritesService.getFavorites().then((res) => {
      if (res.data) setFavoriteItems(res.data);
    });
    favoritesService.getCollections().then((res) => {
      if (res.data) setCollections(res.data);
    });
  }, []);

  const saveToStorage = (items: FavoriteItem[]) => {
    favoritesService.saveFavorites(items);
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
    const existingIndex = favoriteItems.findIndex((item) => item.recipeId === recipeId);
    if (existingIndex >= 0) {
      const next = favoriteItems.filter((item) => item.recipeId !== recipeId);
      setFavoriteItems(next);
      saveToStorage(next);
      return false;
    } else {
      const recipeToSave =
        customRecipe ||
        MASTER_RECIPES.find((r) => r.id === recipeId) || {
          id: recipeId,
          title: "Món ăn truyền thống",
          description: "Món ngon đậm vị gia đình",
          author: { id: "a1", name: "Bếp Nhà", avatarText: "BN" },
          region: "Nam" as const,
          category: "kho-rim" as const,
          categoryName: "Món Kho",
          difficulty: "Dễ làm" as const,
          difficultyBadgeColor: "secondary" as const,
          prepTimeMinutes: 15,
          cookTimeMinutes: 30,
          totalTime: "45 phút",
          servings: 4,
          calories: 320,
          rating: 4.8,
          reviewsCount: 1,
          bookmarksCount: 1,
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
          imageAlt: "Món ăn truyền thống",
          tags: ["Món ngon"],
          dietTags: ["Ít dầu mỡ" as const],
          ingredients: [],
          steps: [],
          reviews: [],
        };

      const newItem: FavoriteItem = {
        id: "fav-" + Date.now(),
        recipeId,
        recipe: recipeToSave,
        collectionName: "Hôm nay nấu",
        createdAt: "Vừa xong",
      };
      const next = [newItem, ...favoriteItems];
      setFavoriteItems(next);
      saveToStorage(next);
      return true;
    }
  };

  const removeFavorite = (recipeId: string) => {
    const next = favoriteItems.filter((item) => item.recipeId !== recipeId);
    setFavoriteItems(next);
    saveToStorage(next);
  };

  const addCollection = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || collections.includes(trimmed)) return;
    const next = [...collections, trimmed];
    setCollections(next);
    saveCollectionsToStorage(next);
  };

  const assignCollection = (recipeId: string, collectionName: string) => {
    const next = favoriteItems.map((item) =>
      item.recipeId === recipeId ? { ...item, collectionName } : item
    );
    setFavoriteItems(next);
    saveToStorage(next);
  };

  const updateNote = (recipeId: string, note: string) => {
    const next = favoriteItems.map((item) =>
      item.recipeId === recipeId ? { ...item, note } : item
    );
    setFavoriteItems(next);
    saveToStorage(next);
  };

  return (
    <FavoritesContext.Provider
      value={{
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
