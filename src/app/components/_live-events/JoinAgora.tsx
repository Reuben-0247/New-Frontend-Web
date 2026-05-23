/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { IEvent } from "@/app/interfaces/event.interface";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;

// ── Option A: Watch via Agora (real-time, in-app) ────────────────────────────
export const AgoraViewer: React.FC<{ event: IEvent }> = ({ event }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (!event?.channelName || !event?.token) return;

    const join = async () => {
      const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");
      const client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
      clientRef.current = client;

      await client.setClientRole("audience");
      await client.join(
        APP_ID,
        event?.channelName || "",
        event?.token || "",
        null,
      );

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") user.videoTrack?.play(videoRef.current!);
        if (mediaType === "audio") user.audioTrack?.play();
      });

      client.on("user-unpublished", (user) => {
        user.videoTrack?.stop();
      });
    };

    join();
    return () => {
      clientRef.current?.leave();
    };
  }, [event]);

  return <div ref={videoRef} className="w-full h-full bg-black rounded-lg" />;
};

// ── Option B: Watch via Castr HLS (external, large audiences) ────────────────
// export const CastrHLSViewer: React.FC<{ hlsUrl: string }> = ({ hlsUrl }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     if (!hlsUrl || !videoRef.current) return;
//     let hls: Hls;

//     if (Hls.isSupported()) {
//       hls = new Hls();
//       hls.loadSource(hlsUrl);
//       hls.attachMedia(videoRef.current);
//     } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
//       videoRef.current.src = hlsUrl; // Safari native HLS
//     }

//     return () => hls?.destroy();
//   }, [hlsUrl]);

//   return (
//     <video
//       ref={videoRef}
//       controls
//       autoPlay
//       playsInline
//       className="w-full h-full rounded-lg bg-black"
//     />
//   );
// };
