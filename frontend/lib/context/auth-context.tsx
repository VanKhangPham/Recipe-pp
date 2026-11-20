"use client";

import * as React from "react";
import { authRequest } from "@/lib/services/auth-request";
import { User } from "@/lib/types";
import { safeStorage } from "@/lib/services/storage";
import { backendFetch, setAccessToken, subscribeToSession, waitForSessionRequests, endSession, restoreSession } from "@/lib/services/api-client";

export type DemoPersona = "guest" | "member" | "admin";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isRestoringSession: boolean;
  isDemoMode: boolean;
  currentPersona: DemoPersona;
  login: (email: string, password: string) => Promise<User>;
  loginAs: (persona: DemoPersona) => void;
  logout: () => void;
  updateProfile: (data: { name: string }) => Promise<void>;
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
    bio: "Bếp trưởng điều hành và quản trị viên kiểm duyệt chất lượng nội dung RecipeHub.",
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
  const [isRestoringSession, setIsRestoringSession] = React.useState(true);
  const [currentPersona, setCurrentPersona] = React.useState<DemoPersona>("guest");
  const isDemoMode = false;

  const initialSession = React.useRef<Promise<BackendAuthResponse | null> | null>(null);

  const applySession = React.useCallback((session: BackendAuthResponse) => {
    const { user: profile } = session;
    const isAdmin = profile.roles?.includes("Admin") === true;
    const name = profile.displayName || profile.email;
    const verifiedUser: User = {
      id: profile.id,
      name,
      email: profile.email,
      avatarText: name.slice(0, 2).toUpperCase(),
      role: isAdmin ? "admin" : "user",
    };
    setAccessToken(session.accessToken);
    setUser(verifiedUser);
    setIsLoggedIn(true);
    setCurrentPersona(isAdmin ? "admin" : "member");
    return verifiedUser;
  }, []);

  React.useEffect(() => {
    let active = true;
    const unsubscribe = subscribeToSession((session) => {
      if (!active) return;
      if (session) applySession(session);
      else {
        setUser(null);
        setIsLoggedIn(false);
        setCurrentPersona("guest");
      }
    });
    safeStorage.removeItem(AUTH_USER_KEY);
    initialSession.current ??= restoreSession();
    void initialSession.current.then((session) => {
      if (!active) return;
      if (session?.accessToken) applySession(session);
      setIsRestoringSession(false);
    });
    return () => { active = false; unsubscribe(); };
  }, [applySession]);

  const loginAs = (persona: DemoPersona) => {
    if (persona === "admin" || isLoggedIn || persona === "guest") return;
    setCurrentPersona("member");
  };

  const login = async (email: string, password: string) => {
    await initialSession.current;
    await waitForSessionRequests();
    const session = await authRequest<BackendAuthResponse>("login", { email: email.trim(), password });
    if (!session?.accessToken) {
      throw new Error("Không thể đăng nhập. Kiểm tra email, mật khẩu và kết nối API.");
    }
    return applySession(session);
  };
  const logout = () => {
    void endSession();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPersona("guest");
    safeStorage.removeItem(AUTH_USER_KEY);
  };

  const updateProfile = async (data: { name: string }) => {
    if (!user) throw new Error("Vui lòng đăng nhập lại.");
    const ownerId = user.id;
    const profile = await backendFetch<{ id: string; displayName: string; email: string }>("/api/v1/users/me", {
      method: "PUT",
      body: JSON.stringify({ displayName: data.name.trim() }),
      signal: AbortSignal.timeout(30000),
    });
    if (!profile) throw new Error("Chưa xác nhận được thay đổi. Kiểm tra kết nối và làm mới để đối chiếu.");
    setUser((current) => current?.id === ownerId ? {
      ...current,
      name: profile.displayName,
      avatarText: profile.displayName.slice(0, 2).toUpperCase(),
      email: profile.email,
    } : current);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isRestoringSession,
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
