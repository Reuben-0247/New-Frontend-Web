/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export const HomeHero = () => {
  return (
    <div className="container mx-auto px-2 md:px-6">
      <div className="w-full h-full flex flex-col  items-center  justify-center py-10 md:py-24   text-center">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}>
          <img
            src="/images/heroSection.png"
            className=" h-5 md:h-7 mb-4"
            alt=""
          />
        </motion.div>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}>
          <h1 className="text-3xl md:text-[64px] leading-10 md:leading-14 mx-3 font-bold">
            <span className="text-primary">Create</span> and{" "}
            <span className="text-primary">Stream</span> events
            <br />
            seamlessly with Fero events
          </h1>
        </motion.div>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}>
          <p className="mt-4 text-lg md:text-[24px] max-w-xl mx-auto text-foreground">
            Manage events, stream live to multiple platforms, and give your
            audience an unforgettable experience.
          </p>
        </motion.div>
        <div className="mt-6  mb-14 md:mb-0 h-[53px] flex flex-wrap justify-center gap-4">
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}>
            <Link
              href={"/create-event"}
              className="bg-primary  text-background link font-semibold flex justify-center items-center h-full w-[154px]  rounded-lg">
              Create Event
            </Link>
          </motion.div>
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}>
            <Link
              href={"/login"}
              className=" text-secondary link cursor-pointer border-2 border-gray-400 flex justify-center items-center font-semibold h-full w-[154px] rounded-lg">
              Find An Event
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-6 justify-center mb-12 md:gap-[149px] font-Nunito items-center">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}>
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-extrabold text-[18px] md:text-[30px] text-foreground">
              10k
            </h1>
            <p className="font-medium md:text-[20px]  text-foreground">
              Events Hosted
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-extrabold text-[18px] md:text-[30px] text-foreground">
            1M+
          </h1>
          <p className="font-medium md:text-[20px]  text-foreground">
            Total Viewers
          </p>
        </div>

        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}>
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-extrabold text-[18px] md:text-[30px] text-foreground">
              99%
            </h1>
            <p className="font-medium md:text-[20px]  text-foreground">
              Uptime
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
