"use client";
import LiveBoard from "@/app/components/_live-events/LiveBoard";
import LiveComment from "@/app/components/_live-events/LiveComment";
import LiveNotes from "@/app/components/_live-events/LiveNotes";
import LiveParticipant from "@/app/components/_live-events/LiveParticipant";
import LiveVideo from "@/app/components/_live-events/LiveVideo";
import { useAuthStore } from "@/app/store/auth.store";
import { useEventStore } from "@/app/store/event.store";
import { Button } from "@/components/ui/button";
import axiosApi from "@/lib/axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
// import styled from "styled-components";
const tabs: { name: string }[] = [
  {
    name: "Board",
  },
  {
    name: "Participants",
  },
  {
    name: "Chats",
  },
  {
    name: "Reviews",
  },
];

const LivePage: React.FC = () => {
  const { event, streamData } = useEventStore();
  const [active, setActive] = useState<string>("Board");
  const router = useRouter();
  const { auth } = useAuthStore();

  const hasLeft = useRef(false);

  const handleLeave = useCallback(async () => {
    if (hasLeft.current) return;
    hasLeft.current = true;

    const payload = {
      eventId: event?._id,
      userId: auth?._id,
    };
    try {
      const { data: response } = await axiosApi.patch(
        `/stream/exit-stream-event`,
        payload,
      );
      if (response) {
        toast.info("You have successfully left the event!");
        router.push("/find-events");
      }
    } catch (error) {
      console.log(error);
      hasLeft.current = false;
    }
  }, [event?._id, auth?._id, router]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      handleLeave();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleLeave]);
  return (
    <div className=" ">
      <div className="flex  justify-between">
        <div>
          <Button
            onClick={() => router.back()}
            size={"sm"}
            variant={"outline"}
            className="text-foreground font-semibold cursor-pointer">
            <ArrowLeft /> <span>Back</span>
          </Button>
          {/* <p className="mt-4 text-2xl font-bold text-foreground">Title</p> */}
        </div>
        <p className="font-bold text-2xl text-foreground">{event?.title}</p>
      </div>
      <div className="md:flex w-full gap-4 mt-6">
        <div className="md:w-[60%] w-full   overflow-hidden">
          <LiveVideo streamData={streamData} event={event} />
        </div>
        <div className=" md:w-[40%] w-full mt-8 md:mt-0 dark:bg-[#151E37] bg-white shadow-2xl rounded-lg border-gray-700  md:p-2 h-full shrink-0 ">
          <div className="tabs flex justify-between dark:bg-[#000826] shadow-md bg-white md:gap-2  md:p-2  w-full  overflow-x-auto rounded-sm">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActive(tab.name)}
                className={`px-[11px] cursor-pointer py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
               ${
                 active === tab.name
                   ? "bg-[#151E37] text-white"
                   : "text-gray-500 hover:bg-gray-700"
               }`}>
                {tab.name}
              </button>
            ))}
          </div>

          <div className="views  p-4">
            {active === "Board" ? (
              <LiveBoard event={event} />
            ) : active === "Participants" ? (
              <LiveParticipant event={event} />
            ) : active === "Chats" ? (
              <LiveComment eventId={event?._id || ""} />
            ) : (
              active === "Reviews" && <LiveNotes event={event} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;

// const Wrapper = styled.div``;
