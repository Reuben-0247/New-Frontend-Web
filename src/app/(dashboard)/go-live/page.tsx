import Link from "next/link";
import React from "react";

const GolivePage = () => {
  return (
    <div className="h-[80vh] bg-background flex items-center justify-center  px-7">
      <div className=" border-2 rounded-xl  w-full md:w-[90%] p-6 sm:p-10 flex flex-col gap-7 items-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground  text-center mb-3">
          Set Up Your Live Event
        </h2>
        <p className="text-foreground  text-center mb-6 max-w-xl text-base sm:text-lg">
          Go to events page and select an event that you want to stream live...
        </p>
        <Link
          href={"/events"}
          className="bg-primary text-center hover:bg-blue-700 text-foreground w-[180px] h-[47px]  font-medium text-xl rounded-md px-6 py-2 transition-colors duration-150 ">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default GolivePage;
