/* eslint-disable @next/next/no-img-element */
import React from "react";
import Header from "@/app/components/Header";
import HomePageEvents from "@/app/components/_web/HomePageEvents";
import axiosApi from "@/lib/axios";
import { IEvent } from "@/app/interfaces/event.interface";
import { ICategory } from "@/app/interfaces/category.interface";

const page = async () => {
  const { data } = await axiosApi.get<{ data: { events: IEvent[] } }>(
    "/events",
  );
  const events = data?.data?.events;

  const { data: cats } = await axiosApi.get<{
    data: { categories: ICategory[] };
  }>("/categories");
  return (
    <div>
      <div className="hero relative">
        <div className=" -z-5 img-box absolute -top-40 w-full right-0 h-140 bg-[url('/images/Pattern.png')] bg-cover bg-center"></div>
        <Header />
        <div className="w-full h-[50vh] px-2 md:h-[75vh] flex flex-col items-center justify-center text-center">
          <div>
            <img
              src="/images/heroSection.png"
              className=" h-5 md:h-7 mb-4"
              alt=""
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-[74px] md:leading-18 mx-3 font-bold">
              <span className="text-primary">Find</span> and Join a great <br />
              deal of <span className="text-primary">event</span>
            </h1>
          </div>
          <div>
            <p className="mt-4 text-[24px] max-w-xl mx-auto text-foreground">
              Explore live, upcoming, and past events hosted by creators and
              communities worldwide
            </p>
          </div>
        </div>
        <HomePageEvents events={events} cats={cats?.data?.categories} />
        <section className="bg-[#191919] font-Nunito text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg mx-auto max-w-7xl my-20 text-center">
          <h2 className="text-2xl md:text-3xl font-Nunito font-bold mb-6">
            Ready to host your next big event?
          </h2>
          <p className="text-base sm:text-lg max-w-3xl font-Nunito mx-auto my-10 text-[#B7B7B7]">
            Built with modern event hosts in mind, Fero Events gives you all the
            tools you need to create, manage, and stream unforgettable events –
            without the tech stress or multiple platforms.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 h-fit">
            <button className="bg-blue-600 hover:bg-blue-700 font-Nunito text-white font-semibold py-3 px-8 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Get Started
            </button>
            <button className="bg-transparent border-2 font-Nunito border-gray-600 hover:border-gray-500 text-gray-300 font-semibold py-3 px-8 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Request a Demo
            </button>
          </div>
        </section>

        <section className=" md:flex justify-between border p-4 md:p-[68px]  border-line rounded-lg mx-auto max-w-7xl my-20">
          <div>
            <h1 className=" md:text-3xl font-semibold text-foreground mb-4">
              Need a Custom Plan?
            </h1>

            <p className="my-6 sm:my-10 max-w-[600px] text-foreground md:text-lg leading-relaxed">
              Looking for something tailored to your event workflow or audience
              size? We’ve got you covered. We’ll customize your plan to meet
              your unique needs and give you all the time you need to explore
              Fero Events at its full potential.
            </p>

            <div className="flex flex-col sm:flex-row  gap-3 h-fit">
              <a
                href="https://wa.me/07045071045"
                target="_blank"
                className="bg-green-500 hover:bg-green-700 link flex justify-center items-center  gap-2 text-white font-semibold h-16  md:px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                <span>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.3431 3.61456C17.388 2.65008 16.2504 1.88536 14.9968 1.36494C13.7431 0.844515 12.3984 0.578811 11.041 0.583308C5.35352 0.583308 0.718099 5.21872 0.718099 10.9062C0.718099 12.7291 1.19727 14.5 2.0931 16.0625L0.634766 21.4166L6.10352 19.9791C7.61393 20.8021 9.31185 21.2396 11.041 21.2396C16.7285 21.2396 21.3639 16.6041 21.3639 10.9166C21.3639 8.15622 20.291 5.56247 18.3431 3.61456ZM11.041 19.4896C9.49935 19.4896 7.98893 19.0729 6.66602 18.2916L6.35352 18.1041L3.10352 18.9583L3.9681 15.7916L3.75977 15.4687C2.90304 14.1011 2.44823 12.5201 2.44727 10.9062C2.44727 6.17706 6.30143 2.32289 11.0306 2.32289C13.3223 2.32289 15.4785 3.21872 17.0931 4.84372C17.8927 5.63942 18.5263 6.58596 18.9573 7.62844C19.3882 8.67093 19.6079 9.7886 19.6035 10.9166C19.6243 15.6458 15.7702 19.4896 11.041 19.4896ZM15.7493 13.0729C15.4889 12.9479 14.2181 12.3229 13.9889 12.2291C13.7493 12.1458 13.5827 12.1041 13.4056 12.3541C13.2285 12.6146 12.7389 13.1979 12.5931 13.3646C12.4473 13.5416 12.291 13.5625 12.0306 13.4271C11.7702 13.3021 10.9368 13.0208 9.95768 12.1458C9.18685 11.4583 8.67643 10.6146 8.52018 10.3541C8.37435 10.0937 8.49935 9.95831 8.63476 9.82289C8.74935 9.70831 8.89518 9.52081 9.02018 9.37497C9.14518 9.22914 9.19727 9.11456 9.2806 8.94789C9.36393 8.77081 9.32226 8.62498 9.25976 8.49997C9.19726 8.37497 8.67643 7.10414 8.4681 6.58331C8.25976 6.08331 8.04102 6.14581 7.88477 6.13539H7.38476C7.20768 6.13539 6.93685 6.19789 6.69727 6.45831C6.4681 6.71872 5.80143 7.34372 5.80143 8.61456C5.80143 9.88539 6.72852 11.1146 6.85352 11.2812C6.97852 11.4583 8.67643 14.0625 11.2598 15.1771C11.8743 15.4479 12.3535 15.6041 12.7285 15.7187C13.3431 15.9166 13.9056 15.8854 14.3535 15.8229C14.8535 15.75 15.8848 15.1979 16.0931 14.5937C16.3118 13.9896 16.3118 13.4791 16.2389 13.3646C16.166 13.25 16.0098 13.1979 15.7493 13.0729Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <p className="m-0 text-[20px] font-normal link">
                  Reach out to Support
                </p>
              </a>
            </div>
          </div>

          <div>
            <img src="/images/Galaxy.png" alt="" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
