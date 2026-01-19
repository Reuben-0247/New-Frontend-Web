"use client";

import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { ThreeDots } from "react-loader-spinner";
import { Video, VideoOff, Mic, MicOff, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { IEvent } from "@/app/interfaces/event.interface";
// import Cookies from "js-cookie";
// import { TOKEN_NAME } from "@/utils/constant";
import axiosApi from "@/lib/axios";

// interface WebcamProps {
//   data: {
//     _id: string;
//     token: string;
//     channelName: string;
//   };
// }

const client: IAgoraRTCClient = AgoraRTC.createClient({
  mode: "live",
  codec: "vp8",
});

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
const UID: number | null = null;

const WebcamP: React.FC<{ data: IEvent | null }> = ({ data }) => {
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  //   const token = Cookies.get(TOKEN_NAME);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [micTrack, setMicTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [camTrack, setCamTrack] = useState<ICameraVideoTrack | null>(null);

  const getStreamStats = async () => {
    try {
      const { data: response } = await axiosApi.patch(
        `/events/live/${data?._id}`,
        {
          body: JSON.stringify({
            streamType: "agora",
          }),
        },
      );

      return response;
    } catch (error) {
      console.error("Stream init error:", error);
      return null;
    }
  };

  const joinAsHost = async () => {
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
      await client.join(
        APP_ID,
        data?.channelName || "Fero Event",
        data?.token || null,
        UID,
      );

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

  const leave = async () => {
    try {
      micTrack?.stop();
      micTrack?.close();
      camTrack?.stop();
      camTrack?.close();

      await client.leave();
      setJoined(false);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-[430px] h-[300px] bg-black rounded-t-lg">
      <div ref={localVideoRef} className="w-full h-full rounded-t-lg" />

      {joined && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 rounded-lg py-3 px-4">
          <button onClick={toggleCamera} className="text-white">
            {cameraOn ? <Video /> : <VideoOff />}
          </button>
          <button onClick={toggleMic} className="text-white">
            {micOn ? <Mic /> : <MicOff />}
          </button>
          <button onClick={leave}>
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
