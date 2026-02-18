"use client";

import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";

export default function ClientProviders() {
  return (
    <>
      <NextTopLoader
        color="#0062ff"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl
        showSpinner
        easing="ease"
        speed={200}
        shadow="0 0 10px #5694f7,0 0 5px #5694f7"
      />
      <ToastContainer position="top-right" />
    </>
  );
}
