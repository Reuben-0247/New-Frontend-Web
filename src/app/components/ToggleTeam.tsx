"use client";

import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";
import { THEME } from "@/utils/constant";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME) as "light" | "dark" | null;
      if (stored) return stored;
      return "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Button
      onClick={toggleTheme}
      className="p-1 rounded-full cursor-pointer border border-border bg-card  transition">
      {theme === "light" ? (
        <Moon className="text-background" />
      ) : (
        <SunMedium className=" text-amber-500" />
      )}
    </Button>
  );
}
