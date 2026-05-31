"use client";
import ModalComp from "@/app/components/ModalComp";
import EventBoardComp from "@/app/components/stream-comps/EventBoardComp";
import EventParticipantComp from "@/app/components/stream-comps/EventParticipantComp";
import EventReviewsComp from "@/app/components/stream-comps/EventReviewsComp";
import HostComments from "@/app/components/stream-comps/HostComments";
import SoftwareProp from "@/app/components/stream-comps/SoftwareProp";
import StreamInfo from "@/app/components/stream-comps/StreamInfo";
import WebcamP from "@/app/components/stream-comps/Webcam";
import { IStreamData, IStreamStats } from "@/app/interfaces/castr.interface";
import { IEvent } from "@/app/interfaces/event.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { useEventStore } from "@/app/store/event.store";
import { Button } from "@/components/ui/button";
import axiosApi from "@/lib/axios";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import {
  Airplay,
  ArrowLeft,
  CircleQuestionMark,
  // EyeIcon,
  // Ratio,
  // Signal,
  // Volume2,
  Webcam,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiMiniSignal } from "react-icons/hi2";
import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContent } from "react-toastify";
const tabs: { name: string }[] = [
  {
    name: "Board",
  },
  {
    name: "Participants",
  },
  {
    name: "Chats",
  },
  {
    name: "Reviews",
  },
];

