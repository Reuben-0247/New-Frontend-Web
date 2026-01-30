"use client";
import type React from "react";
import Footer from "@/app/components/Footer";
import { useThemeStore } from "../store/theme.store";
import { useEffect } from "react";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
