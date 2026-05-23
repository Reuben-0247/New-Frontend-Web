/* eslint-disable @next/next/no-img-element */
import axiosApi from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const EventParticipantComp: React.FC<{ eventId: string }> = ({ eventId }) => {
  const [participants, setParticipants] = useState<
    { id: string; name?: string; imgUrl?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getParticipants = async () => {
      setLoading(true);
      try {
        const { data } = await axiosApi(`/stream/viewers/${eventId}`);
        setParticipants(data?.participants || []);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };
    getParticipants();
  }, [eventId]);

  return (
    <div className="px-4 py-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Participants</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <ThreeDots
            height="50"
            width="50"
            radius="9"
            color="#2563eb"
            ariaLabel="loading"
          />
        </div>
      ) : participants.length > 0 ? (
        <div className="space-y-3">
          {participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm">
              <img
                src={p?.imgUrl ?? "/images/user.png"}
                alt="participant"
                className="h-10 w-10 rounded-full object-cover border"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {p?.name ?? "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">Participant</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <img
            src="/images/dataNotFound.png"
            alt="No participants"
            className="h-40 mb-3"
          />
          <p className="text-gray-500 text-sm">No participants found</p>
        </div>
      )}
    </div>
  );
};

export default EventParticipantComp;
