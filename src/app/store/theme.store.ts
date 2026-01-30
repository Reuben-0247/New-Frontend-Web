import { create } from "zustand";
import { THEME } from "@/utils/constant";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme:
    typeof window !== "undefined"
      ? (localStorage.getItem(THEME) as Theme) || "light"
      : "light",

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME, theme);
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    set({ theme: nextTheme });
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME, nextTheme);
    }
  },
}));
