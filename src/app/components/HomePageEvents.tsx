/* eslint-disable @next/next/no-img-element */
"use client";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { FaSearch } from "react-icons/fa";

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
  },
  {
    id: "6",
    name: "CONFIG Watch Party, PH Chapter",
    saveIcon: "/icons/save.png",
    locationIcon: "/icons/locate.png",
    location: "Onsite & Virtual",
    date: "5th May, 2025",
    dateIcon: "/icons/cal.png",
    share: "Share",
    shareIcon: "/icons/shar.png",
  },
];
const HomePageEvents = () => {
  const pathName = usePathname();
  const [search, setSearch] = React.useState("");

  const filteredEvents = useMemo(() => {
    const data = events.filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    );
    return data;
  }, [search]);

  return (
    <div className="event-page py-8">
      <div className="container mx-auto px-2 md:px-6">
        {pathName === "/event" && (
          <div className="flex mb-8   items-center grow px-3 py-2 border bg-input rounded-md md:w-[500px] w-full">
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
          <button className="border-2 border-[#9f9e9e] rounded-lg px-4 py-2.5 font-normal text-[#9a9999] text-lg hover:bg-gray-100">
            View all Events
          </button>
        </div>

        {filteredEvents.length ? (
          <div className="events grid md:grid-cols-3 grid-cols-1 gap-6 mt-10">
            {filteredEvents.map((event) => (
              <div
                className="item  rounded-xl border border-border shadow-md "
                key={event.id}>
                <div className="img w-full h-[137px]">
                  <img
                    src="/images/rect.png"
                    alt="event tumb"
                    className="object-cover rounded-xl h-full w-full"
                  />
                </div>
                <div className="content p-2">
                  <div className="flex items-center justify-between gap-4 relative">
                    <p className="text-xl ">{event.name}</p>

                    <img
                      src={event.saveIcon}
                      alt={event.saveIcon}
                      className="absolute right-0 top-1 cursor-pointer"
                    />
                  </div>
                  <p className="flex items-center gap-2 py-2">
                    <img src={event.locationIcon} alt="loc" className="ml-1" />
                    <small>{event.location}</small>
                  </p>
                  <p className="flex items-center gap-2">
                    <img src={event.dateIcon} alt="date" />
                    <small>{event.date}</small>
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-2 ">
                    <small className="text-xs">99+ registered</small>
                    <p className="flex items-center gap-2 cursor-pointer">
                      <small>{event.share}</small>
                      <img src={event.shareIcon} alt="" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl w-full">No event found!</p>
        )}
      </div>
    </div>
  );
};

export default HomePageEvents;
