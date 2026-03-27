/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import MainHeader from "@/app/components/_dashboard/shared/DashboardHeader";
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
import { useThemeStore } from "@/app/store/theme.store";
import axiosApi from "@/lib/axios";
import { AxiosError } from "axios";
import { use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const StreamLayout: React.FC<{
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}> = ({ children, params }) => {
  const { eventId } = use(params);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [showAside, setShowAside] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const { setAuth, auth } = useAuthStore();
  const { setEvents, setEvent, event, setStreamData } = useEventStore();
  const { setCategories } = useCategoryStore();
  const theme = useThemeStore((state) => state.theme);
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
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
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
    if (!event?.isLive) return;
    const getStream = async () => {
      try {
        const { data } = await axiosApi.get<IStreamData>(
          `/stream/castr-details/${event?._id}`,
        );
        if (event?.isLive) {
          setStreamData(data);
        }
      } catch (error) {
        console.error("Error fetching stream stats:", error);
      }
    };
    const getStreamStats = async () => {
      const castrId = event?.castrStreamId;
      if (!castrId) {
        return;
      }
      try {
        await axiosApi.get(`/stream/castr/${castrId}/stats/${auth?._id}`);
        // console.log(data.response);

        //  setStats(response?.data?.response);
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status !== 404) {
          console.warn("Stream stats unavailable");
        }
      }
    };
    if (event?._id) {
      getStream();
    }

    getStreamStats();
    const isStreamPage = pathname.startsWith(`/stream/${event?._id}`);
    if (!isStreamPage && event?.castrStreamId) {
      getStreamStats();

      const interval = setInterval(getStreamStats, 5000);

      return () => clearInterval(interval);
    }
  }, [
    event?.isLive,
    event?._id,
    setStreamData,
    auth?._id,
    event?.castrStreamId,
    pathname,
  ]);
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
