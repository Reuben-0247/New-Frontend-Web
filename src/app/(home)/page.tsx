import HomePageEvents from "../components/HomePageEvents";
import Features from "../components/Features";
import TrustPilotSection from "../components/trustPilot";
import FAQSection from "../components/AskedQuestion";
import ImageView from "../components/ImageView";
import Header from "@/app/components/Header";
import { HomeHero } from "../components/Hero";
import { PlayImg } from "../components/PlayTumb";

export default function Home() {
  return (
    <div className="">
      <div className="hero relative">
        <div className=" -z-5 img-box absolute -top-40 w-full right-0 h-140 bg-[url('/images/Pattern.png')] bg-cover bg-center"></div>
        <Header />
        <HomeHero />
      </div>
      <PlayImg />
      <HomePageEvents />
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
