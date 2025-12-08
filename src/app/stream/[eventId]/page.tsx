"use client";
import EventBoardComp from "@/app/components/stream-comps/EventBoardComp";
import EventParticipantComp from "@/app/components/stream-comps/EventParticipantComp";
import EventReviewsComp from "@/app/components/stream-comps/EventReviewsComp";
import HostComments from "@/app/components/stream-comps/HostComments";
import SoftwareProp from "@/app/components/stream-comps/SoftwareProp";
import StreamInfo from "@/app/components/stream-comps/StreamInfo";
import { Button } from "@/components/ui/button";
import {
  Airplay,
  ArrowLeft,
  EyeIcon,
  Ratio,
  Signal,
  Volume2,
  Webcam,
} from "lucide-react";
// import Link from "next/link";
import React, { useState } from "react";
import { HiMiniSignal } from "react-icons/hi2";
import { ThreeDots } from "react-loader-spinner";
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
const videoSrcData: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Streaming Sofware",
    icon: <Airplay />,
  },
  {
    label: "Webcam",
    icon: <Webcam />,
  },
];

const StreamPage = () => {
  const [active, setActive] = useState<string>("Board");
  const [isPublished, setIsPublished] = useState(true);
  const [videoSrc, setVideoSrc] = useState("Streaming Sofware");
  const [loading] = useState(true);
  const streamData = {};
  const isLive = {};

  return (
    <div>
      <div className="flex  justify-between">
        <div>
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-foreground font-semibold cursor-pointer">
            <ArrowLeft /> <span>Back</span>
          </Button>
          <p className="mt-4 text-2xl font-bold text-foreground">Title</p>
        </div>
        <p className="font-bold text-2xl text-foreground">Stream Setup</p>
      </div>

      <div className="flex gap-4 mt-8">
        <div className="event-details w-[50%]">
          <div className="tabs w-full flex items-center justify-between  text-white  py-2 px-4 bg-black rounded-md">
            {tabs.map((tab) => (
              <p
                onClick={() => setActive(tab.name)}
                className={`cursor-pointer py-2 px-6   ${
                  active === tab.name ? "border-b-2 pb-2" : ""
                }`}
                key={tab.name}>
                {tab.name}
              </p>
            ))}
          </div>

          <div className="views bg-background p-4">
            {active === "Board" ? (
              <EventBoardComp />
            ) : active === "Participants" ? (
              <EventParticipantComp />
            ) : active === "Chats" ? (
              <HostComments eventId=":" />
            ) : (
              active === "Reviews" && <EventReviewsComp eventId="1" />
            )}
          </div>
        </div>
        <div className="stream-tab w-[50%] p-4 bg-[#151e37]">
          <StreamInfo />
          <hr />
          {isPublished ? (
            <div className="w-full h-[300px] relative flex mt-2 rounded-md items-center border justify-center bg-[#151E37] ">
              {!streamData ? (
                <div className="w-full  h-full ">
                  <iframe
                    src={""}
                    className="w-full h-full border-none"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    title="Castr Live Stream"
                  />
                  <div>
                    {isLive ? (
                      <div className="w-full flex absolute bottom-[150px] items-center justify-center">
                        <button
                          // onClick={goLive}
                          // disabled={isLoading}
                          className=" rounded-[5px] text-[14px] flex items-center font-nuni bg-[#720013] \ px-2 h-[45px] ">
                          <HiMiniSignal size={13} color="white" />
                          <span className="ml-2 text-white text-[14px]">
                            Go live
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex absolute bottom-5 items-center justify-center">
                        <button
                          // onClick={openEndStreamModal}
                          className=" rounded-[5px] text-[14px] font-nuni bg-[#720013] text-white px-2 h-[45px] ">
                          End Stream
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button className="flex items-center   mb-3 rounded-lg bg-[#0062FF] px-2 h-[45px] ">
                  {!loading ? (
                    <ThreeDots color="white" />
                  ) : (
                    <span className="text-white flex items-center gap-1 ml-2 text-[18px]">
                      + Create Stream
                    </span>
                  )}
                </button>
              )}
            </div>
          ) : (
            // <Webcam data={event} />
            <p>WebCam</p>
          )}

          <div className="vsrc flex justify-between items-center p-2 rounded-md bg-[#2e3c65] my-4">
            <div className="flex">
              {videoSrcData.map((src) => (
                <p
                  className={`py-2 md:px-4 px-2 flex items-center md:gap-2 gap-1 font-bold cursor-pointer ${
                    videoSrc === src.label ? "bg-[#232e4e] rounded-md" : ""
                  }`}
                  key={src.label}
                  onClick={() => setVideoSrc(src.label)}>
                  <span>{src.icon}</span> {src.label}
                </p>
              ))}
            </div>
            <div className="flex items-center ml-2 gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={enabled}
                  // disabled={loadingT}
                  // onChange={enableCloudRecord}
                />
                <div className="w-8 h-[19px] border-[#ccc] border-2 peer-focus:outline-none peer-focus:ring-2 peer-focus:bg-[#0f1525] rounded-full peer peer-checked:bg-[#151e37] p-1 transition-all duration-300"></div>
                <div className="absolute left-[3px] top-0.4 bg-[#FFFFFF] w-[13px] h-[13px] rounded-full transition-transform duration-300 transform peer-checked:translate-x-full"></div>
              </label>
              <small className="text-white">Recording</small>
            </div>
          </div>
          <div className="vsrc flex justify-between items-center   my-4">
            {active && <SoftwareProp streamType={videoSrc} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
