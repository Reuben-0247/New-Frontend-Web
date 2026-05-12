/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import {
  EllipsisVertical,
  ListFilter,
  Radio,
  Rss,
  Share2,
  Trash2,
  ScanEye,
} from "lucide-react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
// import {
//   // DropdownMenuCheckboxItemProps,
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/app/store/auth.store";
import axiosApi from "@/lib/axios";
import { IEvent } from "@/app/interfaces/event.interface";
import { useEventStore } from "@/app/store/event.store";
// import { toast, ToastContent } from "react-toastify";
// import { AxiosError } from "axios";
// import { formatError } from "@/utils/helper";
import ModalComp from "@/app/components/ModalComp";
import { useCategoryStore } from "@/app/store/category.store";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";

// type Checked = DropdownMenuCheckboxItemProps["checked"];
const labels = ["Published", "Drafts", "Saved", "Registered", "Past"];

const EventsPage = () => {
  const { auth } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { categories } = useCategoryStore();
  const [search, setSearch] = React.useState("");

  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const initialTab = searchParams.get("tab");
  const [openModal, setOpenModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [components, setComponents] = useState<string>(
    initialTab && labels.includes(initialTab) ? initialTab : "Published",
  );

  const { setEvents, events, deleteEvent, loadingDel } = useEventStore();
  const filteredEvents = useMemo(() => {
    return events?.filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesLive = isLive ? event.isLive === true : true;

      return matchesSearch && matchesLive;
    });
  }, [search, events, isLive]);

  // useEffect(() => {
  //   const tab = searchParams.get("tab") || "Published";
  //   if (tab && labels.includes(tab)) {
  //     setComponents(tab);
  //   }
  // }, [searchParams]);

  useEffect(() => {
    const fetchEvents = async (url: string) => {
      if (!auth?._id) return;
      try {
        setLoading(true);

        if (components === "Saved") {
          const { data } = await axiosApi.get<{ data: IEvent[] }>(url);
          if (data.data) {
            setEvents(data.data);
          }
        } else {
          const { data } = await axiosApi.get<{ data: { events: IEvent[] } }>(
            url,
          );
          setEvents(data.data.events);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    switch (components) {
      case "Registered":
        fetchEvents(`/events/register/100/${auth?._id}`);
        break;
      case "Past":
        fetchEvents(`/events/previously-attended/${auth?._id}/10`);
        break;
      case "Published":
        fetchEvents(`/events?userId=${auth?._id}&isPublished=true`);
        break;
      case "Saved":
        fetchEvents(`/events/saved/all/${auth?._id}`);
        break;
      case "Drafts":
        fetchEvents(`/events?userId=${auth?._id}&isPublished=false`);
        break;
      default:
        break;
    }
  }, [components, auth?._id, setEvents]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "Unknown";
  };

  // const handleSaveEvent = async (eventId: string) => {
  //   if (!eventId) {
  //     toast.error("You must be logged in to save an event.");

  //     return;
  //   }

  //   try {
  //     // setLoadingSave(true);
  //     const res = await axiosApi.patch(`/events/saved/update`, { eventId });

  //     if (res.status === 200 || res.status === 201) {
  //       toast.success("Event saved successfully.");
  //     } else {
  //       throw new Error(res.data?.message || "Unable to save this event.");
  //     }
  //   } catch (error) {
  //     const axiosError = error as AxiosError;
  //     const formattedError = formatError(axiosError);
  //     toast.error(formattedError.message as ToastContent);
  //   } finally {
  //     // setLoadingSave(false);
  //   }
  // };

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

      <ModalComp onClose={() => setOpenModal(false)} open={openModal}>
        <div className="absolute inset-0 flex items-center justify-center z-9999 bg-slate-900 bg-opacity-50">
          <div className="bg-[#1B2440] rounded-[5px] w-[400px] h-fit p-4">
            <p className="text-white font-nuni text-[16px] text-center mb-3">
              Are you sure you want to delete this event?
            </p>

            <div className="flex items-center justify-center gap-x-5">
              <Button
                disabled={loadingDel}
                onClick={async () => {
                  await deleteEvent(eventToDelete || "");
                  setOpenModal(false);
                }}
                className="flex items-center justify-center w-fit text-[15px] cursor-pointer text-white rounded-lg bg-[#720013] hover:bg-[#44010d]   transition-colors duration-200">
                {loadingDel ? "Deleting..." : "Continue"}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => setOpenModal(false)}
                className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </ModalComp>
      <div className="flex items-center justify-between mb-8 gap-6 w-full">
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
              <span className="md:block hidden"> Filters </span>
              <ListFilter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background w-40">
            <DropdownMenuLabel>Event Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {labels.map((ev, i) => (
                <DropdownMenuItem
                  className="py-2 hover:border-none! outline-none hover:bg-dash-gray cursor-pointer"
                  onClick={() => {
                    setIsLive(false);
                    setComponents(ev);
                    router.push(`?tab=${ev}`, { scroll: false });
                  }}
                  key={i}>
                  {ev}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex event-scroll  gap-1 md:gap-3 my-6  overflow-x-scroll md:w-[900px] sm:w-[500px] ">
        {labels.map((labelName) => (
          <button
            key={labelName}
            onClick={() => {
              setIsLive(false);
              setComponents(labelName);
              router.push(`?tab=${labelName}`, { scroll: false });
            }}
            className={`text-[10px] md:text-base px-1  md:px-4 w-full md:w-0 cursor-pointer mx-1 md:mx-2 py-2 rounded-lg min-w-1 border md:min-w-45 transition-colors duration-300
                ${components === labelName ? "ring-2 ring-blue-500" : ""}
                dark:bg-transparent text-gray-700 dark:text-white border-gray-200 dark:border-gray-700`}>
            {labelName} Events
          </button>
        ))}
      </div>

      <div className="events">
        {events?.length <= 0 ? (
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
            <hr className="my-6" />
            {components === "Published" && (
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={() => setIsLive((prev) => !prev)}
                  className="cursor-pointer"
                  variant={isLive ? "outline" : "default"}>
                  <Rss />
                </Button>
                <Button
                  onClick={() => setIsLive((prev) => !prev)}
                  className="cursor-pointer"
                  variant={isLive ? "default" : "outline"}>
                  <Radio
                    className={`${isLive ? "text-red-500 " : "text-red-500 "}`}
                  />
                </Button>
              </div>
            )}

            <main className=" pb-16">
              {loading ? (
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-300 h-32">
                  Loading events...
                </div>
              ) : filteredEvents?.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-300 h-32">
                  {`No ${components.toLowerCase()} events found.`}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
                  {filteredEvents?.map((event: IEvent) => {
                    const eventId = event._id || event._id || event.eventId;
                    const shareUrl = `${window.origin}/find-events/${event._id}?label=${components}`;

                    return (
                      <div
                        key={eventId}
                        className="rounded-xl  shadow-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.01] h-fit event-card border bg-background  border-gray-200 dark:border-gray-700">
                        <div className="relative h-48 sm:h-52 lg:h-48 overflow-hidden">
                          <img
                            src={event?.displayImage}
                            alt={event?.title}
                            className="w-full h-full object-cover"
                          />
                          {event.isLive && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                              LIVE
                            </div>
                          )}
                          <p className="absolute bottom-0  m-0 left-0 text-sm p-3 mb-1  h-[25px] w-max flex justify-center items-center  rounded-tl-none rounded-tr-xl  rounded-bl-xl rounded-br-none bg-[#000826] text-white dark:text-gray-300">
                            {getCategoryName(event?.categoryId || "")}
                          </p>
                        </div>
                        <div className="p-2  flex flex-col gap-2  h-1/2">
                          <div className="flex justify-between items-center mt-3">
                            <h3 className="text-[18px] font-semibold  truncate m-0  text-gray-900 dark:text-white leading-tight ">
                              {event.title}
                            </h3>

                            {/* <button
                              onClick={() => deleteEvent(event?._id || "")}
                              disabled={loadingDel}
                              className="right-3  bg-opacity-90 z-999 cursor-pointer hidden delete-btn"
                              title="Delete Event"
                              type="button">
                             
                            </button> */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                  <EllipsisVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-background w-40">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    className="py-2 hover:border-none! outline-none hover:bg-dash-gray cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `/events/${event._id}?label=${components}`,
                                      )
                                    }>
                                    <ScanEye className="mr-2 text-primary" />{" "}
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    className="py-2 hover:border-none! outline-none hover:bg-dash-gray cursor-pointer"
                                    onClick={() => {
                                      setEventToDelete(eventId ?? null);
                                      setOpenModal(true);
                                    }}>
                                    <Trash2
                                      size={16}
                                      className="  text-red-400   hover:text-red-500 "
                                    />{" "}
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-center gap-5 text-sm">
                            <FiCalendar className="w-4 h-4 text-[#434343] dark:text-white " />
                            <span className="truncate text-[#434343] dark:text-white ">
                              {new Date(
                                event.startDate || "",
                              ).toLocaleDateString(undefined, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-5 text-sm ">
                            <FiMapPin className="w-4 h-4 text-[#434343] dark:text-white " />
                            <span className="truncate text-[#434343] dark:text-white ">
                              {event.location?.address || "Online"}
                            </span>
                          </div>

                          {/* <div className="flex items-center gap-5 text-sm ">
                            <FaCalendar className="w-3 h-4 text-[#434343] dark:text-white " />
                            <p className="w-3 h-4 text-[#434343] dark:text-white  m-0">
                              {" "}
                              {new Date(
                                event.startDate as string,
                              ).toLocaleDateString()}
                            </p>
                          </div> */}

                          <div>
                            <div className="flex items-center justify-between mb-2 text-sm">
                              <p className="text-xs text-gray-400 dark:text-white  mb-1">
                                {" "}
                                {event?.totalParticipants?.length}{" "}
                                registerd{" "}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const eventShareUrl = `https://www.feroevent.com/findEvents/${event._id}`;
                                  if (navigator.share) {
                                    navigator
                                      .share({
                                        title: event.title,
                                        text: `Check out this live event: ${event.title}`,
                                        url: eventShareUrl,
                                      })
                                      .catch((err) =>
                                        console.error("Sharing failed:", err),
                                      );
                                  } else {
                                    navigator.clipboard.writeText(shareUrl);
                                    alert("Event link copied to clipboard!");
                                  }
                                }}
                                className="mb-1 cursor-pointer"
                                title="Share Event"
                                type="button">
                                <p className="text-[10px] flex items-center gap-1 m-0 text-gray-400">
                                  {" "}
                                  Share <Share2 size={15} />
                                  {/* <img
                                    src="/share.png"
                                    className="dark:brightness-200"
                                    alt=""
                                  /> */}
                                </p>
                              </button>
                            </div>
                          </div>
                          <div className="w-full">
                            <Link
                              href={`/events/${event._id}?label=${components}`}
                              className="block link cursor-pointer text-center w-full border border-primary py-2 px-4 rounded-lg mb-3">
                              View
                            </Link>

                            {/* <Button></Button> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
