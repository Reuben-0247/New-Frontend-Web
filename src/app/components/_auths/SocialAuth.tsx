/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
// import { googleLogout } from "@react-oauth/google";
import { ThreeDots } from "react-loader-spinner";

const SocialAuth: React.FC<{ authType: string }> = ({ authType }) => {
  const [loading, setLoading] = useState(false);

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/login`
      : `https://feroevent.com/login`;

  const handleAuth = () => {
    setLoading(true);
    window.location.href = `${
      process.env.NEXT_PUBLIC_API_URL
    }/sign/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <>
      <div className="auth__container">
        <div className={loading ? "auth__wrapper loadingBtn" : "auth__wrapper"}>
          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <ThreeDots
                height="20"
                width="20"
                radius="9"
                color="blue"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </div>
          ) : (
            <div
              onClick={handleAuth}
              className="cursor-pointer w-full h-full  transition-colors duration-300  flex justify-center items-center    text-black"
              style={{ display: "flex", alignItems: "center", gap: "13px" }}>
              <div>
                <img src="/svgs/google.svg" className="w-7" alt="google logo" />
              </div>
              <div>
                {authType === "signin" ? (
                  <h1 className="text-base font-bold mt-2">
                    Login with Google
                  </h1>
                ) : (
                  <h1 className="text-base font-bold mt-2">
                    Sign Up with Google
                  </h1>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SocialAuth;
