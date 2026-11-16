export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarText: string;
  role: "user" | "admin" | "moderator";
  bio?: string;
  location?: string;
  joinedDate?: string;
  stats?: {
    recipesCount: number;
    favoritesCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  note?: string;
  category?: "rau-cu" | "thit-ca" | "gia-vi" | "khac";
}

export interface CookingStep {
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  chefTip?: string;
  image?: string;
  ingredients?: { name: string; note?: string }[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  userAvatarText: string;
  location?: string;
  rating: number;
  createdAt: string;
  content: string;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    avatarText: string;
    title?: string;
  };
  region: "Bắc" | "Trung" | "Nam" | "Miền Tây";
  category: "kho-rim" | "canh-sup" | "xao" | "nuong" | "bun-pho" | "trang-mieng";
  categoryName: string;
  difficulty: "Dễ làm" | "Trung bình" | "Cầu kỳ";
  difficultyBadgeColor: "secondary" | "primary" | "error";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTime: string;
  servings: number;
  calories: number;
  rating: number;
  reviewsCount: number;
  bookmarksCount: number;
  image: string;
  imageAlt: string;
  tags: string[];
  dietTags: ("Thuần chay" | "Thanh đạm" | "Ít dầu mỡ" | "Keto / Low-carb" | "Giàu Protein" | "Eat Clean")[];
  ingredients: Ingredient[];
  steps: CookingStep[];
  reviews: Review[];
  status?: "published" | "draft" | "pending" | "rejected";
  createdAt?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  cost?: number;
  checked: boolean;
  category: "rau-cu" | "thit-ca" | "gia-vi" | "khac";
  fromRecipe?: string;
  subtext?: string;
  freshBadge?: string;
  mergedTag?: string;
  createdAt: string;
}

export interface PlannedMeal {
  id: string;
  recipeId: string;
  recipeTitle: string;
  calories: number;
  time: string;
  image: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  servings?: number;
}

export interface DayMealPlan {
  dayId: "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";
  dayShort: string;
  dayName: string;
  dateStr: string;
  targetCalories: number;
  meals: PlannedMeal[];
}
