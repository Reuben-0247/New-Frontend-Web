"use client";
import MainHeader from "@/app/components/_dashboard/shared/MainHeader";
import StreamAside from "@/app/components/_dashboard/shared/StreamAside";
import { use, useState } from "react";

const StreamLayout: React.FC<{
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}> = ({ children, params }) => {
  const { eventId } = use(params);

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
      <StreamAside
        param={eventId}
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
};

export default StreamLayout;
