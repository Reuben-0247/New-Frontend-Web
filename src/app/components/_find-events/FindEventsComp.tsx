"use client";

/* eslint-disable @next/next/no-img-element */
import {
  Calendar,
  Forward,
  Radio,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { IEvent } from "@/app/interfaces/event.interface";
import Link from "next/link";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { FaCalendar } from "react-icons/fa";
import { ICategory } from "@/app/interfaces/category.interface";
import { Button } from "@/components/ui/button";
import EventSlide from "./EventSlide";

const FindEventsComp: React.FC<{ events: IEvent[]; cats: ICategory[] }> = ({
  events,
  cats,
}) => {
  const [showTrending, setShowTrending] = useState(true);
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    const data = events.filter(
      (event) =>
        event?.channelName?.toLowerCase().includes(search.toLowerCase()) ||
        event.location?.address?.toLowerCase().includes(search.toLowerCase()),
    );
    return data;
  }, [search, events]);

  const showLiveEvent = () => {
    setSearch("");

    setShowTrending(false);
  };
  const showTrendingEvent = () => {
    setSearch("");
    setShowTrending(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = cats.find((c) => c._id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-1">
        <div>
          <div className="relative flex w-[80%] my-9 sm:px-2 md:w-[600px]">
            <Search
              className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search events"
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-3 py-2.5 border bg-background text-foreground dark:placeholder-gray-500 placeholder-gray-400 dark:border-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              aria-label="Search events"
            />
            <SlidersHorizontal
              className="w-5 h-5 absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <EventSlide events={events} />

      <div className="flex flex-wrap items-center justify-center md:justify-start ps-3 gap-4 mb-4 mt-6">
        <Button
          onClick={showTrendingEvent}
          className="cursor-pointer"
          variant={showTrending == true ? "default" : "outline"}>
          Trending Events
        </Button>

        <Button
          onClick={showLiveEvent}
          className="cursor-pointer"
          variant={!showTrending === false ? "outline" : "default"}>
          <Radio className="text-red-500" />
          Live Events
        </Button>
      </div>

      <div className="">
        {showTrending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredEvents
              .filter((ev) => ev.featuredEvent == true)
              .map((event) => {
                const eventId = event._id;
                const eventUrl = `${window.origin}/find-events/${eventId}?label=Live`;
                return (
                  <div
                    key={eventId}
                    className="rounded-xl cursor-pointer shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] h-fit w-full border  border-gray-200 dark:border-gray-700">
                    <div className="relative h-48 sm:h-52 lg:h-48 overflow-hidden">
                      <img
                        src={
                          event.displayImage ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />

                      <p className="absolute bottom-0 m-0 left-0 text-sm p-3 h-[25px] w-[95px] flex justify-center items-center rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-none bg-[#000826] text-white dark:text-gray-300">
                        {getCategoryName(event?.categoryId || "")}
                      </p>
                    </div>

                    <div className="p-2 flex flex-col gap-2  h-1/2">
                      <h3
                        className={`text-lg font-semibold link dark:text-white text-foreground mt-2 word-break truncate `}>
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-5 text-sm">
                        <FiCalendar className="w-4 h-4 text-[#434343] dark:text-white" />
                        <span className="truncate text-[#434343] dark:text-white ">
                          {new Date(event.startDate || "").toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-5 text-sm ">
                        <FiMapPin className="w-4 h-4 text-[#434343] dark:text-white" />
                        <span className="truncate link text-[#434343] dark:text-white  ">
                          {event.location?.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-5 text-sm ">
                        <FaCalendar className="w-3 h-4 text-[#434343] dark:text-white" />
                        <p className="w-3 h-4 text-[#434343] m-0 dark:text-white">
                          {" "}
                          {new Date(event.startDate || "").toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-xs m-0 text-gray-400 dark:text-white">
                            {" "}
                            +{event?.totalParticipants?.length} registerd{" "}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (navigator.share) {
                                navigator
                                  .share({
                                    title: event?.title,
                                    text: `Check out this live event: ${event?.title}`,
                                    url: eventUrl,
                                  })
                                  .catch((err) =>
                                    console.error("Sharing failed:", err),
                                  );
                              } else {
                                navigator.clipboard.writeText(eventUrl);
                                alert("Event link copied to clipboard!");
                              }
                            }}
                            className="m-0"
                            title="Share Event"
                            type="button">
                            <p className="text-xs flex items-center gap-2 m-0 text-gray-400">
                              {" "}
                              Share <Forward />
                              {/* <img
                                      src="/share.png"
                                      className="dark:brightness-200"
                                      alt=""
                                    /> */}
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 w-full">
                      <Link
                        href={`/find-events/${eventId}`}
                        className=" w-full p-2 border border-primary flex rounded-lg justify-center">
                        view
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 max-w-7xl">
            {filteredEvents
              .filter((ev) => ev.isLive == true)
              .map((event) => {
                const eventId = event._id;
                const eventUrl = `https://www.feroevent.com/find-events/${eventId}?label=Live`;

                return (
                  <div key={eventId} className="block w-full">
                    {/* <Link href={`/find-events/${eventId}`} className="link"> */}
                    <div className="rounded-xl cursor-pointer shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] h-fit w-full border  border-gray-200 dark:border-gray-700">
                      <div className="relative h-48 sm:h-52 lg:h-48 overflow-hidden">
                        <img
                          src={
                            event.displayImage ||
                            "https://via.placeholder.com/400x300"
                          }
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                          LIVE
                        </div>
                        <p className="absolute bottom-0 m-0 left-0 text-sm p-3 h-[25px] w-[95px] flex justify-center items-center rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-none bg-[#000826] text-white dark:text-gray-300">
                          {getCategoryName(event?.categoryId || "")}
                        </p>
                      </div>

                      <div className="p-2 flex flex-col gap-2  h-1/2">
                        <h3
                          className={`text-lg font-semibold link dark:text-white text-foreground mt-2 word-break truncate `}>
                          {event.title}
                        </h3>

                        <div className="flex items-center gap-5 text-sm">
                          <FiCalendar className="w-4 h-4 text-[#434343] dark:text-white" />
                          <span className="truncate text-[#434343] dark:text-white ">
                            {new Date(event.startDate || "").toLocaleDateString(
                              undefined,
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-5 text-sm ">
                          <FiMapPin className="w-4 h-4 text-[#434343] dark:text-white" />
                          <span className="truncate link text-[#434343] dark:text-white  ">
                            {event.location?.address}
                          </span>
                        </div>

                        <div className="flex items-center gap-5 text-sm ">
                          <FaCalendar className="w-3 h-4 text-[#434343] dark:text-white" />
                          <p className="w-3 h-4 text-[#434343] m-0 dark:text-white">
                            {" "}
                            {new Date(
                              event.startDate || "",
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <p className="text-xs m-0 text-gray-400 dark:text-white">
                              {" "}
                              +{event?.totalParticipants?.length} registerd{" "}
                            </p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (navigator.share) {
                                  navigator
                                    .share({
                                      title: event?.title,
                                      text: `Check out this live event: ${event?.title}`,
                                      url: eventUrl,
                                    })
                                    .catch((err) =>
                                      console.error("Sharing failed:", err),
                                    );
                                } else {
                                  navigator.clipboard.writeText(eventUrl);
                                  alert("Event link copied to clipboard!");
                                }
                              }}
                              className="m-0"
                              title="Share Event"
                              type="button">
                              <p className="text-xs flex items-center gap-2 m-0 text-gray-400">
                                {" "}
                                Share <Forward />
                                {/* <img
                                      src="/share.png"
                                      className="dark:brightness-200"
                                      alt=""
                                    /> */}
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 w-full">
                        <Link
                          href={`/find-events/${eventId}`}
                          className=" w-full p-2 border border-primary flex rounded-lg justify-center">
                          view
                        </Link>
                      </div>
                    </div>
                    {/* </Link> */}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindEventsComp;
