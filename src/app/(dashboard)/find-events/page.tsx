import React from "react";
import axiosApi from "@/lib/axios";
import { NextPage } from "next";
import FindEventsComp from "@/app/components/_find-events/FindEventsComp";
import { ICategory } from "@/app/interfaces/category.interface";
import { IEvent } from "@/app/interfaces/event.interface";

const page: NextPage = async () => {
  const { data } = await axiosApi.get<{ data: { events: IEvent[] } }>(
    "/events",
  );
  const { data: cats } = await axiosApi.get<{
    data: { categories: ICategory[] };
  }>("/categories");
  return (
    <div className="">
      <FindEventsComp events={data.data.events} cats={cats.data.categories} />
    </div>
  );
};

export default page;
