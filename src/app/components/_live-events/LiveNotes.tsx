"use client";
import axiosApi from "@/lib/axios";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import React, { useState } from "react";
// import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContent } from "react-toastify";
import ModalComp from "../ModalComp";
// import { TOKEN_NAME } from "@/utils/constant";
// import Cookies from "js-cookie";
import Link from "next/link";
import { IEvent } from "@/app/interfaces/event.interface";

const LiveNotes: React.FC<{ event: IEvent | null }> = ({ event }) => {
  // const token = Cookies.get(TOKEN_NAME);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState("");

  const [loading, setLoading] = useState(false);
  // const [input, setInput] = useState<{ comment: string; rating: number }>({
  //   comment: "",
  //   rating: 0,
  // });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const sendReview = async () => {
    if (rating === 0 || comment.trim() === "") {
      setMsg("Please select a rating and drop your thought.");
      return;
    }
    setMsg("");

    try {
      setLoading(true);
      const payload = {
        title: event?.title,
        comment: comment,
        rating: rating,
      };
      const { data } = await axiosApi.post(
        `/events/${event?._id}/reviews`,
        payload,
      );
      if (data.status === "success") {
        setMsg("Review sent successfully");
        toast.success("Review sent successfull");

        setComment("");
        setRating(0);
      } else {
        setMsg("Failed to send review");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.response as ToastContent);
    } finally {
      setLoading(false);
    }
  };

  // const checkIsLoggedIn = () => {
  //   if (!token) {
  //     setShowModal(true);
  //   }
  // };

  return (
    <div>
      <ModalComp
        header="Login"
        onClose={() => setShowModal(false)}
        open={showModal}>
        <div>
          <p className="mb-4">😥 Oops account not logged in</p>
          <p>
            Please{" "}
            <Link className="text-primary font-bold underline" href="/login">
              Login
            </Link>{" "}
            to add your review.
          </p>
        </div>
      </ModalComp>
      <div className="dark:bg-[#0C1123]  bg-white text-foreground rounded-lg max-w-2xl mx-auto ">
        <div className=" text-foreground shadow-xl p-2">
          <h2 className="text-lg font-bold mb-1">Rate this Event</h2>
          <p className="text-sm text-gray-400 mb-3">
            Your honest review is anonymously shared only with the event host.
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
            className="w-full min-h-[60px] dark:bg-[#1D2331] bg-white p-3 border  rounded-md text-sm text-white placeholder-gray-400"
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
      </div>
    </div>
  );
};

export default LiveNotes;
