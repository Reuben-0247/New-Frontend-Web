/* eslint-disable @next/next/no-img-element */
import React from "react";
import Header from "@/app/components/Header";
import PricingHero from "@/app/components/_web/PricingHero";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description:
    "Explore flexible pricing plans on Fero Events for live streaming, event hosting, and video clipping. Choose a plan that fits your needs.",
  keywords: [
    "Fero Events pricing",
    "live streaming pricing",
    "event platform plans",
    "video clipping pricing",
  ],
};

const plans = [
  {
    id: 1,
    name: "Bronze",
    canseled: "₦100",
    amount: 900,
    billingCycle: "Monthly",

    yearly: "Billed ₦10000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
  {
    id: 2,
    name: "Silver",
    canseled: "₦200",
    amount: 1800,
    billingCycle: "Monthly",

    yearly: "Billed ₦20000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
  {
    id: 3,
    name: "Gold",
    canseled: "₦500",
    amount: 4500,
    billingCycle: "Monthly",

    yearly: "Billed ₦50000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
  {
    id: 4,
    name: "Daimond",
    canseled: "₦1000",
    amount: 9000,
    billingCycle: "Monthly",

    yearly: "Billed ₦100000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
];

const page = () => {
  return (
    <div>
      <div className="hero relative">
        <div className=" -z-5 img-box absolute -top-40 w-full right-0 h-140 bg-[url('/images/Pattern.png')] bg-cover bg-center"></div>
        <Header />
        <PricingHero />

        <div className="container mx-auto md:px-6 px-2 w-full pt-12 flex flex-col font-Nunito    py-12">
          <div className="text-center mb-10 mt-4">
            <h2 className="text-xl text-foreground md:text-2xl font-semibold">
              <span className="text-primary">Choose</span> your Perfect Plan
              with Fero Event
            </h2>
          </div>
          <div className="plans grid md:grid-cols-2 grid-cols-1 gap-6">
            {plans.map((plan) => (
              <div
                className="item p-4 bg-[#00061A] text-white rounded-2xl"
                key={plan.id}>
                <div>{plan.name}</div>

                <p className="flex items-center gap-1 m-0">
                  <span className="line-through text-gray-500">
                    {plan.canseled}
                  </span>
                  <span className="text-[#0062FF]">{plan.amount} </span> -{" "}
                  {plan.billingCycle}
                </p>
                {/* <div className="mt-4">{plan.price}</div> */}
                <div className="mb-6 text-sm">{plan.yearly}</div>
                <hr />
                <div className="features">
                  {plan.features.map((f, i) => (
                    <div className="content" key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="">{f.label}</span>
                        <span>
                          {f.value === true ? (
                            <img src="/images/verify.png" alt="" />
                          ) : (
                            f.value
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full mt-4">
                  <button className="text-center rounded-lg mb-4 bg-[#0062FF] px-2 h-[45px] w-full ">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
