/* eslint-disable @next/next/no-img-element */
import LoginComp from "@/app/components/_auths/LoginComp";
import SocialAuth from "@/app/components/_auths/SocialAuth";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="mt-6  ">
      <div className="flex justify-center mb-6">
        <Link href="/" className="text-primary link font-semibold ">
          <img
            src="/images/logo-f.png"
            alt="Fero Events Logo"
            className="h-[70px] object-cover"
          />
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-center text-foreground mb-1">
        Welcome back to Fero Events
      </h2>
      <p className="text-center text-secondary mb-6">
        Log in to manage your events, stream content, and connect with your
        audience.
      </p>

      <LoginComp />

      <div className="flex items-center mt-7 mb-12">
        <hr className="grow border-2 border-line" />
        <span className="mx-2 text-foreground text-sm">Or</span>
        <hr className="grow border-2 border-line" />
      </div>

      <div className="w-full border rounded flex justify-center items-center py-2">
        <SocialAuth authType="signin" />
      </div>

      <p className="text-center text-sm text-foreground mt-5">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary link font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Page;
