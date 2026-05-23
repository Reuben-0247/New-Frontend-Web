"use client";
/* eslint-disable @next/next/no-img-element */

import { IEvent } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { Grid, List } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const LiveParticipant: React.FC<{ event: IEvent | null }> = ({ event }) => {
  const [view, setView] = useState("grid");
  const [participants, setParticipants] = useState<
    { id: string; name?: string; imgUrl?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  console.log("Event ID:", event?._id);
  useEffect(() => {
    const getParticipants = async () => {
      setLoading(true);
      if (event?._id) {
        try {
          const { data } = await axiosApi(`/stream/viewers/${event._id}`);
          setParticipants(data?.participants || []);
        } catch (error) {
          console.error("Error fetching participants:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getParticipants();
  }, [event?._id]);
  if (loading) {
    <div className="flex justify-center py-10">
      <ThreeDots
        height="50"
        width="50"
        radius="9"
        color="#2563eb"
        ariaLabel="loading"
      />
    </div>;
  }

  if (!participants?.length) {
    return (
      <p className="text-gray-400 text-center h-[40vh]">
        No participants available.
      </p>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-4 text-gray-400">
        <span className="text-sm mr-2">View</span>
        <button
          onClick={() => setView("grid")}
          className={`p-1 cursor-pointer rounded-md ${view === "grid" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
          <Grid className="h-5 w-5" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-1 cursor-pointer rounded-md ml-1 ${view === "list" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
          <List className="h-5 w-5" />
        </button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 px-4 gap-5">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              name={participant.name || ""}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant?.id}
              className="flex items-center bg-gray-700 p-2 rounded-md">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-2 text-white font-bold text-sm">
                {participant.name?.charAt(0).toUpperCase()}
                {/* <img
                  className="rounded-[50%] w-full h-full object-cover"
                  src={participant?.imgUrl || "/images/avater-1.png"}
                  alt="avatar"
                /> */}
              </div>
              <div>
                <p className="text-gray-200">{participant?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveParticipant;

const ParticipantCard: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex  flex-col items-center justify-center">
    <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600 flex items-center justify-center">
      <span className="text-xl sm:text-2xl text-center font-bold text-gray-300">
        {name?.charAt(0).toUpperCase()}
      </span>
    </div>
    <p className="mt-2 text-sm text-center text-gray-300">{name}</p>
  </div>
);
