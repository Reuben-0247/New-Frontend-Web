/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useEventStore } from "@/app/store/event.store";
import { IRecording } from "@/app/interfaces/event.interface";

const LiveVOD: React.FC<{ vodData: IRecording[] }> = ({ vodData }) => {
  const { event } = useEventStore();
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [showThumbs, setShowThumbs] = useState<Record<string, boolean>>({});

  const handleShare = (eventtitle: string, id: string, date: string) => {
    const URL = `${window.location.origin}/find-events/${id}?label=${encodeURIComponent(eventtitle)}&date=${encodeURIComponent(date)}`;
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

  function formatClock(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
  }

  return (
    <Warpper vodData={vodData}>
      <div className="bg-background   w-full ">
        <div className="w-full vod ">
          <div>
            {!vodData.length ? (
              <p className="text-foreground mt-6 mb-4 font-nuni mx-auto w-full text-[14px] text-center">
                No recordings available yet.
              </p>
            ) : (
              <div className="videos ">
                {vodData?.map((v, i) => (
                  <div key={i} className=" inner relative">
                    <div className="src">
                      {showThumbs[v?.recording_id] !== false && (
                        <div
                          className="tumb"
                          style={{
                            backgroundImage: `url(${v?.download_url || "/images/play-tumb.jpg"})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}>
                          <div className="opacity">
                            <div className="time-label">
                              {formatClock(v.duration)}
                            </div>
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
                      <div className="flex justify-end items-center">
                        {/* <button className="text-[#A4A4A4] cursor-pointer">
                          <a
                            href={v?.download_url}
                            download
                            className="text-[#A4A4A4] no-underline">
                            Download stream
                          </a>
                        </button> */}
                        <button
                          className="text-[#A4A4A4] cursor-pointer"
                          onClick={() =>
                            handleShare(
                              event?.title || "Fero Event",
                              v?.eventId,
                              v?.createdAt,
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

export default LiveVOD;

const Warpper = styled.div<{ vodData?: IRecording[] }>`
  .videos {

    display: grid;
    grid-template-columns: ${({ vodData }) =>
      vodData && vodData.length > 1 ? "repeat(2, 1fr)" : "repeat(1, 1fr)"}
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
