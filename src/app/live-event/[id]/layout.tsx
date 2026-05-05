"use client";
import { use, useEffect, useState } from "react";
import MainHeader from "@/app/components/_dashboard/shared/DashboardHeader";
import { useAuthStore } from "@/app/store/auth.store";
import { useEventStore } from "@/app/store/event.store";
import { IEvent } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { IUser } from "@/app/interfaces/user.interface";
import { IStreamData } from "@/app/interfaces/castr.interface";
import { Spinner } from "@/app/components/Spinner";
import { useThemeStore } from "@/app/store/theme.store";

const LiveEventLayout: React.FC<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}> = ({ children, params }) => {
  const { id } = use(params);
  const theme = useThemeStore((state) => state.theme);

  const { setAuth } = useAuthStore();
  const { setEvent, event, setStreamData } = useEventStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const { data } = await axiosApi.get<{ event: IEvent }>(`/events/${id}`);

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
        setEvent(data.event);
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
    <div className="flex-1 flex flex-col bg-dash-gray h-screen">
      <MainHeader />
      <main className="overflow-y-scroll h-[92vh]">
        <div className=" my-6  px-2">{children}</div>
      </main>
    </div>
  );
};

export default LiveEventLayout;
