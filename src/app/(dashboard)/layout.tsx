/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../components/_dashboard/shared/SideBar";
import DashboardHeader from "../components/_dashboard/shared/DashboardHeader";
import axiosApi from "@/lib/axios";
import { IUser } from "../interfaces/user.interface";
import { useAuthStore } from "../store/auth.store";
import { useEventStore } from "../store/event.store";
import { IEvent } from "../interfaces/event.interface";
import { Spinner } from "../components/Spinner";
import { useCategoryStore } from "../store/category.store";
import { ICategory } from "../interfaces/category.interface";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/utils/constant";
import { useThemeStore } from "../store/theme.store";
import { useSubscriptionStore } from "../store/subscription.store";
import { IPayment } from "../interfaces/payment.interface";
import { ISubscription } from "../interfaces/subscription.interface";
import { AxiosError } from "axios";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [showAside, setShowAside] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const { setAuth, auth } = useAuthStore();
  const { setEvents, setLiveEvent, liveEvent } = useEventStore();
  const { setCategories } = useCategoryStore();
  const { setSub, setPayments } = useSubscriptionStore();
  const theme = useThemeStore((state) => state.theme);
  const token = Cookies.get(TOKEN_NAME);
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
        // console.log(data.data.events);
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
    // getCategories();

    const getSub = async () => {
      if (!auth?._id) return;
      try {
        const { data } = await axiosApi.get<{
          payments: IPayment[];
          subscription: ISubscription;
          freeSub: ISubscription;
        }>(`/payments/user-payments/${auth?._id}`);
        if (data.subscription) {
          setSub(data.subscription);
        } else {
          setSub(data.freeSub);
        }
        setPayments(data.payments);
      } catch (error) {
        console.error("Error fetching subs", error);
      }
    };

    Promise.all([getMe(), getEvents(), getCategories(), getSub()]).finally(() =>
      setLoading(false),
    );
  }, [
    setAuth,
    setEvents,
    setCategories,
    setSub,
    setPayments,
    setLiveEvent,
    auth?._id,
  ]);

  useEffect(() => {
    if (!auth?.hasLiveEvent) return;
    const getLiveEvent = async () => {
      try {
        const { data } = await axiosApi.get<IEvent>(
          `/events/live-event/${auth?._id}`,
        );
        setLiveEvent(data);
      } catch (error) {
        console.error("Error fetching stream stats:", error);
      }
    };
    getLiveEvent();
  }, [setLiveEvent, auth?._id, auth?.hasLiveEvent]);

  useEffect(() => {
    if (!auth?._id) return;

    const getStreamStats = async () => {
      const castrId = liveEvent?.castrStreamId;
      if (!castrId) return;
      try {
        await axiosApi.get(`/stream/castr/${castrId}/stats/${auth?._id}`);
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status !== 404) {
          console.warn("Stream stats unavailable");
        }
      }
    };

    const isStreamPage = pathname.startsWith(`/stream}`);
    if (!isStreamPage && liveEvent?.castrStreamId) {
      getStreamStats();

      const interval = setInterval(getStreamStats, 5000);

      return () => clearInterval(interval);
    }
  }, [setLiveEvent, pathname, liveEvent, auth?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />{" "}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {token && (
        <SideBar
          showAside={showAside}
          toggleAside={toggleAside}
          collapsAside={toggleCollapse}
          collapse={collapse}
        />
      )}
      <div className="flex-1 flex flex-col bg-dash-gray h-screen">
        <div>{token && <DashboardHeader toggleAside={toggleAside} />}</div>
        <main className="overflow-y-scroll h-[92vh]">
          <div className=" py-6  container mx-auto md:px-6 px-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
