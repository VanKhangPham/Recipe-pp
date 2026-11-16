"use client";

import * as React from "react";
import { User } from "@/lib/types";
import { safeStorage } from "@/lib/services/storage";
import { backendFetch, setAccessToken } from "@/lib/services/api-client";

export type DemoPersona = "guest" | "member" | "admin";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isDemoMode: boolean;
  currentPersona: DemoPersona;
  login: (email: string, name?: string, role?: "user" | "admin", password?: string) => void;
  loginAs: (persona: DemoPersona) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const DEMO_USERS: Record<"member" | "admin", User> = {
  member: {
    id: "96fa8c23-a1af-4199-a0e7-82cd170dc150",
    name: "Nguyễn Hoàng Nam",
    email: "hoangnam.chef@gmail.com",
    avatarText: "HN",
    role: "user",
    bio: "Đam mê nấu ăn gia đình, yêu thích các món canh và kho đậm đà chuẩn vị miền Trung.",
    location: "Đà Nẵng",
    joinedDate: "Tháng 08/2023",
    stats: {
      recipesCount: 23,
      favoritesCount: 19,
      followersCount: 85,
      followingCount: 32,
    },
  },
  admin: {
    id: "fea6e3a3-bb7d-41fb-931a-31ab16f5bb49",
    name: "Administrator (RecipeHub)",
    email: "admin@recipehub.local",
    avatarText: "AD",
    role: "admin",
    bio: "Bếp trưởng điều hành và quản trị viên kiểm duyệt chất lượng nội dung RecipeHub (Cloud Neon).",
    location: "TP. Hồ Chí Minh",
    joinedDate: "Tháng 03/2023",
    stats: {
      recipesCount: 301,
      favoritesCount: 28,
      followersCount: 340,
      followingCount: 45,
    },
  },
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "recipehub_demo_user";

interface BackendAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    roles?: string[];
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [currentPersona, setCurrentPersona] = React.useState<DemoPersona>("guest");
  const isDemoMode = false;

  React.useEffect(() => {
    try {
      const storedUserData = safeStorage.getJSON<User | null>(AUTH_USER_KEY, null);
      if (storedUserData) {
        setUser(storedUserData);
        setIsLoggedIn(true);
        setCurrentPersona(storedUserData.role === "admin" ? "admin" : "member");
      }
    } catch (e) {
      console.warn("[AuthContext] Could not load user from safeStorage", e);
    }
  }, []);

  const loginAs = (persona: DemoPersona) => {
    if (persona === "guest") {
      setUser(null);
      setIsLoggedIn(false);
      setCurrentPersona("guest");
      setAccessToken(null);
      safeStorage.removeItem(AUTH_USER_KEY);
      return;
    }

    const templateUser = DEMO_USERS[persona];
    setUser(templateUser);
    setIsLoggedIn(true);
    setCurrentPersona(persona);
    safeStorage.setJSON(AUTH_USER_KEY, templateUser);
  };

  const login = (
    email: string,
    name?: string,
    role: "user" | "admin" = "user",
    password?: string
  ) => {
    const fallbackTemplate = DEMO_USERS[role];
    const newUser: User = {
      ...fallbackTemplate,
      id: role === "admin" ? DEMO_USERS.admin.id : DEMO_USERS.member.id,
      email: email.trim() || fallbackTemplate.email,
      name: name?.trim() || email.split("@")[0].toUpperCase() || fallbackTemplate.name,
      avatarText: (name?.trim() || email).slice(0, 2).toUpperCase(),
      role: role,
    };

    setUser(newUser);
    setIsLoggedIn(true);
    setCurrentPersona(role === "admin" ? "admin" : "member");
    safeStorage.setJSON(AUTH_USER_KEY, newUser);

    if (password) {
      backendFetch<BackendAuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      }).then((res) => {
        if (res?.accessToken) {
          setAccessToken(res.accessToken);
          const isAdmin = res.user?.roles?.includes("Admin") || role === "admin";
          const verifiedUser: User = {
            ...newUser,
            id: res.user.id,
            email: res.user.email,
            name: res.user.displayName || newUser.name,
            role: isAdmin ? "admin" : "user",
          };
          setUser(verifiedUser);
          setCurrentPersona(isAdmin ? "admin" : "member");
          safeStorage.setJSON(AUTH_USER_KEY, verifiedUser);
        }
      });
    }
  };

  const logout = () => {
    backendFetch("/api/v1/auth/logout", { method: "POST" });
    setAccessToken(null);
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
    if (data.name) {
      backendFetch("/api/v1/users/me", {
        method: "PUT",
        body: JSON.stringify({ displayName: data.name }),
      });
    }
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
