/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { ThreeDots } from "react-loader-spinner";
import { Video, VideoOff, Mic, MicOff, XCircle, Radio } from "lucide-react";
import { toast } from "react-toastify";
import { IEvent } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
const UID: number | null = null;

const WebcamP: React.FC<{ data: IEvent | null }> = ({ data }) => {
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const [AgoraRTC, setAgoraRTC] = useState<any>(null);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  // NEW: track whether RTMP push to Castr is active
  const [castrStreaming, setCastrStreaming] = useState(false);
  const [castrLoading, setCastrLoading] = useState(false);

  // Store the UID assigned by Agora after joining, needed for transcoding config
  const assignedUidRef = useRef<number | null>(null);

  const [micTrack, setMicTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [camTrack, setCamTrack] = useState<ICameraVideoTrack | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("agora-rtc-sdk-ng").then((mod) => {
      setAgoraRTC(mod.default);

      // IMPORTANT: mode must be "live" for RTMP push to work (you already have this ✅)
      // IMPORTANT: codec must be "h264" for Castr compatibility — changed from "vp8"
      const rtcClient = mod.default.createClient({
        mode: "live",
        codec: "h264", // ← changed from "vp8" — Castr requires h264
      });

      // Listen for RTMP streaming events
      rtcClient.on("live-streaming-error", (url: string, err: any) => {
        console.error("Castr RTMP error:", url, err.code);
        toast.error(`Stream error: ${err.code}`);
        setCastrStreaming(false);
      });

      rtcClient.on("live-streaming-warning", (url: string, warning: any) => {
        console.warn("Castr RTMP warning:", url, warning.code);
      });

      setClient(rtcClient);
    });
  }, []);

  const getStreamStats = async () => {
    try {
      const { data: response } = await axiosApi.patch(
        `/events/live/${data?._id}`,
        {
          streamType: "agora",
          streamPlatform: "agora",
          isLive: true,
        },
      );
      return response;
    } catch (error) {
      console.error("Stream init error:", error);
      return null;
    }
  };

  const joinAsHost = async () => {
    if (!AgoraRTC || !client) return;
    if (!APP_ID) {
      toast.warn("Agora App ID missing");
      return;
    }

    setLoading(true);

    try {
      const resp = await getStreamStats();

      if (resp?.status !== "success") {
        toast.error(resp?.message || "Unable to start stream");
        setLoading(false);
        return;
      }

      toast.success(resp.data?.message);

      await client.setClientRole("host");

      // join() returns the assigned UID — store it for transcoding config later
      const assignedUid = await client.join(
        APP_ID,
        data?.channelName || "Fero Event",
        data?.token || null,
        UID,
      );
      assignedUidRef.current = assignedUid as number;

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();

      setMicTrack(mic);
      setCamTrack(cam);

      cam.play(localVideoRef.current!);
      await client.publish([mic, cam]);

      setJoined(true);
    } catch (error) {
      console.error("Agora join error:", error);
      toast.error("Failed to join stream");
    } finally {
      setLoading(false);
    }
  };

  // ─── NEW: Start pushing stream to Castr via RTMP ──────────────────────────
  const startCastrStream = async () => {
    if (!client || !assignedUidRef.current) return;

    // Get the Castr RTMP URL from your event data, or fall back to env variable.
    // Format: rtmp://live-push.castr.com/live/YOUR_STREAM_KEY
    const castrRtmpUrl =
      data?.rtmToken || process.env.NEXT_PUBLIC_CASTR_RTMP_URL;

    if (!castrRtmpUrl) {
      toast.error("Castr RTMP URL not configured");
      return;
    }

    setCastrLoading(true);

    try {
      // Step 1: Set the transcoding config
      // This tells Agora how to encode the merged stream before sending to Castr
      await client.setLiveTranscoding({
        width: 1280,
        height: 720,
        videoBitrate: 2500,
        // videoFramerate: 30,
        audioSampleRate: 48000,
        audioBitrate: 128,
        audioChannels: 2,
        // userCount: 1,
        backgroundColor: 0x000000,
        transcodingUsers: [
          {
            uid: assignedUidRef.current,
            x: 0,
            y: 0,
            width: 1280,
            height: 720,
            zOrder: 1,
            alpha: 1,
          },
        ],
      });

      // Step 2: Start the RTMP push to Castr
      // true = use transcoding (required when mixing multiple streams or for
      //        single-host streams where you need a consistent output format)
      await client.startLiveStreaming(castrRtmpUrl, true);

      setCastrStreaming(true);
      toast.success("🔴 Live on Castr!");
    } catch (error: any) {
      console.error("Castr stream start error:", error);
      toast.error(`Failed to start Castr stream: ${error?.message}`);
    } finally {
      setCastrLoading(false);
    }
  };

  // ─── NEW: Stop pushing stream to Castr ────────────────────────────────────
  const stopCastrStream = async () => {
    if (!client) return;

    const castrRtmpUrl =
      data?.rtmToken || process.env.NEXT_PUBLIC_CASTR_RTMP_URL;

    if (!castrRtmpUrl) return;

    try {
      await client.stopLiveStreaming(castrRtmpUrl);
      setCastrStreaming(false);
      toast.info("Castr stream stopped");
    } catch (error) {
      console.error("Castr stop error:", error);
    }
  };

  const leave = async () => {
    try {
      // Stop Castr stream before leaving
      if (castrStreaming) await stopCastrStream();

      micTrack?.stop();
      micTrack?.close();
      camTrack?.stop();
      camTrack?.close();

      await client?.leave();
      setJoined(false);
      assignedUidRef.current = null;
      const { data: response } = await axiosApi.get<{
        data: { message: string };
      }>(`/events/end-live/${data?._id}`);
      // return response;
      toast.success(response?.data?.message || "Stream ended");
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  const toggleCamera = async () => {
    if (!camTrack) return;
    await camTrack.setEnabled(!cameraOn);
    setCameraOn((p) => !p);
  };

  const toggleMic = async () => {
    if (!micTrack) return;
    await micTrack.setEnabled(!micOn);
    setMicOn((p) => !p);
  };

  useEffect(() => {
    return () => {
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-[430px] h-[300px] bg-black rounded-t-lg">
      <div ref={localVideoRef} className="w-full h-full rounded-t-lg" />

      {/* Live indicator badge */}
      {castrStreaming && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}

      {joined && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 rounded-lg py-3 px-4">
          <button
            onClick={toggleCamera}
            className="text-white"
            title={cameraOn ? "Off video" : "On video"}>
            {cameraOn ? <Video /> : <VideoOff />}
          </button>

          <button
            onClick={toggleMic}
            className="text-white"
            title={micOn ? "Mute" : "Unmute"}>
            {micOn ? <Mic /> : <MicOff />}
          </button>

          {/* NEW: Castr stream toggle button */}
          <button
            onClick={castrStreaming ? stopCastrStream : startCastrStream}
            className={`flex items-center gap-1 px-2 rounded text-white text-xs font-semibold ${
              castrStreaming
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            title={castrStreaming ? "Stop Castr stream" : "Go live on Castr"}
            disabled={castrLoading}>
            {castrLoading ? (
              <ThreeDots height={16} width={22} color="white" />
            ) : (
              <>
                <Radio size={14} />
                {castrStreaming ? "Stop" : "Go Live"}
              </>
            )}
          </button>

          <button onClick={leave} title="Leave event">
            <XCircle className="text-red-500" />
          </button>
        </div>
      )}

      {!joined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={joinAsHost}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            {loading ? (
              <ThreeDots height={22} width={22} color="white" />
            ) : (
              "Start Stream"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamP;
