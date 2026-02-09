/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
// import StreamLinks from "../components/StreamLinks";
// import { Share } from "lucide-react";
import styled from "styled-components";
// import { MenuIcon } from "lucide-react";
import axiosApi from "@/lib/axios";
import { useEventStore } from "@/app/store/event.store";
import { IRecording } from "@/app/interfaces/event.interface";
import { toast, ToastContent } from "react-toastify";
import { Spinner } from "../Spinner";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";

const LiveToVOD = () => {
  const [enabled, setEnabled] = useState(false);
  const [vodData, setVodData] = useState<IRecording[]>([]);
  // const [show, setShow] = useState(false);
  const [loadingT, setLoadingT] = useState(false);

  const [loading, setLoading] = useState(false);
  const { event } = useEventStore();
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [showThumbs, setShowThumbs] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!event?.castrStreamId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosApi.get<{ response: IRecording[] }>(
          `/stream/castr/${event.castrStreamId}/retrieve_temp_recordings`,
        );
        if (data?.response) {
          setVodData(data.response);
        }
      } catch (err) {
        setLoading(false);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [event?.castrStreamId]);

  // const enableVod = async () => {
  //   setEnabled(!enabled);
  // };

  // const videoData = [
  //   {
  //     id: "tete",
  //     video: "/videos/Introduction.mp4",
  //     minutes: "2hrs 80mins 5secs",
  //     playIcon: "/images/play-icon.png",
  //     bg: "/images/play-tumb.jpg",
  //     videoName: "CONFIG Watch Party, PH Chapter",
  //     btn: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Download stream</span>
  //         <img src="/images/Vector.png" alt="" />
  //       </p>
  //     ),
  //     share: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Share</span> <img src="/images/share.png" alt="" />
  //       </p>
  //     ),
  //   },
  //   {
  //     id: "tetew",
  //     video: "/videos/Introduction.mp4",
  //     minutes: "2hrs 80mins 5secs",
  //     playIcon: "/images/play-icon.png",
  //     bg: "/images/play-tumb.jpg",
  //     videoName: "CONFIG Watch Party, PH Chapter",
  //     btn: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Download stream</span>
  //         <img src="/images/Vector.png" alt="" />
  //       </p>
  //     ),
  //     share: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Share</span> <img src="/images/share.png" alt="" />
  //       </p>
  //     ),
  //   },
  //   {
  //     id: "teteee",
  //     video: "/videos/Introduction.mp4",
  //     minutes: "2hrs 80mins 5secs",
  //     playIcon: "/images/play-icon.png",
  //     bg: "/images/play-tumb.jpg",
  //     videoName: "CONFIG Watch Party, PH Chapter",
  //     btn: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Download stream</span>
  //         <img src="/images/Vector.png" alt="" />
  //       </p>
  //     ),
  //     share: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Share</span> <img src="/images/share.png" alt="" />
  //       </p>
  //     ),
  //   },
  //   {
  //     id: "teterr",
  //     video: "/videos/Introduction.mp4",
  //     minutes: "2hrs 80mins 5secs",
  //     playIcon: "/images/play-icon.png",
  //     bg: "/images/play-tumb.jpg",
  //     videoName: "CONFIG Watch Party, PH Chapter",
  //     btn: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Download stream</span>
  //         <img src="/images/Vector.png" alt="" />
  //       </p>
  //     ),
  //     share: (
  //       <p className="flex items-center gap-2 m-0">
  //         <span>Share</span> <img src="/images/share.png" alt="" />
  //       </p>
  //     ),
  //   },
  // ];

  const handleShare = (eventtitle: string, eventId: string) => {
    const URL = `${window.location.origin}/Live-Event/${eventtitle}/${eventId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Watch this video",
          text: "Check out this video!",
          url: URL,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(URL);
      alert("Link copied to clipboard!");
    }
  };

  const handlePauseVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setShowThumbs((prev) => ({ ...prev, [id]: false }));
      } else {
        video.pause();
        setShowThumbs((prev) => ({ ...prev, [id]: true }));
      }
    }
  };

  const enableCloudRecord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (!event?.castrStreamId) {
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
    };

    try {
      const { data: res } = await axiosApi.patch(
        `/stream/castr/${event?.castrStreamId}`,
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
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      setEnabled(!checked);
      console.error(error);
    } finally {
      setLoadingT(false);
    }
  };

  // const handlePlayPause = (id:string) => {
  //   const video = videoRefs.current[id];
  //   if (video) {
  //     if (video.paused) {
  //       video.play();
  //       setShowThumbs((prev) => ({ ...prev, [id]: false }));
  //     } else {
  //       video.pause();
  //       setShowThumbs((prev) => ({ ...prev, [id]: true }));
  //     }
  //   }
  // };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />{" "}
      </div>
    );
  }

  return (
    <Warpper>
      <div className="bg-background   w-full ">
        <div className="w-full vod ">
          <div className="w-full px-2  justify-center flex pt-12 mt-8">
            <div>
              {enabled ? (
                <p className="text-foreground font-nuni mx-auto w-full text-[14px] text-center">
                  Auto Recording is enabled. Your streams will be recorded
                </p>
              ) : (
                <p className="text-foreground font-nuni mx-auto w-full text-[14px] text-center">
                  Auto-recording is disabled. Your streams will not be recorded.
                  Enable this option to automatically record your live event.
                </p>
              )}
              <div className="flex w-fit mx-auto items-center">
                <p className="text-foreground font-nuni my-0 mr-2 ">Enable</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enabled}
                    disabled={loadingT}
                    onChange={enableCloudRecord}
                  />
                  <div className="w-11 h-6 border-[#0062FF] border peer-focus:outline-none peer-checked:bg-[#cc0000] rounded-full peer  transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 border-[#0062FF] border bg-[#000826] w-5 h-5 rounded-full transition-transform duration-300 transform peer-checked:translate-x-full"></div>
                </label>
              </div>
            </div>
          </div>
          <div>
            {vodData.length === 0 ? (
              <p className="text-foreground mt-6 mb-4 font-nuni mx-auto w-full text-[14px] text-center">
                No recordings available yet.
              </p>
            ) : (
              <div className="videos ">
                {vodData.map((v, i) => (
                  <div key={i} className=" inner relative">
                    <div className="src">
                      {showThumbs[v?.recording_id] !== false && (
                        <div
                          className="tumb"
                          style={{
                            backgroundImage: `url(${"/images/play-tumb.jpg"})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}>
                          <div className="opacity">
                            <div className="time-label">{v.duration}</div>
                            <button
                              className="cursor-pointer"
                              onClick={() => handlePauseVideo(v?.recording_id)}>
                              <img src={"/images/play-icon.png"} alt="" />
                            </button>
                          </div>
                        </div>
                      )}

                      <video
                        ref={(el) => {
                          videoRefs.current[v.recording_id] = el;
                        }}
                        src={v?.download_url}
                        className="w-full vid "
                        controls={true}
                        onPause={() =>
                          setShowThumbs((prev) => ({
                            ...prev,
                            [v.recording_id]: true,
                          }))
                        }
                        onPlay={() =>
                          setShowThumbs((prev) => ({
                            ...prev,
                            [v.recording_id]: false,
                          }))
                        }
                        // onTimeUpdate={handlePauseVideo(v.id)}
                      />

                      {/* {showThumbs[v.id] === false && (
                      <button
                        className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded"
                        onClick={() => handlePlayPause(v.id)}>
                        Pause
                      </button>
                    )} */}
                    </div>
                    <div className="action  p-3">
                      <h4 className="mb-3 text-white">{event?.title}</h4>
                      <div className="flex justify-between items-center">
                        <button className="text-[#A4A4A4] cursor-pointer">
                          <a
                            href={v?.download_url}
                            download
                            className="text-[#A4A4A4] no-underline">
                            Download stream
                          </a>
                        </button>
                        <button
                          className="text-[#A4A4A4] cursor-pointer"
                          onClick={() =>
                            handleShare(
                              event?.title || "Fero Event",
                              v.recording_id,
                            )
                          }>
                          <p className="flex items-center gap-2 m-0">
                            <span>Share</span>{" "}
                            <img src="/images/share.png" alt="" />
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Warpper>
  );
};

