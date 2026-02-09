import React, { Suspense } from "react";
import SingleEventPage from "./SingleEventPage";

const Page: React.FC<{
  params: Promise<{ eventId: string }>;
}> = ({ params }) => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SingleEventPage params={params} />
      </Suspense>
    </div>
  );
};

export default Page;
