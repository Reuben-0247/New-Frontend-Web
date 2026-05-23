"use client";
/* eslint-disable @next/next/no-img-element */
import { Spinner } from "@/app/components/Spinner";
import { useEventStore } from "@/app/store/event.store";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useMemo, useState } from "react";
import { IEvent, IRecording } from "@/app/interfaces/event.interface";
import { IUser } from "@/app/interfaces/user.interface";
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
  MapPin,
  Users,
  Lock,
  LockOpen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContent } from "react-toastify";
import EventRegistrationFormModal from "@/app/components/_find-events/EventRegistrationFormModal";
import { useAuthStore } from "@/app/store/auth.store";
// import { set } from "date-fns";

// async function getEvent(id: string): Promise<IEvent> {
//   try {
//     const { data } = await axiosApi.get<{ data: { event: IEvent } }>(
//       `/events/${id}`
//     );
//     return data.data.event;
//   } catch (error) {
//     console.log("Error fetching report:", error);
//     throw error;
//   }
// }

const SingleEventPage: React.FC<{
  params: Promise<{ eventId: string }>;
}> = ({ params }) => {
  const { eventId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth } = useAuthStore();

  const label = searchParams.get("label");
  const date = searchParams.get("date");
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { setEvent, event, events } = useEventStore();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  // const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [loadingEnter, setLoadingEnter] = useState(false);
  const [vodData, setVodData] = useState<IRecording[]>([]);

  useEffect(() => {
    async function fetchEventAndRelated() {
      setLoading(true);
      try {
        const { data } = await axiosApi.get<{ event: IEvent }>(
          `/events/${eventId}`,
        );

        setEvent(data.event);
        if (event?.isLive && event?.userId) {
          const fetchUser = async () => {
            try {
              const { data: user } = await axiosApi.get<{ data: IUser }>(
                `/users/${event.userId}`,
              );
              setUser(user.data);
            } catch (error) {
              console.log("Error fetching user:", error);
            }
          };
          fetchUser();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    const getVodData = async () => {
      if (event?._id) {
        if (date) {
          try {
            const { data } = await axiosApi.get(
              `/stream/event-attendee-recording/${event?._id}/${date}`,
            );

            if (data) {
              setVodData(data || []);
            }
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        } else {
          try {
            const { data } = await axiosApi.get(
              `/stream/event-recording/${event?._id}`,
            );

            if (data) {
              setVodData(data || []);
            }
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        }
      }
    };
    // fetchEventAndRelated();
    // getUser();
    Promise.all([fetchEventAndRelated(), getVodData()]).finally(() =>
      setLoading(false),
    );
    // if (!event || event._id !== eventId) {
    // }
  }, [
    eventId,
    setEvent,
    event?.userId,
    event?.isLive,
    setVodData,
    event?._id,
    date,
  ]);

  const isRouting = date
    ? `/live-event/${eventId}?date=${encodeURIComponent(String(date))}`
    : `/live-event/${eventId}`;

  const enterEvent = async () => {
    if (event?.requirePassword && !user?.registeredEvents?.includes(eventId)) {
      toast.warn("You haven't registered for this event");
      setIsFormModalOpen(true);
      return;
    }
    if (auth?._id === event?.userId) {
      toast.warn("You cannot join your own event");

      // router.push(`/live-event/${eventId}`);
      return;
    }

    const payload = {
      eventId,
      userId: auth?._id,
      password: event?.password,
    };
    if (auth?._id) {
      try {
        setLoadingEnter(true);
        const { data } = await axiosApi.patch(
          "/stream/enter-stream-event",
          payload,
        );
        if (data) {
          toast.success(
            "Access granted! You have joined the event. Redirecting to the event...",
          );
          router.push(isRouting);
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError;
        const formattedError = formatError(axiosError);
        toast.error(formattedError.message as ToastContent);
      } finally {
        setLoadingEnter(false);
      }
    } else {
      router.push(isRouting);
    }
  };

  const SaveEvent = async () => {
    if (!event?._id) return;

    const id = event._id;
    try {
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
    }
  };

  const shareEvent = () => {
    if (!event?._id) return;
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
      navigator.clipboard.writeText(`/events/${event?._id}`);
      alert("Event link copied to clipboard!");
    }
  };

  const canAccesseEvent = useMemo(() => {
    if (event?.isLive || vodData.length > 0) return true;
    return false;
  }, [event?.isLive, vodData.length]);

  // const event = await getEvent(id);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />{" "}
      </div>
    );
  }
  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => router.back()}
            className="text-foreground font-semibold cursor-pointer">
            <ArrowLeft /> <span>Back</span>
          </Button>
          {/* <p className="font-bold text-2xl text-foreground">Single Event</p> */}
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
              {event?.isLive && event?.requirePassword && (
                <p className="flex items-center gap-2">
                  {event?.requirePassword ? (
                    <Lock className="w-4 h-4 text-gray-500 dark:text-white" />
                  ) : (
                    <LockOpen className="w-4 h-4 text-gray-500 dark:text-white" />
                  )}
                  {event?.requirePassword ? "Restricted " : "Free Entry"}
                </p>
              )}
              {/* <div className="flex items-center gap-2 pb-2">
              <LockOpen size={18} />
              <p>{"Open Event"}</p>
            </div> */}
              {/* <p className="">99+ registered</p> */}
              {event?.isLive && (
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500 dark:text-white" />
                  Organizer: {user?.firstName || "Unknown"}{" "}
                  {user?.lastName || ""}
                </p>
              )}
            </div>

            <div className="mt-6 ">
              {canAccesseEvent && (
                <div>
                  {!event?.requirePassword ? (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                      <Button
                        disabled={loadingEnter}
                        variant={"default"}
                        className="w-full sm:w-auto flex justify-center items-center  rounded-lg font-medium"
                        onClick={enterEvent}>
                        {/* <Link
                          href={`/live-event/${event?._id}`}
                          className=" text-white  flex justify-center items-center  rounded-lg font-medium  transition"> */}
                        {event?.isLive ? (
                          <span>
                            {loadingEnter ? "Joining..." : "Join Live Event"}
                          </span>
                        ) : (
                          <span>Access Event</span>
                        )}
                        {/* </Link> */}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsFormModalOpen(true)}
                      className={` cursor-pointer text-white  rounded-lg font-semibold transition `}>
                      Register
                    </Button>
                  )}
                </div>
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
              href="/find-events"
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
                .filter(
                  (evn) => evn.featuredEvent === true && evn._id !== event?._id,
                )
                .slice(0, 6)
                .map((ev) => {
                  const eventId = ev._id || ev._id;
                  return (
                    <div
                      key={eventId}
                      className="flex border border-gray-200 rounded-lg shadow-sm h-[91px] hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                      onClick={() => router.push(`/find-events/${eventId}`)}>
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
                            {ev?.participants?.length || "N/A"} registered
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
      <EventRegistrationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        // setIsConfirmationModalOpen={() => setIsConfirmationModalOpen(false)}
        event={event}
      />
    </div>

    // <div>
    //   {event && user && (
    //     <SingleEventComp
    //       event={event}
    //       events={events}
    //       label={label || ""}
    //       user={user}
    //     />
    //   )}
    // </div>
  );
};

export default SingleEventPage;
