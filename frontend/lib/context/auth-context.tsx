"use client";

import * as React from "react";
import { User } from "@/lib/types";
import { safeStorage } from "@/lib/services/storage";

export type DemoPersona = "guest" | "member" | "admin";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isDemoMode: boolean;
  currentPersona: DemoPersona;
  login: (email: string, name?: string, role?: "user" | "admin") => void;
  loginAs: (persona: DemoPersona) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const DEMO_USERS: Record<"member" | "admin", User> = {
  member: {
    id: "usr-nam-nguyen",
    name: "Nguyễn Hoàng Nam",
    email: "hoangnam.chef@gmail.com",
    avatarText: "HN",
    role: "user",
    bio: "Đam mê nấu ăn gia đình, yêu thích các món canh và kho đậm đà chuẩn vị miền Trung.",
    location: "Đà Nẵng",
    joinedDate: "Tháng 08/2023",
    stats: {
      recipesCount: 4,
      favoritesCount: 19,
      followersCount: 85,
      followingCount: 32,
    },
  },
  admin: {
    id: "usr-phuc-le",
    name: "Lê Hoàng Phúc",
    email: "phuc.le@recipehub.vn",
    avatarText: "HP",
    role: "admin",
    bio: "Bếp trưởng điều hành và quản trị viên kiểm duyệt chất lượng nội dung RecipeHub.",
    location: "TP. Hồ Chí Minh",
    joinedDate: "Tháng 03/2023",
    stats: {
      recipesCount: 12,
      favoritesCount: 28,
      followersCount: 340,
      followingCount: 45,
    },
  },
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "recipehub_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [currentPersona, setCurrentPersona] = React.useState<DemoPersona>("guest");
  const isDemoMode = true; // Clear frontend demo flag

  React.useEffect(() => {
    try {
      const storedUserData = safeStorage.getJSON<User | null>(AUTH_USER_KEY, null);
      if (storedUserData) {
        setUser(storedUserData);
        setIsLoggedIn(true);
        setCurrentPersona(storedUserData.role === "admin" ? "admin" : "member");
      }
    } catch (e) {
      console.warn("[AuthContext] Could not load demo user from safeStorage", e);
    }
  }, []);

  /**
   * Quick persona switch for testing guest, member, and admin UI views
   */
  const loginAs = (persona: DemoPersona) => {
    if (persona === "guest") {
      setUser(null);
      setIsLoggedIn(false);
      setCurrentPersona("guest");
      safeStorage.removeItem(AUTH_USER_KEY);
      return;
    }

    const templateUser = DEMO_USERS[persona];
    setUser(templateUser);
    setIsLoggedIn(true);
    setCurrentPersona(persona);
    safeStorage.setJSON(AUTH_USER_KEY, templateUser);
  };

  /**
   * Simulated login with user-provided email & name
   * NOTE: Frontend only. No real password verification or JWT issuance occurs here.
   */
  const login = (email: string, name?: string, role: "user" | "admin" = "user") => {
    const fallbackTemplate = DEMO_USERS[role];
    const newUser: User = {
      ...fallbackTemplate,
      id: "usr-" + Date.now(),
      email: email.trim() || fallbackTemplate.email,
      name: name?.trim() || email.split("@")[0].toUpperCase() || fallbackTemplate.name,
      avatarText: (name?.trim() || email).slice(0, 2).toUpperCase(),
      role: role,
    };

    setUser(newUser);
    setIsLoggedIn(true);
    setCurrentPersona(role === "admin" ? "admin" : "member");
    safeStorage.setJSON(AUTH_USER_KEY, newUser);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPersona("guest");
    safeStorage.removeItem(AUTH_USER_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    safeStorage.setJSON(AUTH_USER_KEY, updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isDemoMode,
        currentPersona,
        login,
        loginAs,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
