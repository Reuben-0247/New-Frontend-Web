import type React from "react";
import Footer from "@/app/components/Footer";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
