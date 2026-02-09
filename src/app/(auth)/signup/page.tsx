/* eslint-disable @next/next/no-img-element */
import SignupComp from "@/app/components/_auths/SignupComp";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="shadow-xl p-1 rounded-md">
      <div className="flex justify-center mb-6">
        <Link href="/" className="text-primary link font-semibold ">
          <img
            src="/svgs/Fero_logo_dark.svg"
            alt="Fero Events Logo"
            className="h-[70px] object-cover"
          />
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center mt-4 mb-3 text-gray-900">
        Create your Fero Events account
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Get started with seamless event management and live streaming.
      </p>
      <SignupComp />
    </div>
  );
};

export default page;
