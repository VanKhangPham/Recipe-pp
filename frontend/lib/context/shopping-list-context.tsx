"use client";

import * as React from "react";
import { ShoppingItem } from "@/lib/types";
import { shoppingService, INITIAL_SHOPPING_ITEMS } from "@/lib/services/shopping-service";

interface ShoppingListContextType {
  items: ShoppingItem[];
  addItem: (item: { name: string; amount: string; category?: "rau-cu" | "thit-ca" | "gia-vi" | "khac"; cost?: number; subtext?: string }) => void;
  addIngredientsFromRecipe: (recipeTitle: string, ingredients: { name: string; amount: string; unit?: string }[]) => void;
  toggleCheck: (id: string) => void;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  totalCost: number;
  totalCount: number;
  checkedCount: number;
  progressPercent: number;
  keepScreenOn: boolean;
  toggleKeepScreenOn: () => Promise<boolean>;
}

const ShoppingListContext = React.createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ShoppingItem[]>(INITIAL_SHOPPING_ITEMS);
  const [keepScreenOn, setKeepScreenOn] = React.useState(false);
  const wakeLockRef = React.useRef<WakeLockSentinel | null>(null);

  React.useEffect(() => {
    shoppingService.getShoppingItems().then((res) => {
      if (res.data) {
        setItems(res.data);
      }
    });
  }, []);

  const saveToStorage = (newItems: ShoppingItem[]) => {
    shoppingService.saveShoppingItems(newItems);
  };

  const addItem = ({
    name,
    amount,
    category = "rau-cu",
    cost = 0,
    subtext,
  }: {
    name: string;
    amount: string;
    category?: "rau-cu" | "thit-ca" | "gia-vi" | "khac";
    cost?: number;
    subtext?: string;
  }) => {
    const newItem: ShoppingItem = {
      id: "shop-" + Date.now() + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      amount: amount.trim() || "1 phần",
      category,
      checked: false,
      cost,
      subtext,
      createdAt: "Vừa xong",
    };
    const next = [newItem, ...items];
    setItems(next);
    saveToStorage(next);
  };

  const addIngredientsFromRecipe = (
    recipeTitle: string,
    ingredients: { name: string; amount: string; unit?: string }[]
  ) => {
    const newItems: ShoppingItem[] = ingredients.map((ing) => {
      const lower = ing.name.toLowerCase();
      let cat: "rau-cu" | "thit-ca" | "gia-vi" | "khac" = "rau-cu";
      if (
        lower.includes("thịt") ||
        lower.includes("bò") ||
        lower.includes("heo") ||
        lower.includes("cá") ||
        lower.includes("tôm") ||
        lower.includes("xương") ||
        lower.includes("gà") ||
        lower.includes("sườn")
      ) {
        cat = "thit-ca";
      } else if (
        lower.includes("mắm") ||
        lower.includes("tiêu") ||
        lower.includes("đường") ||
        lower.includes("dầu") ||
        lower.includes("muối") ||
        lower.includes("nước dừa") ||
        lower.includes("hồi") ||
        lower.includes("quế") ||
        lower.includes("gia vị")
      ) {
        cat = "gia-vi";
      }

      return {
        id: "shop-" + Date.now() + Math.random().toString(36).substring(2, 6),
        name: ing.name,
        amount: ing.unit ? `${ing.amount} ${ing.unit}` : ing.amount,
        category: cat,
        checked: false,
        subtext: `Từ món: ${recipeTitle}`,
        createdAt: "Vừa xong",
      };
    });

    const next = [...newItems, ...items];
    setItems(next);
    saveToStorage(next);
  };

  const toggleCheck = (id: string) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(next);
    saveToStorage(next);
  };

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    saveToStorage(next);
  };

  const clearCompleted = () => {
    const next = items.filter((item) => !item.checked);
    setItems(next);
    saveToStorage(next);
  };

  const clearAll = () => {
    setItems([]);
    saveToStorage([]);
  };

  const totalCost = React.useMemo(() => {
    return items.reduce((sum, item) => sum + (item.cost || 0), 0);
  }, [items]);

  const totalCount = items.length;
  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const toggleKeepScreenOn = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("wakeLock" in navigator)) {
      return false;
    }

    try {
      if (!keepScreenOn) {
        const lock = await navigator.wakeLock.request("screen");
        wakeLockRef.current = lock;
        lock.addEventListener("release", () => {
          setKeepScreenOn(false);
        });
        setKeepScreenOn(true);
        return true;
      } else {
        if (wakeLockRef.current) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
        setKeepScreenOn(false);
        return false;
      }
    } catch (err) {
      console.warn("WakeLock error:", err);
      setKeepScreenOn(false);
      return false;
    }
  };

  React.useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        addItem,
        addIngredientsFromRecipe,
        toggleCheck,
        removeItem,
        clearCompleted,
        clearAll,
        totalCost,
        totalCount,
        checkedCount,
        progressPercent,
        keepScreenOn,
        toggleKeepScreenOn,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = React.useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
}
