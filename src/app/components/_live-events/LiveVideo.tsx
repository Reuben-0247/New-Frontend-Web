"use client";
/* eslint-disable @next/next/no-img-element */
import { IStreamData } from "@/app/interfaces/castr.interface";
import { IEvent } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import EmojiPicker from "emoji-picker-react";
import { Video } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const LiveVideo: React.FC<{
  streamData: IStreamData | null;
  event: IEvent | null;
}> = ({ streamData, event }) => {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);

  const [showPicker, setShowPicker] = useState(false);
  // const [message, setMessage] = useState("");
  const [isStreamVisible, setIsStreamVisible] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node) &&
        !reviewRef.current?.contains(e.target as Node)
      ) {
        setShowPicker(false);
        setShowReview(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendReview = async () => {
    if (rating === 0 || comment.trim() === "") {
      setMsg("Please select a rating and drop your thought.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const response = await axiosApi.post(`/events/${event?._id}/reviews`, {
        title: event?.title,
        comment,
        rating,
      });

      if (response.data.status === "success") {
        setMsg("Review sent successfully");
        toast.success("Review sent successfull");

        setComment("");
        setRating(0);
        setShowReview(false);
      } else {
        setMsg("Failed to send review");
      }
    } catch (err) {
      console.error("Review error:", err);
      setMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setReactions((prev) => [...prev, emoji]);
    setTimeout(() => {
      setReactions((prev) => prev.slice(1));
    }, 3000);
  };

  return (
    <Wrapper>
      <div>
        <div className="relative w-full h-full">
          {isStreamVisible && streamData?.playBack?.embedUrl ? (
            <iframe
              src={streamData?.playBack?.embedUrl}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="md:h-[70vh] h-[40vh] w-full"
            />
          ) : (
            <img
              src={
                event?.displayImage ||
                "https://placehold.co/1280x720/000000/FFFFFF?text=Stream+Offline"
              }
              alt="Stream"
              className="w-full md:h-[70vh] h-[40vh] object-cover "
            />
          )}

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {reactions.map((emoji, idx) => (
              <span
                key={idx}
                className="absolute text-4xl float-emoji"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                  // animationDelay: `${Math.random() * }s`,
                }}>
                {emoji}
              </span>
            ))}
          </div>

          {showReview && (
            <div
              ref={reviewRef}
              className="absolute bottom-9 translate-y-[100px] md:-translate-y-[100px] sm:w-[330px] left-1 right-1 md:right-0 md:left-3 bg-[#0C1220] p-4 rounded-xl z-50 text-white shadow-xl">
              <h2 className="text-lg font-bold mb-1">Rate this Event</h2>
              <p className="text-sm text-gray-400 mb-3">
                Your honest review is anonymously shared only with the event
                host.
              </p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      rating >= star ? "text-yellow-400" : "text-gray-600"
                    }`}>
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="w-full min-h-[60px] bg-[#1D2331] p-3 rounded-md text-sm text-white placeholder-gray-400"
                placeholder="The Digital Creators Summit brought together..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                onClick={sendReview}
                disabled={loading}
                className={`mt-3 px-4 py-2.5   text-white font-semibold rounded-md bg-[#0062FF]`}>
                {loading ? "Sending..." : "Send"}
              </button>

              {msg && (
                <p
                  className={`mt-2 text-sm ${
                    msg.toLowerCase().includes("success")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}>
                  {msg}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:border-t  bg-[#000826] md:bg-black md:bg-opacity-70 p-2 flex  md:gap-3 justify-between items-center text-white relative">
          <button
            className=" h-9 md:h-10 md:ms-7 cursor-pointer px-1 w-[95px] md:w-[150px] text-[9px] sm:text-base flex md:gap-2 border border-[#272A31] rounded items-center"
            onClick={() => setShowReview(!showReview)}>
            <svg
              width="24"
              height="21"
              viewBox="0 0 24 21"
              className=" h-3.5 md:h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 8.79125L9.9125 7.52125C9.7325 7.40792 9.55167 7.41708 9.37 7.54875C9.18917 7.68125 9.12167 7.85875 9.1675 8.08125L9.72125 10.44L7.88375 12.0188C7.70875 12.1746 7.65458 12.3546 7.72125 12.5588C7.78792 12.7629 7.93542 12.8754 8.16375 12.8962L10.5837 13.115L11.5337 15.3412C11.6221 15.5437 11.7775 15.645 12 15.645C12.2225 15.645 12.3779 15.5437 12.4663 15.3412L13.4163 13.1163L15.8363 12.8962C16.0638 12.8754 16.2113 12.7629 16.2788 12.5588C16.3463 12.3546 16.2921 12.1746 16.1163 12.0188L14.2787 10.44L14.8313 8.0825C14.8779 7.85917 14.8108 7.68125 14.63 7.54875C14.4492 7.41625 14.2679 7.40708 14.0862 7.52125L12 8.79125ZM19.4037 2.75L21.5337 0.619999C21.8496 0.304167 22.2146 0.231667 22.6288 0.4025C23.0429 0.573334 23.25 0.883751 23.25 1.33375V18.23C23.25 18.8058 23.0571 19.2862 22.6712 19.6712C22.2854 20.0562 21.805 20.2492 21.23 20.25H2.76875C2.19375 20.25 1.71333 20.0571 1.3275 19.6712C0.941666 19.2854 0.749166 18.805 0.75 18.23V4.76875C0.75 4.19375 0.942499 3.71333 1.3275 3.3275C1.7125 2.94167 2.19292 2.74917 2.76875 2.75H19.4037ZM19.9375 4H2.76875C2.57708 4 2.40083 4.08 2.24 4.24C2.07917 4.4 1.99917 4.57625 2 4.76875V18.2313C2 18.4229 2.08 18.5992 2.24 18.76C2.4 18.9208 2.57625 19.0008 2.76875 19H21.2313C21.4229 19 21.5992 18.92 21.76 18.76C21.9208 18.6 22.0008 18.4238 22 18.2313V1.94375L19.9375 4Z"
                fill="#969696"
              />
            </svg>
            Drop a Review
          </button>

          <div className="flex gap-2 md:gap-3 justify-center items-center">
            <button
              onClick={() => setIsStreamVisible(!isStreamVisible)}
              className={`rounded-md cursor-pointer px-2 h-9 md:h-10 border border-gray-900 ${
                isStreamVisible ? "bg-transparent" : "bg-red-400"
              }`}>
              <Video className="text-white md:h-7 " />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowPicker((prev) => !prev)}
                className="rounded-md cursor-pointer px-2.5 h-9 md:h-10 m-0 flex items-center border border-gray-700 ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5ZM8 1.86328C4.61098 1.86328 1.86328 4.61098 1.86328 8C1.86328 11.389 4.61098 14.1367 8 14.1367C11.389 14.1367 14.1367 11.389 14.1367 8C14.1367 4.61098 11.389 1.86328 8 1.86328ZM10.1836 8.95215C10.4101 8.65336 10.8364 8.59314 11.1367 8.81836C11.4377 9.04435 11.4983 9.47133 11.2725 9.77246L10.7275 9.36328L11.2725 9.77344L11.2715 9.77441L11.2695 9.77734L11.2646 9.7832L11.25 9.80176C11.2383 9.81659 11.2221 9.83654 11.2021 9.86035C11.1622 9.90799 11.1058 9.97309 11.0332 10.0488C10.8887 10.1996 10.6774 10.398 10.4043 10.5967C9.86025 10.9923 9.04012 11.4092 8 11.4092C6.95987 11.4092 6.13975 10.9924 5.5957 10.5967C5.32263 10.398 5.11133 10.1996 4.9668 10.0488C4.89422 9.97309 4.83784 9.90799 4.79785 9.86035C4.77785 9.83652 4.76175 9.8166 4.75 9.80176L4.73535 9.7832L4.73047 9.77734L4.72852 9.77441L4.72754 9.77344C4.72737 9.77321 4.72701 9.77237 5.27246 9.36328L4.72754 9.77246C4.5017 9.47132 4.5623 9.04435 4.86328 8.81836C5.16358 8.59314 5.58992 8.65336 5.81641 8.95215L5.81934 8.95605C5.82345 8.96125 5.83072 8.97117 5.8418 8.98438C5.86436 9.01125 5.90145 9.05259 5.95117 9.10449C6.0516 9.20929 6.20303 9.35202 6.39844 9.49414C6.79187 9.78022 7.33572 10.0459 8 10.0459C8.66429 10.0459 9.20813 9.78023 9.60156 9.49414C9.79697 9.35202 9.9484 9.20929 10.0488 9.10449C10.0986 9.05259 10.1357 9.01124 10.1582 8.98438C10.1693 8.97115 10.1766 8.96124 10.1807 8.95605L10.1836 8.95215ZM5.96094 5.27246C6.33734 5.27246 6.64331 5.57775 6.64355 5.9541C6.64355 6.33066 6.3375 6.63672 5.96094 6.63672H5.9541C5.57775 6.63647 5.27246 6.33051 5.27246 5.9541C5.27271 5.57791 5.57791 5.27271 5.9541 5.27246H5.96094ZM10.0527 5.27246C10.4289 5.27271 10.7341 5.57791 10.7344 5.9541C10.7344 6.3305 10.4291 6.63647 10.0527 6.63672H10.0459C9.66934 6.63672 9.36328 6.33066 9.36328 5.9541C9.36353 5.57775 9.66949 5.27246 10.0459 5.27246H10.0527Z"
                    fill="#969696"
                  />
                </svg>
              </button>
              <div
                onClick={(e) => e.stopPropagation()}
                ref={pickerRef}
                className="absolute bottom-12 left-0 z-50 shadow-lg">
                {showPicker && (
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      handleSelectEmoji(e.emoji);
                      // setMessage((prev) => prev + e.emoji);
                      setShowPicker(false);
                    }}
                    height={350}
                    width={300}
                  />
                )}
              </div>
            </div>

            <button
              // onClick={handleLeave}
              className="border cursor-pointer border-gray-700 block rounded-md px-2 h-9 md:h-10">
              <svg
                width="24"
                height="23"
                className=" h-[15px] md:h-5  "
                viewBox="0 0 24 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.7666 0.333008C9.39252 0.333008 9.90039 0.840874 9.90039 1.4668C9.90032 2.09266 9.39248 2.59961 8.7666 2.59961H4.2334C3.93282 2.59961 3.64418 2.7191 3.43164 2.93164C3.2191 3.14418 3.09961 3.43282 3.09961 3.7334V19.5996C3.09961 19.9001 3.2192 20.1888 3.43164 20.4014C3.64418 20.6139 3.93282 20.7334 4.2334 20.7334H8.7666C9.39237 20.7334 9.90014 21.2405 9.90039 21.8662C9.90039 22.4921 9.39252 23 8.7666 23H4.2334C3.33166 23 2.46672 22.6415 1.8291 22.0039C1.19158 21.3663 0.833008 20.5013 0.833008 19.5996V3.7334C0.833008 2.83166 1.19148 1.96673 1.8291 1.3291C2.46673 0.691478 3.33166 0.333008 4.2334 0.333008H8.7666ZM15.8984 5.19824C16.3409 4.75588 17.0584 4.75608 17.501 5.19824L23.168 10.8652C23.2333 10.9306 23.2879 11.0026 23.334 11.0781C23.3644 11.128 23.3915 11.1799 23.4141 11.2344C23.4194 11.2473 23.4239 11.2604 23.4287 11.2734C23.4367 11.295 23.4445 11.3167 23.4512 11.3389C23.5054 11.5188 23.5137 11.7092 23.4766 11.8926C23.4417 12.0649 23.3671 12.2221 23.2637 12.3564C23.2341 12.3948 23.2031 12.4326 23.168 12.4678L17.501 18.1348C17.0584 18.5771 16.341 18.5773 15.8984 18.1348C15.456 17.6922 15.4561 16.9748 15.8984 16.5322L19.6309 12.7998H8.7666C8.14083 12.7998 7.63396 12.2927 7.63379 11.667C7.63379 11.0411 8.14072 10.5333 8.7666 10.5332H19.6299L15.8984 6.80176C15.4558 6.35916 15.4558 5.64084 15.8984 5.19824Z"
                  fill="#8F9099"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              const url = `https://www.feroevent.com/find-events/${event?._id}`;
              if (navigator.share) {
                navigator.share({ title: event?.title, url });
              } else {
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
              }
            }}
            className=" w-fit  md:me-7 text-xs sm:text-base md:gap-2 rounded-md px-2 h-9 md:h-10  flex items-center border  ">
            Share <img src="/share.png" className="dark:brightness-0" alt="" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default LiveVideo;

const Wrapper = styled.div`
  @keyframes float-up {
    0% {
      transform: translateY(0) scale(0.8);
      opacity: 0;
    }

    10% {
      opacity: 1;
    }

    100% {
      transform: translateY(-120vh) scale(1.2);
      opacity: 0;
    }
  }

  .float-emoji {
    position: absolute;
    bottom: 20px;
    animation: float-up linear infinite;
    pointer-events: none;
    will-change: transform, opacity;
  }
`;