const StreamPage = () => {
  const [active, setActive] = useState<string>("Board");
  const [loadingS, setLoadingS] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [loadingT, setLoadingT] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [bandWidth, setBandWidth] = useState("");
  const [videoSrc, setVideoSrc] = useState("Streaming Sofware");
  const {
    event,
    setStreamData,
    setEvent,
    streamData,
    loading,
    goLiveEvent,
    endStream,
  } = useEventStore();
  const { auth } = useAuthStore();
  const router = useRouter();
  const [isLive, setIslive] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [streamStats, setStreamStats] = useState<IStreamStats>();
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem("cloud_recording");
    if (saved !== null) {
      setEnabled(JSON.parse(saved));
    }
  }, []);

  const createStream = async () => {
    try {
      const body = {
        name: event?.title,
        eventId: event?._id,
        enabled: true,
        settings: {
          abr: false,
          cloud_recording: false,
        },
        streamType: "castr",
      };
      setLoadingS(true);

      const { data } = await axiosApi.post<{
        stream: IStreamData;
        streamType: string;
      }>(`/stream/castr/create/${auth?._id}`, body);
      setStreamData(data?.stream);
      setEvent({
        ...event,
        streamType: data?.streamType,
        castrStreamId: data?.stream?.castrStreamId,
      } as IEvent);
      toast.success("Stream Created Successfully", { delay: 3000 });
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      console.error("Error fetching event:", error);
    } finally {
      setLoadingS(false);
    }
  };

  const goLive = async () => {
    // setIsLoading(true);
    await goLiveEvent(event?._id || "", auth?._id || "");
    setIslive(!isLive);
    toast.success(isLive ? "Event is now offline" : "Event is now live", {
      delay: 3000,
    });
    // setIsLoading(false);
  };

  const endEventStream = async () => {
    sessionStorage.setItem("cloud_recording", JSON.stringify(false));

    const body = {
      settings: {
        abr: false,
        cloud_recording: false,
      },
      name: event?.title,
      enabled: false,
    };
    const res = await axiosApi.patch(
      `/stream/castr/${streamData?.castrStreamId}`,
      body,
    );

    if (res && enabled === true) {
      toast.success("Cloud Recording disabled...");
      setEnabled(false);
    }
    endStream(event?._id || "", auth?._id || "", "castr");
    setOpenModal(false);
  };
  useEffect(() => {
    const castrId = streamData?.castrStreamId;
    if (!castrId) {
      return;
    }
    let cancelled = false;
    const getStreamStats = async () => {
      try {
        const { data } = await axiosApi.get<{
          response: IStreamStats;
          usedBandwidth: string;
        }>(`/stream/castr/${castrId}/stats/${auth?._id}`);
        // console.log(data.response);
        if (!cancelled) {
          setStreamStats(data.response);
        }
        setBandWidth(data?.usedBandwidth);
        //  setStats(response?.data?.response);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (!cancelled) {
          console.debug("Stats fetch failed, retrying...");
        }
        if (axiosError.response?.status !== 404) {
          console.warn("Stream stats unavailable");
        }
      }
    };
    const getViewers = async () => {
      try {
        const { data } = await axiosApi.get<{ viewers: number }>(
          `/stream/viewers/${event?._id}`,
        );
        if (data) {
          setViewers(data.viewers);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (!cancelled) {
          console.debug("Viewers fetch failed, retrying...");
        }
        if (axiosError.response?.status !== 404) {
          console.warn("Viewers count unavailable");
        }
      }
    };
    getStreamStats();
    getViewers();

    const interval = setInterval(() => {
      getStreamStats();
      getViewers();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [streamData?.castrStreamId, event?.castrStreamId, auth?._id, event?._id]);

  // Runs ONCE on mount — sets initial values based on screen size
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsPublished(!isMobile);
    setVideoSrc(isMobile ? "Webcam" : "Streaming Sofware");
  }, []); // no dependencies

  // Handles resize only — does NOT depend on videoSrc
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsPublished(!isMobile);
      setVideoSrc(isMobile ? "Webcam" : "Streaming Sofware");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Syncs isPublished when user manually toggles videoSrc
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsPublished(videoSrc !== "Webcam");
    } else {
      setIsPublished(videoSrc === "Streaming Sofware");
    }
  }, [videoSrc]);

  // useEffect(() => {
  //   //  const isMobile = window.innerWidth < 768;
  //   if (videoSrc === "Streaming Sofware") {
  //     setIsPublished(true);
  //   } else {
  //     setIsPublished(false);
  //   }
  // }, [videoSrc]);

  const enableCloudRecord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (!streamData?.castrStreamId) {
      toast.warn("Please create a stream...");
      return;
    }

    if (loadingT) return;
    setLoadingT(true);
    setEnabled(checked);
    sessionStorage.setItem("cloud_recording", JSON.stringify(checked));

    const body = {
      settings: {
        abr: false,
        cloud_recording: checked,
      },
      name: event?.title,
      enabled: true,
    };

    try {
      const res = await axiosApi.patch(
        `/stream/castr/${streamData?.castrStreamId}`,
        body,
      );

      if (res) {
        toast.success(
          checked
            ? "Cloud Recording enabled..."
            : "Cloud Recording disabled...",
        );

        setLoadingT(false);
      }
    } catch (error) {
      setEnabled(!checked);
      console.error(error);
    } finally {
      setLoadingT(false);
    }
  };

  // const saveVod = async () => {
  //   try {
  //     const { data } = await axiosApi.post(
  //       `/stream/save-temp_recs/${event?._id}/${auth?._id}/${event?.castrStreamId}`,
  //     );
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getVod = async () => {
  //   try {
  //     const { data } = await axiosApi.get(`/stream/${auth?._id}/recodings`);
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const videoSrcData: {
    label: string;
    icon: React.ReactNode;
    disabled: boolean;
    hidden?: boolean;
  }[] = [
    {
      label: "Streaming Sofware",
      icon: <Airplay />,
      disabled: event?.streamType === "agora",
    },
    {
      label: "Webcam",
      icon: <Webcam />,
      disabled: event?.streamType === "castr",
    },
  ];

  const playBackUrl = streamData?.playBack?.embedUrl;

  return (
    <div>
      <ModalComp onClose={() => setOpenModal(false)} open={openModal}>
        <div className="absolute inset-0 flex items-center justify-center z-9999 bg-slate-900 bg-opacity-50">
          <div className="bg-[#1B2440] rounded-[5px] w-[400px] h-fit p-4">
            <p className="text-white font-nuni text-[16px] text-center mb-3">
              Are you sure you want to end this stream?
            </p>

            <div className="flex items-center justify-center gap-x-5">
              <Button
                disabled={loading}
                onClick={endEventStream}
                className="flex items-center justify-center w-fit text-[15px] cursor-pointer text-white rounded-lg bg-[#720013] hover:bg-[#44010d]   transition-colors duration-200">
                End Stream
              </Button>
              <Button
                variant={"outline"}
                onClick={() => setOpenModal(false)}
                className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </ModalComp>
      <div className="flex  justify-between">
        <div>
          <Button
            onClick={() => router.push(`/events/${event?._id}`)}
            size={"sm"}
            variant={"outline"}
            className="text-foreground font-semibold cursor-pointer">
            <ArrowLeft /> <span>Back</span>
          </Button>
          {/* <p className="mt-4 text-2xl font-bold text-foreground">Title</p> */}
        </div>

        <p className="font-bold text-2xl text-foreground">{event?.title}</p>
      </div>
      <div className="flex justify-end items-center w-full my-4">
        <Link
          href={`https://docs.castr.com/en/articles/4825093-recommended-settings-for-encoders`}
          target="_blank"
          className="  underline flex items-center gap-1 text-foreground cursor-pointer">
          <CircleQuestionMark size={20} className="text-amber-300" />{" "}
          Recommended Settings for Encoders
        </Link>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 mt-8">
        <div className="event-details md:w-[50%] w-full ">
          <div className="tabs w-full flex items-center justify-between  text-white  py-2  md:px-4 px-2  bg-black rounded-md">
            {tabs.map((tab) => (
              <p
                onClick={() => setActive(tab.name)}
                className={`cursor-pointer py-2 md:px-6 px-2   ${
                  active === tab.name ? "border-b-2 pb-2" : ""
                }`}
                key={tab.name}>
                {tab.name}
              </p>
            ))}
          </div>

          <div className="views bg-background p-4">
            {active === "Board" ? (
              <EventBoardComp />
            ) : active === "Participants" ? (
              <EventParticipantComp eventId={event?._id || ""} />
            ) : active === "Chats" ? (
              <HostComments eventId={event?._id || ""} />
            ) : (
              active === "Reviews" && (
                <EventReviewsComp eventId={event?._id || ""} />
              )
            )}
          </div>
        </div>
        <div className=" bg-[#151e37] stream-tab md:w-[50%]  w-full p-2">
          <StreamInfo
            stats={streamStats}
            usedBandwidth={bandWidth}
            viewers={viewers}
          />
          <hr />
          {isPublished ? (
            <div className="w-full h-[300px] relative flex mt-2 rounded-md items-center border justify-center bg-[#151E37] ">
              {streamData ? (
                <div className="w-full  h-full ">
                  <iframe
                    src={playBackUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    title="Castr Live Stream"
                  />
                  <div>
                    {!event?.isLive ? (
                      <div className="w-full gap-4 flex absolute bottom-[150px] items-center justify-center">
                        <button
                          onClick={goLive}
                          disabled={loading}
                          className=" cursor-pointer rounded-[5px] text-[14px] flex items-center font-nuni bg-[#720013] \ px-2 h-[45px] ">
                          <HiMiniSignal size={13} color="white" />
                          <span className="ml-2 text-white text-[14px]">
                            {loading ? <ThreeDots color="white" /> : " Go live"}
                            {/* Go live */}
                          </span>
                        </button>
                        <button
                          onClick={() => setOpenModal(true)}
                          className=" cursor-pointer rounded-[5px] text-[14px] font-nuni bg-primary text-white px-2 h-[45px] ">
                          End Stream
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex absolute bottom-5 items-center justify-center">
                        <button
                          onClick={() => setOpenModal(true)}
                          className=" cursor-pointer rounded-[5px] text-[14px] font-nuni bg-[#720013] text-white px-2 h-[45px] ">
                          End Stream
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={createStream}
                  className="flex items-center cursor-pointer  mb-3 rounded-lg bg-[#0062FF] px-2 h-[45px] ">
                  {loadingS ? (
                    <ThreeDots color="white" />
                  ) : (
                    <span className="text-white flex items-center gap-1 ml-2 text-[18px]">
                      + Create Stream
                    </span>
                  )}
                </button>
              )}
            </div>
          ) : (
            <WebcamP data={event} />
          )}

          <div className="vsrc flex md:justify-between justify-center items-center p-2 rounded-md bg-[#2e3c65] my-4">
            <div className="flex">
              {videoSrcData.map((src) => (
                <p
                  className={`py-2 md:px-4 px-2 text-white flex items-center md:gap-2 gap-1 font-bold ${src.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${
                    videoSrc === src.label ? "bg-[#232e4e] rounded-md" : ""
                  } ${src.label === "Streaming Sofware" ? "hidden md:block" : "md:block"}`}
                  key={src.label}
                  onClick={() => !src.disabled && setVideoSrc(src.label)}>
                  <span className="text-white">{src.icon}</span> {src.label}
                </p>
              ))}
            </div>
            <div className="hidden md:block">
              {videoSrc === "Streaming Sofware" && (
                <div className="flex items-center ml-2 gap-2">
                  <label
                    title={
                      !auth?.hasSubscribed
                        ? "Subscribe to enable"
                        : "Cloud Recording"
                    }
                    className={`relative inline-flex items-center ${!auth?.hasSubscribed ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={enabled}
                      disabled={loadingT || !auth?.hasSubscribed}
                      onChange={enableCloudRecord}
                    />
                    <div className="w-8 h-[19px] border-[#0062FF] peer-checked:border-[#cc0000] border-2 peer-focus:outline-none peer-focus:ring-2 peer-focus:bg-[#0f1525] rounded-full peer peer-checked:bg-[#cc0000] p-1 transition-all duration-300"></div>
                    <div className="absolute left-[3px] top-0.4 bg-[#FFFFFF] w-[13px] h-[13px] rounded-full transition-transform duration-300 transform peer-checked:translate-x-full"></div>
                  </label>
                  <small className="text-white">Recording</small>
                </div>
              )}
            </div>
          </div>
          <div className="vsrc flex justify-between items-center   my-4">
            {active && (
              <SoftwareProp streamType={videoSrc} streamData={streamData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
