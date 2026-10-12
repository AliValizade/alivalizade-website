import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, access: string, refresh: string) => void;
  logout: () => void;
  setTokens: (access: string, refresh?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false,

      setAuth: (user, access, refresh) =>
        set({
          user,
          access,
          refresh,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          access: null,
          refresh: null,
          isAuthenticated: false,
        }),

      setTokens: (access, refresh) =>
        set((state) => ({
          access,
          refresh: refresh ?? state.refresh,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);