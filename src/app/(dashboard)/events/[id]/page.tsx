"use client";
import SingleEvent from "@/app/components/_dashboard/SingleEvent";
import React, { Suspense, use } from "react";

const Page: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const { id } = use(params);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SingleEvent id={id} />
      </Suspense>
    </div>
  );
};

export default Page;
