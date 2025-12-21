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
      <div className="w-full h-screen   gap-6">
        <div className="container mx-auto md:px-6 px-2 flex justify-center items-center w-full">
          <section className="md:w-[600px] w-full mt-8 p-2 rounded-lg shadow-lg">
            {children}
          </section>
        </div>
        {/* <div className="hidden bg-background h-screen md:block ">
          <img
            src="/images/auth-img.jpg"
            alt="Image"
            className=" w-full object-cover h-full "
          />
        </div> */}
      </div>
    </GoogleOAuthProvider>
  );
}
