"use client";
import React, { useEffect, useState } from "react";
import axiosApi from "@/lib/axios";
// import { NextPage } from "next";
import FindEventsComp from "@/app/components/_find-events/FindEventsComp";
import { ICategory } from "@/app/interfaces/category.interface";
import { IEvent } from "@/app/interfaces/event.interface";
import { Spinner } from "@/app/components/Spinner";

const FindEventPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [cats, setCats] = useState<ICategory[]>([]);
  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const { data } = await axiosApi.get<{ data: { events: IEvent[] } }>(
          "/events",
        );
        setEvents(data.data.events);
        const { data: cats } = await axiosApi.get<{
          data: { categories: ICategory[] };
        }>("/categories");
        setCats(cats.data?.categories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    })();
  }, []);
  if (load) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />{" "}
      </div>
    );
  }

  return (
    <div className="">
      <FindEventsComp events={events} cats={cats} />
    </div>
  );
};

export default FindEventPage;
