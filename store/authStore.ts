import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  vineyardId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  _hasHydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      login: async (email: string, password: string) => {
        try {
          const { authService } = await import("@/api");
          const response = await authService.login(email, password);
          
          if (response && response.access_token) {
            const { access_token, user } = response;
            set({
              user: user as User,
              token: access_token,
            });
            return true;
          }
          return false;
        } catch (error: any) {
          console.error('Login error:', error);
          return false;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
        });
        // Clear TOAI widget data on logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("toai-widget-messages");
          localStorage.removeItem("toai-widget-is-open");
          localStorage.removeItem("toai-widget-button-position");
          localStorage.removeItem("toai-widget-chatbox-position");
          localStorage.removeItem("toai-widget-scroll-position");
          localStorage.removeItem("toai-assistant-page-messages");
        }
      },
      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Computed selector for isAuthenticated
export const useIsAuthenticated = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  return !!(user && token);
};

