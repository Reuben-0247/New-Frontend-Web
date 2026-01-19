"use client";
/* eslint-disable @next/next/no-img-element */
import { useEventStore } from "@/app/store/event.store";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
const positions = [
  "Top Left",
  "Top Right",
  "Bottom Left",
  "Bottom Right",
  "Center",
];

const StreamSettingsPage: React.FC = () => {
  const [viewerToggle, setViewerToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Top Right");
  const { event } = useEventStore();

  return (
    <div className="w-full  bg-[#000826]   flex ">
      <div className="min-h-screen   w-full  text-white px-2 md:px-16 md:py-10 settings ">
        <div className="text-2xl md:text-3xl font-semibold  flex justify-between">
          {event?.title}
          <p className="text-[#A4A4A4] flex gap-2 items-center text-sm">
            <span className="text-[#F2F2F2]">
              <img src="/play.png" alt="" />
            </span>
            Watch a guide
          </p>
        </div>
        <div className="space-y-8 md:px-14 px-2 mt-28">
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm md:text-base">Display Event Count Down</p>
              <button className="border border-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-700">
                Select date and Time
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm md:text-base">
                  Display number of viewers
                </p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  The number of viewers appear in your livestream player
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={viewerToggle}
                  onChange={() => setViewerToggle(!viewerToggle)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 border-2 p-2 peer-focus:outline-none rounded-full relative transition-all">
                  <div
                    className={`w-3 h-3 bg-white rounded-full absolute top-[3px] left-1 transition-transform duration-300 ${
                      viewerToggle ? "translate-x-4" : ""
                    }`}></div>
                </div>
              </label>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm md:text-base">Custom Embed Logo</p>
                <p className="text-xs text-gray-400">No files chosen</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="border border-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-700">
                  Select Poster
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center flex-wrap gap-2  px-4 py-2 w-full    ">
              {/* label */}
              <p className="text-[15px] font-medium tracking-tight text-[#E3E6F0]">
                Embed Watermark
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9297A3] font-medium">
                    Position
                  </span>
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className=" text-white border border-white px-3 py-1.5 rounded-sm flex items-center gap-2 text-sm ">
                      {selected}
                      <span>
                        <FaChevronUp size={12} /> <FaChevronDown size={12} />
                      </span>
                    </button>

                    {isOpen && (
                      <ul className="absolute z-10 mt-1 w-full p-2 top-0 -translate-y-60 border border-white text-white rounded-sm shadow-md text-sm">
                        {positions.map((position) => (
                          <li
                            key={position}
                            className={` py-2 hover:bg-[#151141] px-3 cursor-pointer`}
                            onClick={() => {
                              setSelected(position);
                              setIsOpen(false);
                            }}>
                            {position}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {/* Button */}
                <button
                  className="
          border
          px-4 py-2
          rounded-md
          text-sm 
          font-medium
          text-[#F5F8FF]
          
        "
                  type="button">
                  Select Watermark
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default StreamSettingsPage;
