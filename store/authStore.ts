import { create } from "zustand";
import { requestJson } from "@/lib/api";
import type { SessionUser } from "@/types";

// unknown — ещё не спрашивали сервер; страницы статические, поэтому пользователь узнаётся на клиенте
type AuthStatus = "unknown" | "loading" | "authenticated" | "guest";

interface AuthState {
  user: SessionUser | null;
  status: AuthStatus;
  loadUser: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "unknown",
  loadUser: async () => {
    if (get().status !== "unknown") return;
    set({ status: "loading" });
    const result = await requestJson<{ user: SessionUser | null }>("/api/auth/me");
    const user = result.ok ? result.data.user : null;
    set({ user, status: user ? "authenticated" : "guest" });
  },
  setUser: (user) => set({ user, status: user ? "authenticated" : "guest" }),
  logout: async () => {
    const result = await requestJson("/api/auth/logout", { body: {} });
    if (result.ok) set({ user: null, status: "guest" });
    return result.ok;
  },
}));
