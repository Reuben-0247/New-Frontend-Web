/* eslint-disable @next/next/no-img-element */
import React from "react";

const Features = () => {
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
      icon: "/icons/vector-2.png",
      title: "Share Event Materials",
      description:
        "Upload slides, documents, and media to a dedicated resource board, so attendees can follow along or download content on demand.",
    },
    {
      icon: "/icons/vector-3.png",
      title: "Live to VOD (Video on Demand)",
      description:
        "Automatically convert your live streams into replayable videos so your audience can catch up anytime, anywhere.",
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
  ];

  return (
    <div className="py-8">
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
    </div>
  );
};

export default Features;
