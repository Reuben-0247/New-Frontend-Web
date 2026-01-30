"use client";
import axiosApi from "@/lib/axios";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContent } from "react-toastify";
import ModalComp from "../ModalComp";
import { TOKEN_NAME } from "@/utils/constant";
import Cookies from "js-cookie";
import Link from "next/link";

const LiveNotes: React.FC<{ title: string }> = ({ title }) => {
  const token = Cookies.get(TOKEN_NAME);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<{ content: string; title: string }>({
    title: title,
    content: "",
  });

  const sendNote = async () => {
    try {
      setLoading(true);
      const { data } = await axiosApi.post(`/notes`, {
        input,
      });
      if (data) {
        toast.success("Saved note Successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.response as ToastContent);
    } finally {
      setLoading(false);
    }
  };
  const checkIsLoggedIn = () => {
    if (!token) {
      setShowModal(true);
    }
  };

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
      <div className="bg-[#0C1123] text-white rounded-lg max-w-2xl mx-auto p-6">
        <div className="space-y-4">
          <textarea
            className="w-full p-3 rounded-lg bg-white text-gray-800 border border-gray-700 resize-none"
            style={{ height: "200px" }}
            placeholder="send a secret review about this even..."
            value={input.content}
            onFocus={checkIsLoggedIn}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
          />

          {loading ? (
            <div className="flex justify-center items-center">
              <ThreeDots
                height="40"
                width="40"
                color="#003399"
                visible={true}
              />
            </div>
          ) : (
            <button
              onClick={sendNote}
              className=" bg-blue-800 px-4 py-2  rounded-md  transition">
              <p className="text-white font-semibold m-0">Send</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveNotes;
