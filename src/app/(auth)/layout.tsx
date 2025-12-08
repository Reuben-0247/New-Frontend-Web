/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="w-full bg-background grid h-screen  gap-6  md:grid-cols-2 grid-cols-1 bg">
        <div className="container mx-auto md:px-6 px-2">
          <section>{children}</section>
        </div>
        <div className="hidden bg-background h-screen md:block ">
          <img
            src="/images/auth-img.jpg"
            alt="Image"
            className=" w-full object-cover h-full "
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
