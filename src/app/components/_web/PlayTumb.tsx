/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";

export const PlayImg = () => {
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.4 }}>
      <div className="play container mx-auto px-2 md:px-6 py-8">
        <div className="img h-100 w-full">
          <img
            src="/images/play.png"
            alt="play"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </motion.div>
  );
};
