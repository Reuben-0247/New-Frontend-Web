"use client";

import React, { useState } from "react";
import SideBar from "../components/_dashboard/shared/SideBar";
import MainHeader from "../components/_dashboard/shared/MainHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showAside, setShowAside] = useState(true);
  const [collapse, setCollapse] = useState(false);

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  const toggleAside = () => {
    setShowAside(!showAside);
    if (collapse) {
      setCollapse(!collapse);
    }
  };
  return (
    <div className="flex h-screen">
      <SideBar
        showAside={showAside}
        toggleAside={toggleAside}
        collapsAside={toggleCollapse}
        collapse={collapse}
      />
      <div className="flex-1 flex flex-col bg-dash-gray h-screen">
        <MainHeader toggleAside={toggleAside} />
        <main className="overflow-y-scroll h-[92vh]">
          <div className=" py-6  container mx-auto px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
