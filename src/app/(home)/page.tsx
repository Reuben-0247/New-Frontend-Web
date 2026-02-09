export const dynamic = "force-dynamic";

import HomePageEvents from "../components/_web/HomePageEvents";
import Features from "../components/_web/Features";
import TrustPilotSection from "../components/_web/trustPilot";
import FAQSection from "../components/_web/AskedQuestion";
import ImageView from "../components/_web/ImageView";
import Header from "@/app/components/Header";
import { HomeHero } from "../components/_web/Hero";
import { PlayImg } from "../components/_web/PlayTumb";
import axiosApi from "@/lib/axios";
// import { IEvent } from "../interfaces/event.interface";
// import { ICategory } from "../interfaces/category.interface";

export default async function Home() {
  let events = [];
  let categories = [];

  try {
    const { data } = await axiosApi.get("/events");
    events = data?.data?.events || [];

    const { data: cats } = await axiosApi.get("/categories");
    categories = cats?.data?.categories || [];
  } catch (e) {
    console.error("API failed", e);
  }

  return (
    <div className="">
      <div className="hero relative">
        <div className="-z-5 img-box absolute -top-40 w-full right-0 h-140 bg-[url('/images/Pattern.png')] bg-cover bg-center"></div>
        <Header />
        <HomeHero />
      </div>
      <PlayImg />
      <HomePageEvents events={events} cats={categories} />
      <Features />
      <ImageView />
      <section id="trustPilot">
        <TrustPilotSection />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
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
    </div>
  );
}
