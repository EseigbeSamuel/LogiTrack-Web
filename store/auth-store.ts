import { create } from "zustand";

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, fullName?: string, role?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    fullName: "Alex Obi",
    email: "alex.obi@logitrack.com",
    role: "Fleet Manager",
    avatarUrl: "",
  },
  isAuthenticated: true,
  login: async (email, fullName = "Alex Obi", role = "Fleet Manager") => {
    // simulate network lag
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      user: { fullName, email, role, avatarUrl: "" },
      isAuthenticated: true,
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateProfile: (profile) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null,
    }));
  },
}));
