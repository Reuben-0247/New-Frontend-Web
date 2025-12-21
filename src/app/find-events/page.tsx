import React from "react";
import MainHeader from "../components/_dashboard/shared/MainHeader";
import FindEventsComp from "../components/_find-events/FindEventsComp";
// import axiosApi from "@/lib/axios";
// import { IEvent } from "../interfaces/event.interface";

const page = async () => {
  // const { data: events } = await axiosApi.get<IEvent[]>(
  //   "/events?featuredEvent=true"
  // );
  return (
    <div>
      <MainHeader />
      <main className="overflow-y-scroll h-[92vh]">
        <div className=" py-6  container mx-auto md:px-4 px-2">
          <FindEventsComp />
        </div>
      </main>
    </div>
  );
};

export default page;
