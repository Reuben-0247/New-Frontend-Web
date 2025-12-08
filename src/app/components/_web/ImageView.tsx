/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { motion } from "framer-motion";

const ImageView = () => {
  return (
    <div className="image-show mx-auto mt-[100px] bg-[url('/images/Pattern.png')] bg-cover bg-center md:px-16 w-full bg-background flex flex-nowrap flex-col md:flex-row items-center justify-center">
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.4 }}>
        <img src="/images/Galaxy-tab.png" alt="" />
      </motion.div>

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.4 }}>
        <img src="/images/Galaxy.png" alt="" />
      </motion.div>
    </div>
  );
};

export default ImageView;
