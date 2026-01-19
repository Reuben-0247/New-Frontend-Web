"use client";

import { Moon, SunMedium } from "lucide-react";
import { useThemeStore } from "../store/theme.store";
import { useMounted } from "../hooks/useOnmount";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div
      onClick={toggleTheme}
      className={`p-1 rounded-full cursor-pointer border  border-border bg-card transition ${theme === "dark" ? "hover:bg-background" : "hover:bg-[#1b2440]  "}`}>
      {theme === "light" ? (
        <Moon className="text-background" />
      ) : (
        <SunMedium className="text-amber-500" />
      )}
    </div>
  );
}
