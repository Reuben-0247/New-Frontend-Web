/* eslint-disable @next/next/no-img-element */
import React from "react";
import Header from "@/app/components/Header";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Discover Fero Events solutions for live streaming, virtual events, video recording, and audience engagement.",
  keywords: [
    "event solutions",
    "virtual events",
    "live streaming tools",
    "video platform",
    "Fero Events solutions",
  ],
};

const features = [
  {
    icon: "/icons/vector-01.png",
    title: "Create & Manage Events",
    description:
      "Set up events effortlessly from one-time streams to multi-day conferences — with full control over scheduling and visibility.",
  },
  {
    icon: "/icons/vector-1.png",
    title: "Stream to Multiple Platforms",
    description:
      "Go live on YouTube, Facebook, or any RTMP-enabled platform directly from your dashboard, reaching your audience wherever they are.",
  },
  {
    icon: "/icons/vector-3.png",
    title: "Live to VOD (Video on Demand)",
    description:
      "Automatically convert your live streams into replayable videos so your audience can catch up anytime, anywhere.",
  },
  {
    icon: "/icons/vector-2.png",
    title: "Share Event Materials",
    description:
      "Upload slides, documents, and media to a dedicated resource board, so attendees can follow along or download content on demand.",
  },

  {
    icon: "/icons/vector-4.png",
    title: "Control Access",
    description:
      "Easily manage who attends your event with invite-only access, custom links, and visibility settings tailored to your audience.",
  },
  {
    icon: "/icons/vector-5.png",
    title: "Engagement",
    description:
      "View real-time analytics on stream performance, viewer count, and resource downloads to measure impact and improve future events.",
  },
  {
    icon: "/icons/vector-3.png",
    title: "Live Clipping",
    description:
      "Don’t just stream—create. Clip standout moments from your live feed in real-time and share them instantly across channels—without waiting for the event to end.",
  },
];
const page = () => {
  return (
    // <div>
    <div className="hero relative">
      <div className=" -z-5 img-box absolute -top-40 w-full right-0 h-140 bg-[url('/images/Pattern.png')] bg-cover bg-center"></div>
      <Header />
      <div className="w-full h-[50vh] px-2 md:h-[75vh] flex flex-col items-center justify-center text-center">
        <div>
          <img
            src="/images/heroSection.png"
            className=" h-5 md:h-7 mb-4"
            alt=""
          />
        </div>
        <div>
          <h1 className="text-4xl md:text-[74px] md:leading-18 mx-3 font-bold">
            Tailored solutions for every type of event
          </h1>
        </div>
        <div>
          <p className="mt-4 text-[24px] max-w-xl mx-auto text-foreground">
            Explore live, upcoming, and past events hosted by creators and
            communities worldwide
          </p>
        </div>
      </div>
      <div className="container mx-auto md:px-6 px-2">
        <div className="text-center w-full text-3xl font-semibold">
          Unique Features
        </div>
        <div className="features grid md:grid-cols-3 grid-cols-1 gap-6 mt-10">
          {features.map((f, i) => (
            <div
              className="item p-4 rounded-xl border border-border shadow-md"
              key={i}>
              <img src={f.icon} alt={f.icon} />
              <p className="text-xl my-6">{f.title}</p>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto md:px-6 px-2 my-10">
        <img src="/images/solution.png" className="h-full w-full " alt="" />
      </div>
    </div>
    // </div>
  );
};

export default page;
