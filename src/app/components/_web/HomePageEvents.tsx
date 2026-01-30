/* eslint-disable @next/next/no-img-element */
"use client";
import { ICategory } from "@/app/interfaces/category.interface";
import { IEvent } from "@/app/interfaces/event.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { FaSearch } from "react-icons/fa";

const HomePageEvents: React.FC<{ events: IEvent[]; cats: ICategory[] }> = ({
  events,
  cats,
}) => {
  const pathName = usePathname();
  const [search, setSearch] = React.useState("");

  const filteredEvents = useMemo(() => {
    const data = events?.filter(
      (event) =>
        event?.channelName?.toLowerCase()?.includes(search.toLowerCase()) ||
        event?.location?.address?.toLowerCase().includes(search.toLowerCase()),
    );
    return data;
  }, [search, events]);
  const getCategoryName = (categoryId: string) => {
    const category = cats?.find((c) => c?._id === categoryId);
    return category ? category?.name : "Unknown";
  };

  return (
    <div className="event-page py-8">
      <div className="container mx-auto px-2 md:px-6">
        {pathName === "/event" && (
          <div className="flex mb-8   items-center grow px-3 py-2 border  rounded-md md:w-[500px] w-full">
            <FaSearch className="text-primary mr-4 text-sm shrink-0" />
            <input
              type="text"
              placeholder="Search Events"
              className="w-full outline-none text-lg placeholder:text-foreground "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
          <Link
            href={"/find-events"}
            className="border-2 border-primary cursor-pointer rounded-lg px-4 py-2.5 font-normal text-foreground text-lg hover:bg-gray-100">
            View all Events
          </Link>
        </div>

        {filteredEvents?.length ? (
          <div className="events grid md:grid-cols-3 grid-cols-1 gap-6 mt-10">
            {filteredEvents
              ?.filter((ev) => ev?.featuredEvent == true)
              ?.slice(0, 6)
              ?.map((event) => {
                const eventId = event?._id;
                let eventUrl = "";
                if (typeof window !== "undefined") {
                  eventUrl = `${window.origin}/find-events/${eventId}?label=Live`;
                }
                return (
                  <div
                    className="item  rounded-xl border border-border shadow-md "
                    key={eventId}>
                    <div className="img w-full h-[137px] relative">
                      <img
                        src={
                          event.displayImage ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={event.title}
                        className="object-cover rounded-xl h-full w-full"
                      />
                      <p className="absolute bottom-0 m-0 left-0 text-sm p-3 h-[25px] w-[95px] flex justify-center items-center rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-none bg-[#000826] text-white dark:text-gray-300">
                        {getCategoryName(event?.categoryId || "")}
                      </p>
                    </div>
                    <div className="content p-2">
                      <div className="flex items-center justify-between gap-4 relative">
                        <p className="text-xl ">{event?.title}</p>

                        <img
                          src={"/icons/save.png"}
                          title="save event"
                          alt="save icon"
                          className="absolute right-0 top-1 cursor-pointer"
                        />
                      </div>
                      <p className="flex items-center gap-2 py-2">
                        <img
                          src={"/icons/locate.png"}
                          alt="loc"
                          className="ml-1"
                        />
                        <small>{event?.location?.address}</small>
                      </p>
                      <p className="flex items-center gap-2">
                        <img src={"/icons/cal.png"} alt="date" />
                        <small>
                          {new Date(event?.startDate || "").toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </small>
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-2 ">
                        <small className="text-xs">
                          {event?.totalParticipants?.length}+ registered
                        </small>
                        <p className="flex items-center gap-2 cursor-pointer">
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
                              Share <img src={"/icons/shar.png"} alt="" />
                            </p>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-2xl w-full">No event found!</p>
        )}
      </div>
    </div>
  );
};

export default HomePageEvents;
