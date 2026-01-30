"use client";
import { Spinner } from "@/app/components/Spinner";
/* eslint-disable @next/next/no-img-element */
import { IEvent } from "@/app/interfaces/event.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { useEventStore } from "@/app/store/event.store";
import { Button } from "@/components/ui/button";
import axiosApi from "@/lib/axios";
import { formatDate, formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Forward,
  Lock,
  LockOpen,
  MapPin,
  Play,
  Podcast,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast, ToastContent } from "react-toastify";

const SingleEvent: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const { setEvent, event, events, loading, publishEvent } = useEventStore();
  const { auth } = useAuthStore();
  const [loadingE, setLoadingE] = useState(false);
  const [loadingS, setLoadingS] = useState<boolean>(false);
  useEffect(() => {
    async function fetchEvent() {
      setLoadingE(true);
      try {
        const { data } = await axiosApi.get<{ data: { event: IEvent } }>(
          `/events/${id}`,
        );

        setEvent(data.data.event);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingE(false);
      }
    }
    if (!event || event._id !== id) {
      fetchEvent();
    }
  }, [id, event, setEvent]);

  const SaveEvent = async () => {
    try {
      setLoadingS(true);
      const res = await axiosApi.patch("/events/saved/update", { id });

      if (res.status === 200 || res.status === 201) {
        toast.success("Event saved successfully!", { delay: 300 });
      } else {
        throw new Error(res.data?.message || "Unable to save this event.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
    } finally {
      setLoadingS(false);
    }
  };
  const shareEvent = () => {
    const eventShareUrl = `${window.origin}/find-events/${event?._id}?label=${label}`;
    if (navigator.share) {
      navigator
        .share({
          title: event?.title,
          text: `Check out this live event: ${event?.title}`,
          url: eventShareUrl,
        })
        .catch((err) => console.error("Sharing failed:", err));
    } else {
      navigator.clipboard.writeText(`/events/${id}`);
      alert("Event link copied to clipboard!");
    }
  };

  if (loadingE) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />{" "}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => router.push("/events")}
          className="text-foreground font-semibold cursor-pointer">
          <ArrowLeft /> <span>Back</span>
        </Button>
        <p className="font-bold text-2xl text-foreground">Single Event</p>
      </div>
      <div className="event mt-16 rounded-lg border bg-background">
        <div className="img w-full h-[50vh]">
          <img
            src={event?.displayImage || "/images/event-img.jpg"}
            alt={event?.title}
            className="w-full h-full object-cover rounded-se-lg rounded-ss-lg"
          />
        </div>
        <div className="details p-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-2xl">{event?.title}</p>
            <div className="flex items-center gap-4">
              <Button
                disabled={loadingS}
                className="cursor-pointer"
                variant={"ghost"}
                onClick={SaveEvent}>
                <Bookmark />
              </Button>
              <Button
                variant={"ghost"}
                onClick={shareEvent}
                className="cursor-pointer">
                <span className="">Share</span> <Forward className="" />
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 py-2">
              <MapPin size={18} />
              <p>{event?.location.type}</p>
            </div>
            <p className="flex items-center gap-2 m-0">
              <Clock className="w-4 h-4 text-gray-500 dark:text-white" />
              {event?.startTime} - {event?.endTime}
            </p>
            <div className="flex items-center gap-2 pb-2">
              <Calendar size={18} />
              <p>{formatDate(event?.startDate)}</p>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Users size={18} />
              <p>{event?.participants?.length || 0} registered</p>
            </div>
            <p className="text-gray-700 dark:text-white leading-relaxed text-wrap wrap-break-word mb-6 whitespace-pre-wrap">
              {event?.description}
            </p>
            <p className="flex items-center gap-2">
              {event?.requirePassword ? (
                <Lock className="w-4 h-4 text-gray-500 dark:text-white" />
              ) : (
                <LockOpen className="w-4 h-4 text-gray-500 dark:text-white" />
              )}
              {event?.requirePassword ? "Restricted " : "Free Entry"}
            </p>
            {/* <div className="flex items-center gap-2 pb-2">
              <LockOpen size={18} />
              <p>{"Open Event"}</p>
            </div> */}
            {/* <p className="">99+ registered</p> */}
            <p className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500 dark:text-white" />
              Organizer: {auth?.firstName || "Unknown"} {auth?.lastName || ""}
            </p>
          </div>

          <div className="mt-6 ">
            {event?.isPublished === false ? (
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                <Button
                  disabled={loading}
                  onClick={() => publishEvent(event?._id as string)}
                  className="cursor-pointer">
                  {loading ? "Publishing..." : "Publish Event"}
                </Button>
                <Button
                  variant={"outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/events/${event._id}/update-event`)
                  }>
                  Continue Editing event
                </Button>
              </div>
            ) : event?.isPublished === true ? (
              <div>
                {event.isLive ? (
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                    <Link
                      href={`/stream/${id}`}
                      className="bg-primary px-4 py-2 flex items-center  gap-2 w-max text-center cursor-pointer rounded-md">
                      <Play className="text-white" />{" "}
                      <span className="text-white">Continue Stream</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                    <Link
                      href={`/stream/${id}`}
                      className="bg-primary px-4 py-2 flex items-center  gap-2 w-max text-center cursor-pointer rounded-md">
                      <Podcast className="text-white" />{" "}
                      <span className="text-white">Set Up Stream</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : event?.requirePassword === false ? (
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                <button
                  // onClick={accessStream}
                  className="bg-blue-600 text-white w-[214px] h-[47px] rounded-lg font-medium hover:bg-blue-700 transition">
                  Access Event
                </button>
              </div>
            ) : (
              <button
                // onClick={handleOpenFormModal}
                className={`bg-blue-600 text-white w-[214px] h-[47px] rounded-lg font-semibold hover:bg-blue-700 transition `}
                // disabled={regLoading}
              >
                {/* {regLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  "Register"
                )} */}
                Register
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 ">
        <div className="flex justify-between items-center mx-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Related Events
          </h2>
          <Link
            href="/findEvents"
            className="text-blue-600 link text-sm font-medium ">
            View More
          </Link>
        </div>

        {events?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No related events found.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-2">
            {events
              .filter((evn) => evn._id !== id)
              .slice(0, 6)
              .map((ev) => {
                const eventId = ev._id || ev._id;
                return (
                  <div
                    key={eventId}
                    className="flex border border-gray-200 rounded-lg shadow-sm h-[91px] hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/findEvents/${eventId}`)}>
                    <div className="w-28 h-full shrink-0">
                      <img
                        src={
                          ev.displayImage ||
                          "https://placehold.co/112x112/E0E7FF/000000?text=Event"
                        }
                        alt={ev.title}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>

                    <div className="flex-1 px-3 border flex flex-col justify-center">
                      <h3 className="text-base font-semibold leading-tight mb-2 line-clamp-2 text-gray-900 dark:text-white">
                        {ev.title}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600 mr-3">
                          {formatDate(ev.startDate)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm">
                        <Users className="w-4 h-4 mr-1 text-gray-500 dark:text-white" />
                        <span className="text-sm text-gray-500">
                          {ev?.participants?.length || "N/A"} registerd
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {/* <Link href={`/stream/${id}`}>SingleEvent</Link> */}
    </div>
  );
};

export default SingleEvent;
