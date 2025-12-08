/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { ListFilter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type Checked = DropdownMenuCheckboxItemProps["checked"];
const events = [
  {
    id: "1",
    name: "CONFIG Watch Party, PH Chapter",
    saveIcon: "/icons/save.png",
    locationIcon: "/icons/locate.png",
    location: "Onsite & Virtual",
    date: "5th May, 2025",
    dateIcon: "/icons/cal.png",
    share: "Share",
    shareIcon: "/icons/shar.png",
    category: "Music",
    live: true,
  },
  {
    id: "2",
    name: "CONFIG Watch Party, PH Chapter",
    saveIcon: "/icons/save.png",
    locationIcon: "/icons/locate.png",
    location: "Onsite & Virtual",
    date: "5th May, 2025",
    dateIcon: "/icons/cal.png",
    share: "Share",
    shareIcon: "/icons/shar.png",
    category: "Health",
  },
  {
    id: "3",
    name: "CONFIG Watch Party, PH Chapter",
    saveIcon: "/icons/save.png",
    locationIcon: "/icons/locate.png",
    location: "Onsite & Virtual",
    date: "5th May, 2025",
    dateIcon: "/icons/cal.png",
    share: "Share",
    shareIcon: "/icons/shar.png",
    category: "Food",
    live: true,
  },
  {
    id: "4",
    name: "CONFIG Watch Party, PH Chapter",
    saveIcon: "/icons/save.png",
    locationIcon: "/icons/locate.png",
    location: "Onsite & Virtual",
    date: "5th May, 2025",
    dateIcon: "/icons/cal.png",
    share: "Share",
    shareIcon: "/icons/shar.png",
    category: "Art",
    live: false,
  },
  {
    id: "5",
    name: "CONFIG Watch Party, PH Chapter",
    saveIcon: "/icons/save.png",
    locationIcon: "/icons/locate.png",
    location: "Onsite & Virtual",
    date: "5th May, 2025",
    dateIcon: "/icons/cal.png",
    share: "Share",
    shareIcon: "/icons/shar.png",
    category: "Carear",
    live: false,
  },
];

const EventPage = () => {
  const pathName = usePathname();
  const [search, setSearch] = React.useState("");
  const [showActivie, setShowActive] = React.useState<Checked>(false);

  const filteredEvents = useMemo(() => {
    const data = events.filter(
      (event) =>
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase()) ||
        event.date.toLowerCase().includes(search.toLowerCase())
    );
    return data;
  }, [search]);

  const eventTypes = [
    "Published Events",
    "Saved Events",
    "Registered Events",
    "Past Events",
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-b border-line pb-8">
        <div className="md:col-span-2">
          <p className="text-xl font-semibold leading-6 text-foreground">
            Events
          </p>
          <p className="mt-1 truncate text-sm leading-5 text-foreground">
            Add and manage events across different locations.
          </p>
        </div>

        <div>
          <div className="flex justify-between md:justify-end gap-4">
            <Link
              href={"/events/create-event"}
              className="flex items-center gap-2 rounded-md px-4 py-2 bg-primary cursor-pointer text-white">
              <IoAdd className="h-5 w-5 mr-2 text-white" /> Create Event
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-8 w-full">
        <div className="flex   items-center px-3 py-2 border bg-white dark:bg-input rounded-md md:w-[500px] w-full">
          <FaSearch className="text-primary mr-4 text-sm shrink-0" />
          <input
            type="text"
            placeholder="Search Events"
            className="w-full md:w-[500px] outline-none text-lg placeholder:text-foreground "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filters <ListFilter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background w-40">
            <DropdownMenuLabel>Event Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {eventTypes.map((ev, i) => (
                <DropdownMenuItem
                  className="py-2 hover:border-none! outline-none hover:bg-dash-gray cursor-pointer"
                  key={i}>
                  {ev}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="events">
        {events.length <= 0 ? (
          <div className="border border-blue-300 rounded-lg p-6 md:p-10 text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2 dark:text-white">
              You haven't{" "}
              <span className="font-bold">
                created or joined any events yet
              </span>
            </h2>
            <p className="text-gray-600 dark:text-white text-sm md:text-base mb-6">
              Your events will appear here once you create them. You can host or
              join webinars, livestreams, workshops, and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href={"/events/create-event"}
                className="bg-blue-600 text-white font-medium px-4 py-2.5 rounded-md hover:bg-blue-700 transition">
                + Create Event
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {filteredEvents.length ? (
              <div className="events grid md:grid-cols-3 grid-cols-1 gap-4 mt-10">
                {filteredEvents.map((event) => (
                  <Link
                    href={`/events/${event.id}`}
                    className="item z-9 rounded-xl border border-border shadow-md "
                    key={event.id}>
                    <div
                      className={`img flex flex-col justify-between p-1 bg-[url('/images/rect.png')]  bg-cover bg-center w-full h-[137px]`}>
                      <p className="">
                        {event.live == true && (
                          <span className="bg-red-500 text-white py-1 px-2 rounded-lg w-max">
                            Live
                          </span>
                        )}
                      </p>
                      <p className="bg-[#000826] text-white px-4 py-1 rounded-bl-[20px] rounded-tr-[20px]  w-max">
                        {event.category}
                      </p>
                    </div>
                    <div className="content flex justify-between  p-2">
                      <div>
                        <div className="flex items-center justify-between gap-4 ">
                          <p className="font-bold ">{event.name}</p>
                        </div>
                        <p className="flex items-center gap-2 py-2">
                          <img
                            src={event.locationIcon}
                            alt="loc"
                            className="ml-1"
                          />
                          <small>{event.location}</small>
                        </p>
                        <p className="flex items-center gap-2">
                          <img src={event.dateIcon} alt="date" />
                          <small>{event.date}</small>
                        </p>
                        <small className="text-xs">99+ registered</small>
                      </div>
                      <div className="flex flex-col  justify-between items-end gap-2 mt-2 ">
                        <img
                          src={event.saveIcon}
                          alt={event.saveIcon}
                          className=" cursor-pointer"
                        />
                        <p className="flex  z-10 items-center gap-2 cursor-pointer">
                          <small>{event.share}</small>
                          <img src={event.shareIcon} alt="" />
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-2xl w-full">No event found!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