export default LiveToVOD;

const Warpper = styled.div`
  .videos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 2rem;
    gap: 1.5rem;
    .inner {
      /* height: 302px; */
      .src {
        position: relative;
        border-radius: 10px 10px 0 0;
        /* height: 250px; */
        .vid {
          border-radius: 10px 10px 0 0;
        }
        .tumb {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          border-radius: 10px 10px 0 0;

          z-index: 4;
          .opacity {
            position: relative;

            background-color: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              border-radius: 10px 10px 0 0;
            }
            .time-label {
              position: absolute;
              top: 10px;
              right: 0.7rem;
              background-color: #7b0101b2;
              border-radius: 5px;
              padding: 5px 10px;
              color: white;
            }
          }
        }
      }
    }
    .action {
      border-radius: 0 0 10px 10px;
      background-color: #000412;
    }
    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  .aside {
    width: 25vw;
    &-inner {
      width: 100%;
    }
  }
  .hambuger {
    display: none;
  }
  @media screen and (max-width: 768px) {
    /* .aside {
      &.close {
        left: -1000px;
      }

      &.open {
        left: 0;
        }
    } */

    .aside {
      position: absolute;
      top: 0;
      width: 100vw;
      transition: all 600ms ease-in-out;
      background-color: rgba(0, 0, 0, 0.322);
      z-index: 13;
      &-inner {
        z-index: 15;
        background-color: #000826;
        width: 80vw;
      }
      &.close {
        left: -1000px;
        /* display: none; */
      }

      &.open {
        left: 0;
        /* display: block; */
      }
    }

    .hambuger {
      display: block;
      position: absolute;
      z-index: 10;
      width: 100%;

      .btn {
        padding: 1rem;
      }
    }
  }
`;
