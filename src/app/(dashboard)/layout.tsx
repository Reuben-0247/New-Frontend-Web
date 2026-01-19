/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../components/_dashboard/shared/SideBar";
import MainHeader from "../components/_dashboard/shared/MainHeader";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [showAside, setShowAside] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const { setAuth } = useAuthStore();
  const { setEvents } = useEventStore();
  const { setCategories } = useCategoryStore();
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
    getCategories();

    Promise.all([getMe(), getEvents(), getCategories()]).finally(() =>
      setLoading(false),
    );
  }, [setAuth, setEvents, setCategories]);

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
        <MainHeader toggleAside={toggleAside} />
        <main className="overflow-y-scroll h-[92vh]">
          <div className=" py-6  container mx-auto md:px-6 px-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
