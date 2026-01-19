"use client";
/* eslint-disable @next/next/no-img-element */
import { IEvent } from "@/app/interfaces/event.interface";
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
import React from "react";
import { toast, ToastContent } from "react-toastify";

const SingleEventComp: React.FC<{
  events: IEvent[];
  event: IEvent;
  label: string;
  user: IUser;
}> = ({ event, events, label, user }) => {
  const router = useRouter();
  //   const [loading, setLoading] = useState(false);

  const SaveEvent = async () => {
    if (!event?._id) return;

    const id = event._id;
    try {
      //   setLoading(true);
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
    const eventShareUrl = `https://www.feroevent.com/findEvents/${event?._id}?label=${label}`;
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

  return <div></div>;
};

export default SingleEventComp;
