/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { ThreeDots } from "react-loader-spinner";
import { Video, VideoOff, Mic, MicOff, Radio, XCircle } from "lucide-react";
import { toast, ToastContent } from "react-toastify";
import { IEvent } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { useAuthStore } from "@/app/store/auth.store";
import { useEventStore } from "@/app/store/event.store";
import { IStreamData } from "@/app/interfaces/castr.interface";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
const STATS_POLL_INTERVAL_MS = 5000; // poll every 5 seconds — same as OBS flow

const WebcamP: React.FC<{ data: IEvent | null }> = ({ data }) => {
  const { auth } = useAuthStore();
  const { event, setStreamData, streamData, setEvent, endStream } =
    useEventStore();
  const [castrRtmpUrl, setCastrRtmpUrl] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const [AgoraRTC, setAgoraRTC] = useState<any>(null);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [castrStreaming, setCastrStreaming] = useState(false);
  const [castrLoading, setCastrLoading] = useState(false);

  const assignedUidRef = useRef<number | null>(null);
  const [micTrack, setMicTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [camTrack, setCamTrack] = useState<ICameraVideoTrack | null>(null);

  // ─── Bandwidth polling ref — holds the interval so we can clear it ────────
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Init Agora SDK ───────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("agora-rtc-sdk-ng").then((mod) => {
      setAgoraRTC(mod.default);
      const rtcClient = mod.default.createClient({
        mode: "live",
        codec: "h264",
      });
      setClient(rtcClient);
    });
  }, []);

  // ─── Sync store from prop on mount ───────────────────────────────────────
  useEffect(() => {
    if (data && (!event || event._id !== data._id)) {
      setEvent(data);
    }
  }, [data, event, setEvent]);

  // ─── Bandwidth polling — runs every 5s while Castr stream is active ──────
  const startBandwidthPolling = () => {
    // Clear any existing interval first
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);

    statsIntervalRef.current = setInterval(async () => {
      if (!client || !assignedUidRef.current) return;

      try {
        // Overall RTC channel stats
        const rtcStats = client.getRTCStats();

        // Per-track stats
        const localVideoStatsMap = client.getLocalVideoStats();
        const localAudioStatsMap = client.getLocalAudioStats();

        const uid = assignedUidRef.current;
        const videoStats = (localVideoStatsMap as any)[uid] || {};
        const audioStats = (localAudioStatsMap as any)[uid] || {};

        // sendBitrate is in bps — convert to Mbps for display
        const videoBitrateBps: number = videoStats?.sendBitrate || 0;
        const audioBitrateBps: number = audioStats?.sendBitrate || 0;
        const totalBitrateBps = videoBitrateBps + audioBitrateBps;

        // Calculate GB used this interval:
        // GB = (bits per second / 8) * interval_seconds / 1024^3
        const intervalSeconds = STATS_POLL_INTERVAL_MS / 1000;
        const gbThisInterval =
          ((totalBitrateBps / 8) * intervalSeconds) / 1024 ** 3;

        const payload = {
          // Bandwidth
          totalBitrateBps,
          videoBitrateBps,
          audioBitrateBps,
          gbThisInterval,

          // Video quality
          sendFrameRate: videoStats?.sendFrameRate || 0,
          sendResolutionWidth: videoStats?.sendResolutionWidth || 0,
          sendResolutionHeight: videoStats?.sendResolutionHeight || 0,
          videoPacketLossRate: videoStats?.sendPacketLossRate || 0,

          // Audio quality
          audioPacketLossRate: audioStats?.sendPacketLossRate || 0,

          // Session
          duration: rtcStats?.Duration || 0, // seconds in channel
          userCount: rtcStats?.UserCount || 0, // users in channel
          rtt: rtcStats?.RTT || 0, // round trip time ms
        };

        // Send to your server — same endpoint pattern as OBS bandwidth tracking
        await axiosApi.post(`/stream/agora/stats/${data?._id}`, payload);
      } catch (err) {
        // Don't toast — silent failure is fine for stats polling
        console.warn("Stats poll error:", err);
      }
    }, STATS_POLL_INTERVAL_MS);
  };

  // ─── Stop polling ─────────────────────────────────────────────────────────
  const stopBandwidthPolling = () => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  };

  // ─── Create new Castr stream ──────────────────────────────────────────────
  const createStream = async (): Promise<boolean> => {
    const eventTitle = event?.title || data?.title;
    const eventId = event?._id || data?._id;

    if (!eventTitle || !eventId) {
      toast.error("Event data missing");
      return false;
    }
    try {
      const { data: res } = await axiosApi.post<{ stream: IStreamData }>(
        `/stream/castr/create/${auth?._id}`,
        {
          name: eventTitle,
          eventId,
          enabled: true,
          settings: { abr: false, cloud_recording: false },
        },
      );
      setCastrRtmpUrl(
        `${res?.stream?.ingestInfo.primaryUrl}/${res?.stream?.ingestInfo.streamKey}`,
      );
      setStreamData(res?.stream);
      setEvent({
        ...event,
        castrStreamId: res?.stream?.castrStreamId,
      } as IEvent);
      toast.success("Stream Created Successfully");
      return true;
    } catch (error) {
      toast.error(formatError(error as AxiosError).message as ToastContent);
      return false;
    }
  };

  // ─── Load existing Castr stream ingest info ───────────────────────────────
  const loadExistingStream = async (): Promise<boolean> => {
    try {
      if (streamData?.ingestInfo) {
        setCastrRtmpUrl(
          `${streamData.ingestInfo.primaryUrl}/${streamData.ingestInfo.streamKey}`,
        );
        return true;
      }
      const { data: res } = await axiosApi.get<IStreamData>(
        `/stream/castr-details/${event?._id}`,
      );
      setCastrRtmpUrl(
        `${res.ingestInfo.primaryUrl}/${res.ingestInfo.streamKey}`,
      );
      setStreamData(res);
      return true;
    } catch (error) {
      toast.error("Could not load stream info");
      console.log(error);
      return false;
    }
  };

  // ─── Join Agora channel as host ───────────────────────────────────────────
  const joinAsHost = async () => {
    if (!AgoraRTC || !client) return;
    if (!APP_ID) {
      toast.warn("Agora App ID missing");
      return;
    }
    if (!data?.channelName || !data?.token) {
      toast.error(
        "Event is missing Agora credentials. Please recreate the event.",
      );
      return;
    }

    setLoading(true);

    try {
      const existingCastrId = data?.castrStreamId || event?.castrStreamId;
      if (!existingCastrId) {
        const created = await createStream();
        if (!created) {
          setLoading(false);
          return;
        }
      } else {
        const loaded = await loadExistingStream();
        if (!loaded) {
          setLoading(false);
          return;
        }
      }

      // Always fetch a fresh token — never use the stored one (may be expired)
      const { data: tokenRes } = await axiosApi.get(
        `/events/${data._id}/refresh-token`,
      );
      const freshToken = tokenRes?.data?.token;
      const channelName = tokenRes?.data?.channelName;

      if (!freshToken || !channelName) {
        toast.error("Could not get stream token");
        setLoading(false);
        return;
      }

      await client.setClientRole("host");
      const assignedUid = await client.join(
        APP_ID,
        channelName,
        freshToken,
        null,
      );
      assignedUidRef.current = assignedUid as number;

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setMicTrack(mic);
      setCamTrack(cam);
      cam.play(localVideoRef.current!);
      await client.publish([mic, cam]);

      setJoined(true);
      toast.success("Joined stream successfully");
    } catch (error: any) {
      console.error("Agora join error:", error);
      toast.error(`Failed to join: ${error?.message || error?.code}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Go Live — start Agora Media Push to Castr ───────────────────────────
  const startCastrStream = async () => {
    if (!assignedUidRef.current) return;

    const rtmpUrl = castrRtmpUrl;
    const castrStreamId =
      streamData?.castrStreamId || event?.castrStreamId || data?.castrStreamId;

    if (!rtmpUrl) {
      toast.error("Castr RTMP URL missing");
      return;
    }
    if (!castrStreamId) {
      toast.error("Castr stream ID missing");
      return;
    }

    setCastrLoading(true);

    try {
      const { data: res } = await axiosApi.post("/stream/agora/push-start", {
        channelName: data?.channelName,
        uid: assignedUidRef.current,
        rtmpUrl,
        castrStreamId,
      });

      if (res.status !== "success") {
        toast.error("Failed to start push");
        return;
      }

      await axiosApi.patch(`/events/live/${data?._id}/${auth?._id}`, {
        streamType: "agora",
        streamPlatform: "agora",
        isLive: true,
      });

      setCastrStreaming(true);
      toast.success("🔴 You are now LIVE on Castr!");

      // ✅ Start bandwidth polling now that stream is active
      startBandwidthPolling();
    } catch (error) {
      toast.error(formatError(error as AxiosError).message as ToastContent);
      console.error("Castr stream start error:", error);
    } finally {
      setCastrLoading(false);
    }
  };

  // ─── Stop Castr push ──────────────────────────────────────────────────────
  const stopCastrStream = async () => {
    const castrStreamId =
      streamData?.castrStreamId || event?.castrStreamId || data?.castrStreamId;

    // ✅ Stop bandwidth polling first
    stopBandwidthPolling();

    try {
      await axiosApi.post("/stream/agora/push-stop", {
        channelName: data?.channelName,
        castrStreamId,
      });
      setCastrStreaming(false);
      toast.info("Stream stopped");
    } catch (error) {
      console.error("Stop push error:", error);
    }
  };

  // ─── Leave — full cleanup ─────────────────────────────────────────────────
  const leave = async () => {
    try {
      if (castrStreaming) await stopCastrStream();

      // ✅ Ensure polling is cleared even if stopCastrStream wasn't called
      stopBandwidthPolling();

      micTrack?.stop();
      micTrack?.close();
      camTrack?.stop();
      camTrack?.close();

      await client?.leave();
      setJoined(false);
      assignedUidRef.current = null;

      await axiosApi.patch(`/stream/castr/${streamData?.castrStreamId}`, {
        settings: { abr: false, cloud_recording: false },
        name: event?.title,
        enabled: false,
      });
      endStream(event?._id || "", auth?._id || "", "agora");
      toast.success("Stream ended");
      setCastrStreaming(false);
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopBandwidthPolling(); // ✅ always clear interval on unmount
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="relative w-[430px] h-[300px] bg-black rounded-t-lg">
      <div ref={localVideoRef} className="w-full h-full rounded-t-lg" />

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
          <button
            onClick={castrStreaming ? leave : startCastrStream}
            className={`flex items-center gap-1 px-2 rounded text-white text-xs font-semibold ${
              castrStreaming
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            title={castrStreaming ? "Stop Agora stream" : "Go live"}
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
          {/* <button onClick={leave} title="Leave event">
            <XCircle className="text-red-500" />
          </button> */}
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
