"use client";
import MainHeader from "@/app/components/_dashboard/shared/MainHeader";
import LiveBoard from "@/app/components/_live-events/LiveBoard";
import LiveComment from "@/app/components/_live-events/LiveComment";
import LiveNotes from "@/app/components/_live-events/LiveNotes";
import LiveParticipant from "@/app/components/_live-events/LiveParticipant";
import LiveVideo from "@/app/components/_live-events/LiveVideo";
import { Spinner } from "@/app/components/Spinner";
import { IStreamData } from "@/app/interfaces/castr.interface";
import { IEvent } from "@/app/interfaces/event.interface";
import { IUser } from "@/app/interfaces/user.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { useEventStore } from "@/app/store/event.store";
import { Button } from "@/components/ui/button";
import axiosApi from "@/lib/axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import styled from "styled-components";
const tabs: { name: string }[] = [
  {
    name: "Board",
  },
  {
    name: "Participants",
  },
  {
    name: "Chats",
  },
  {
    name: "Reviews",
  },
];

const LivePage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const { id } = use(params);
  const { setEvent, event, setStreamData, streamData } = useEventStore();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<string>("Board");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const { data } = await axiosApi.get<{ data: { event: IEvent } }>(
          `/events/${id}`,
        );

        //  if (data.data.event) {
        //    const { data: user } = await axiosApi.get<{ data: { user: IUser } }>(
        //      `/users/${data.data.event?.userId}`
        //    );
        //    setUser(user.data.user);
        //  }
        const getMe = async () => {
          try {
            const { data } = await axiosApi.get<{ data: { user: IUser } }>(
              "/auth/reload-user",
            );
            setAuth(data.data.user);
          } catch (error) {
            console.log(error);
          }
        };
        getMe();
        setEvent(data.data.event);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, setEvent, event?.userId, setAuth]);

  useEffect(() => {
    if (!event?._id) return;
    const getStream = async () => {
      try {
        const { data } = await axiosApi.get<IStreamData>(
          `/stream/castr-details/${event?._id}`,
        );
        setStreamData(data);
      } catch (error) {
        console.error("Error fetching stream stats:", error);
      }
    };
    if (event?._id) {
      getStream();
    }
  }, [event?._id, setStreamData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />{" "}
      </div>
    );
  }
  return (
    <Wrapper>
      <MainHeader />
      <div className="py-6   mx-auto  px-8">
        <div className="flex  justify-between">
          <div>
            <Button
              onClick={() => router.back()}
              size={"sm"}
              variant={"outline"}
              className="text-foreground font-semibold cursor-pointer">
              <ArrowLeft /> <span>Back</span>
            </Button>
            {/* <p className="mt-4 text-2xl font-bold text-foreground">Title</p> */}
          </div>
          <p className="font-bold text-2xl text-foreground">{event?.title}</p>
        </div>
        <div className="md:flex w-full gap-4 mt-6">
          <div className="md:w-[70%] w-full h-auto md:h-[50vh] bg-black overflow-hidden">
            <LiveVideo streamData={streamData} event={event} />
          </div>
          <div className=" md:w-[30%] w-full mt-8 md:mt-0 bg-[#151E37] rounded-lg border-gray-700  md:p-2 h-full shrink-0 ">
            <div className="tabs flex justify-between bg-[#000826] md:gap-2  md:p-2  w-full  overflow-x-auto ">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActive(tab.name)}
                  className={`px-[11px] cursor-pointer py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
               ${
                 active === tab.name
                   ? "bg-[#151E37] text-white"
                   : "text-gray-300 hover:bg-gray-700"
               }`}>
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="views  p-4">
              {active === "Board" ? (
                <LiveBoard event={event} />
              ) : active === "Participants" ? (
                <LiveParticipant eventId={event?._id || ""} />
              ) : active === "Chats" ? (
                <LiveComment eventId={event?._id || ""} />
              ) : (
                active === "Reviews" && <LiveNotes title={event?.title || ""} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default LivePage;

const Wrapper = styled.div``;
