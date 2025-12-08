/* eslint-disable @next/next/no-img-element */
import React from "react";

const EventParticipantComp = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-10">
        <img
          src="/images/dataNotFound.png"
          alt="No participants"
          className="h-40 mb-3"
        />
        <p className="text-gray-500 text-sm">No participants found</p>
      </div>
    </div>
  );
};

export default EventParticipantComp;
