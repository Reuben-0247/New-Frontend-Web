"use client";
import ModalComp from "@/app/components/ModalComp";
import { IRecording } from "@/app/interfaces/event.interface";
import { useEventStore } from "@/app/store/event.store";
import axiosApi from "@/lib/axios";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContent } from "react-toastify";
import { styled } from "styled-components";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { Button } from "@/components/ui/button";
import { Save, ScissorsLineDashed } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AxiosError } from "axios";
import { formatError } from "@/utils/helper";
// import { Spinner } from "@/app/components/Spinner";

const LiveClipingPage = () => {
  const { event } = useEventStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [data, setData] = useState<IRecording[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isNewClippingOpen, setIsNewClippingOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [download, setDownload] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [clipInput, setClipInput] = useState({
    name: "",
    download_url: "",
  });

  useEffect(() => {
    if (!event?.castrStreamId) return;

    (async () => {
      try {
        const { data } = await axiosApi.get<IRecording[]>(
          `/stream/castr/${event.castrStreamId}/retrieve_temp_recordings`,
        );

        setData(data || []);
      } catch (error) {
        const axiosError = error as AxiosError;
        const formattedError = formatError(axiosError);
        toast.error(
          (formattedError.response as ToastContent) ||
            "Failed to load recordings",
        );
      }
    })();
  }, [event?.castrStreamId]);

  const onLoadedMetadata = () => {
    if (!videoRef.current) return;

    const dur = videoRef.current.duration;
    // setVideoDuration(videoRef.current.duration);
    // setEndTime(videoRef.current.duration);
    setVideoDuration(data[0]?.duration);
    setEndTime(dur);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    if (videoRef.current.currentTime >= endTime) {
      videoRef.current.pause();
    }
  };
  const [downloadTime, setDownloadTime] = useState(0);

  const buildClipUrl = () => {
    if (!clipInput.download_url) return "";

    // Extract base URL and filename
    const parts = clipInput.download_url.split("/");
    const fileName = parts.pop();
    const baseUrl = parts.join("/");

    if (!fileName) return "";

    // Extract original start & duration
    const match = fileName.match(/archive-(\d+)-(\d+)\.mp4/);
    if (!match) return "";

    const originalStart = Number(match[1]);

    // Convert slider times (seconds) → seconds
    const startSec = Math.floor(startTime);
    const durationSec = Math.floor(endTime - startTime);

    // NEW start = original start + offset
    const newStart = originalStart + startSec;

    return `${baseUrl}/archive-${newStart}-${durationSec}.mp4`;
  };

  const handleClip = () => {
    const url = buildClipUrl();
    if (!url) return;
    setDownloadUrl(url);
    setDownload(true);
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    setLoading(true);
    setDownloadTime(0);
    let fakeProgress = 0;
    let interval: NodeJS.Timeout | null = null;

    try {
      const response = await fetch(downloadUrl);

      if (!response.ok) throw new Error("Download failed");

      const contentLength = response.headers.get("content-length");

      if (!contentLength) {
        interval = setInterval(() => {
          if (fakeProgress < 70) {
            fakeProgress += Math.random() * 8;
          } else if (fakeProgress < 90) {
            fakeProgress += Math.random() * 0.8;
          } else if (fakeProgress < 99) {
            fakeProgress += 0.1;
          } else {
            fakeProgress = 99;
          }

          setDownloadTime(Math.floor(fakeProgress));
        }, 300);
      }

      const blob = await response.blob();

      setDownloadTime(100);

      if (interval) clearInterval(interval);

      const fileName = `${clipInput.name || "clip"}.mp4`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.success(`${fileName} downloaded..`);
      setDownload(false);
      setShowPlayer(false);
    } catch (err) {
      console.error(err);
    } finally {
      if (interval) clearInterval(interval);
      setLoading(false);
    }
  };

  const openLiveVideoPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipInput.download_url || !clipInput.name)
      return toast.warn("Enter video name and select video ");
    setShowPlayer(true);
  };

  return (
    <Wrapper>
      <div className="flex  justify-between">
        <div>
          <div className="">Cliping Page</div>
        </div>
        <p className="font-bold text-2xl text-foreground">{event?.title}</p>
      </div>
      {/* {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div>
            
            <p>Getting...</p>
          </div>
        </div>
      ) : ( */}
      <div>
        {!showPlayer ? (
          <div>
            {isNewClippingOpen ? (
              <div>
                <div className="mt-10 w-full ">
                  <div className="bg-background shadow-xl mx-auto md:w-[40%] w-full rounded-[5px] p-4 ">
                    <div className="mb-6">
                      <p className="text-foreground m-0 text-[20px] font-nuni ">
                        New Live Clipping
                      </p>
                      <p className="mt-4 text-[16px] text-foreground font-nuni ">
                        Choose a stream and highlight a moment
                      </p>
                    </div>
                    <form onSubmit={openLiveVideoPlayer}>
                      <div className="mb-3 flex flex-col ">
                        <label
                          htmlFor="clipName"
                          className="mb-2 text-foreground text-[16px] ">
                          Clip Name
                        </label>
                        <Input
                          type="text"
                          value={clipInput.name}
                          onChange={(e) =>
                            setClipInput({
                              ...clipInput,
                              name: e.target.value,
                            })
                          }
                          id="clipName"
                          className="dark:bg-[#2E3C65]  text-foreground   "
                          placeholder="Enter Live clipping name"
                        />
                      </div>
                      <div className="mb-6 flex flex-col ">
                        <label className="mb-2 text-foreground text-[16px] ">
                          Streams
                        </label>
                        <Select
                          value={clipInput.download_url}
                          onValueChange={(value) =>
                            setClipInput({
                              ...clipInput,
                              download_url: value,
                            })
                          }
                          disabled={!data?.length}>
                          <SelectTrigger className="w-full ">
                            <SelectValue placeholder="Select recording" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectGroup>
                              <SelectLabel>Recordings</SelectLabel>
                              {data?.map((d, i) => (
                                <SelectItem key={i} value={d?.download_url}>
                                  {event?.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between mt-9 items-center w-full gap-x-5">
                        <button className="flex items-center rounded-lg mb-4 bg-[#0062FF] px-2 h-[45px] ">
                          <span className="text-white ml-2 text-[18px]">
                            + Create Live Clip
                          </span>
                        </button>
                        <button
                          onClick={() => setIsNewClippingOpen(false)}
                          className="flex items-center rounded-lg mb-4 border-[#A4A4A4] bg-trannsparent border-[.5px] px-2 h-[45px] ">
                          <span className="text-[#A4A4A4] ml-2 text-[18px]">
                            Cancel
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="bg-background mt-8 border-none">
                <div className="w-full px-4 items-center justify-center flex pt-12">
                  <div>
                    <p className="text-foreground text-[18px] text-center ">
                      No live videos yet
                    </p>
                    <p className="text-foreground text-[14px] text-center">
                      Your live videos will be here after every live session so
                      you can clip them
                    </p>
                    <div className="flex items-center justify-center mt-6 mx-auto w-full gap-x-5">
                      <Button
                        onClick={() => {
                          if (!event?.isLive) {
                            return toast.warn("Event is not live!");
                          }
                          setIsNewClippingOpen(true);
                        }}
                        className="cursor-pointer text-white">
                        <ScissorsLineDashed size={24} />
                        Create Live Clip
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div>
            <ModalComp
              open={download}
              onClose={() => setDownload(false)}
              header="Clip Ready"
              saveText="Download Clip"
              loading={loading}
              onSave={handleDownload}
              saveIcon={<Save size={18} />}>
              <div className="relative">
                {loading && (
                  <div className="mt-4 absolute">
                    <p className="text-white text-center">
                      Downloading... {downloadTime}%
                    </p>

                    <div className="w-full bg-gray-300 h-2 rounded mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${downloadTime}%` }}
                      />
                    </div>
                  </div>
                )}
                <video src={downloadUrl} controls className="w-full h-[50vh]" />
                <a
                  href={downloadUrl}
                  download={`${clipInput.name || "clip"}.mp4`}
                  className="block mt-4 text-center">
                  Download Clip
                </a>
              </div>
            </ModalComp>
            <ModalComp
              open={showPlayer}
              onClose={() => setShowPlayer(false)}
              onSave={handleClip}
              // loading={loading}
              saveIcon={<Save size={18} />}
              saveText="Save Clip"
              header="Live Clip">
              <video
                ref={videoRef}
                src={clipInput.download_url}
                controls
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-[50vh]"
              />

              {videoDuration > 0 && (
                <>
                  <Nouislider
                    range={{ min: 0, max: videoDuration }}
                    start={[0, videoDuration]}
                    connect
                    onUpdate={(v, h) =>
                      h === 0
                        ? setStartTime(Number(v[0]))
                        : setEndTime(Number(v[1]))
                    }
                  />

                  <p className="text-white mt-4">
                    Start: {startTime.toFixed(2)}s — End: {endTime.toFixed(2)}s
                  </p>
                </>
              )}
            </ModalComp>
          </div>
        )}
      </div>
      {/* )} */}
    </Wrapper>
  );
};

export default LiveClipingPage;

const Wrapper = styled.div`
  .clipping {
    height: 100vh;
    overflow-y: scroll;
  }
`;
