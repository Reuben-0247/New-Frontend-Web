import React, { Suspense } from "react";
import EventsPage from "./EventsPage";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EventsPage />
      </Suspense>
    </div>
  );
};

export default Page;
