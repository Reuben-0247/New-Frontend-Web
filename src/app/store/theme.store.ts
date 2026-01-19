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
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem(THEME, theme);
    }
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      localStorage.setItem(THEME, nextTheme);
    }
    set({ theme: nextTheme });
  },
}));
