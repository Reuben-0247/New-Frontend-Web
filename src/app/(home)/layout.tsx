"use client";
import type React from "react";
import Footer from "@/app/components/Footer";
import { useThemeStore } from "../store/theme.store";
import { useEffect } from "react";
import WhatsAppButton from "../components/WhatsAppButton";

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
    <div className="overflow-hidden">
      {children}
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HomeLayout;
