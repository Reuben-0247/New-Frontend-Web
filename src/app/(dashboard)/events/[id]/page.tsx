/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Forward,
  LockOpen,
  MapPin,
  Podcast,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { use } from "react";

const SingleEvent: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const { id } = use(params);
  return (
    <div>
      <div className="flex items-center justify-between">
        <Button
          size={"sm"}
          variant={"outline"}
          className="text-foreground font-semibold cursor-pointer">
          <ArrowLeft /> <span>Back</span>
        </Button>
        <p className="font-bold text-2xl text-foreground">Single Event</p>
      </div>
      <div className="event mt-16 rounded-lg border bg-background">
        <div className="img w-full h-[50vh]">
          <img
            src="/images/event-img.jpg"
            alt=""
            className="w-full h-full object-cover rounded-se-lg rounded-ss-lg"
          />
        </div>
        <div className="details p-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-2xl">Title</p>
            <div className="flex items-center gap-4">
              <Bookmark />
              <Button variant={"ghost"} className="cursor-pointer">
                <span className="">Share</span>{" "}
                {/* <img
                  src="/icons/shar.png"
                  alt="share"
                  height="100"
                  className="dark:brightness-200 brightness-50"
                  width={18}
                /> */}
                <Forward className="" />
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 py-2">
              <MapPin size={18} />
              <p>{"event.location"}</p>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Calendar size={18} />
              <p>{"event.date"}</p>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Users size={18} />
              <p>{"2 Registered"}</p>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <LockOpen size={18} />
              <p>{"Open Event"}</p>
            </div>
            <p className="">99+ registered</p>
          </div>
          <div className="mt-6 ">
            <Link
              href={`/stream/${id}`}
              className="bg-primary px-4 py-2 flex items-center  gap-2 w-max text-center cursor-pointer rounded-md">
              <Podcast className="text-white" />{" "}
              <span className="text-white">Set Up Stream</span>
            </Link>
          </div>
        </div>
      </div>
      {/* <Link href={`/stream/${id}`}>SingleEvent</Link> */}
    </div>
  );
};

export default SingleEvent;
