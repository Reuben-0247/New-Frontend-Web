/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import MainHeader from "@/app/components/_dashboard/shared/MainHeader";
import StreamAside from "@/app/components/_dashboard/shared/StreamAside";
import { Spinner } from "@/app/components/Spinner";
import { IStreamData } from "@/app/interfaces/castr.interface";
import { ICategory } from "@/app/interfaces/category.interface";
import { IDestination } from "@/app/interfaces/destination.interface";
import { IEvent } from "@/app/interfaces/event.interface";
import { IUser } from "@/app/interfaces/user.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { useCategoryStore } from "@/app/store/category.store";
import { useDestinationStore } from "@/app/store/destination.store";
import { useEventStore } from "@/app/store/event.store";
import axiosApi from "@/lib/axios";
import { use, useEffect, useState } from "react";

const StreamLayout: React.FC<{
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}> = ({ children, params }) => {
  const { eventId } = use(params);

  const [loading, setLoading] = useState(false);
  const [showAside, setShowAside] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const { setAuth } = useAuthStore();
  const { setEvents, setEvent, event, setStreamData } = useEventStore();
  const { setCategories } = useCategoryStore();
  const { setDestinations } = useDestinationStore();
  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  const toggleAside = () => {
    setShowAside(!showAside);
    if (collapse) {
      setCollapse(!collapse);
    }
  };

  useEffect(() => {
    setLoading(true);
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

    const getEvents = async () => {
      try {
        const { data } = await axiosApi.get<{ data: { events: IEvent[] } }>(
          "/events",
        );
        setEvents(data.data.events);
      } catch (error) {
        console.log(error);
      }
    };
    const getCategories = async () => {
      try {
        const { data } = await axiosApi.get<{
          data: { categories: ICategory[] };
        }>("/categories");
        setCategories(data.data.categories);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    const getEvent = async () => {
      try {
        const { data } = await axiosApi.get<{ data: { event: IEvent } }>(
          `/events/${eventId}`,
        );

        setEvent(data.data.event);
      } catch (error) {
        console.log(error);
      }
    };
    const getPlatforms = async () => {
      try {
        const { data } = await axiosApi.get<{ data: IDestination[] }>(
          "stream/platform/all",
        );
        setDestinations(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    Promise.all([
      getMe(),
      getEvents(),
      getCategories(),
      getEvent(),
      getPlatforms(),
    ]).finally(() => setLoading(false));
  }, [setAuth, setEvents, setCategories, setEvent, eventId, setDestinations]);

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
    <div className="flex h-screen">
      <StreamAside
        param={eventId}
        showAside={showAside}
        toggleAside={toggleAside}
        collapsAside={toggleCollapse}
        collapse={collapse}
      />
      <div className="flex-1 flex flex-col bg-dash-gray h-screen">
        <MainHeader toggleAside={toggleAside} />
        <main className="overflow-y-scroll h-[92vh]">
          <div className=" py-6  container mx-auto md:px-6 px-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StreamLayout;
