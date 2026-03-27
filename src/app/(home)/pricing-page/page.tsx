// import dynamic from "next/dynamic";
import PricingPage from "@/app/components/PricingPage";
import PricingHero from "@/app/components/_web/PricingHero";
// import { IUser } from "@/app/interfaces/user.interface";
// import { TOKEN_NAME } from "@/utils/constant";
// import { cookies } from "next/headers";

import type { Metadata } from "next";
import Header from "@/app/components/Header";
export const metadata: Metadata = {
  title: "Pricing Plans",
  description:
    "Explore flexible pricing plans on Fero Events for live streaming, event hosting, and video clipping. Choose a plan that fits your needs.",
};

const page = async () => {
  // const cookieStore = cookies();
  // const token = (await cookieStore).get(TOKEN_NAME)?.value;

  // let user: IUser | null = null;

  // try {
  //   if (token) {
  //     const res = await fetch(`${process.env.API_URL}/auth/reload-user`, {
  //       headers: {
  //         Cookie: `${TOKEN_NAME}=${token}`,
  //       },
  //       cache: "no-store",
  //     });

  //     if (res.ok) {
  //       const data = await res.json();
  //       user = data.data.user;
  //     }
  //   }
  // } catch (error) {
  //   console.error("User fetch failed:", error);
  // }
  return (
    <div>
      <div className="hero relative">
        <div className=" -z-5 img-box absolute -top-40 w-full right-0 h-140 bg-[url('/images/Pattern.png')] bg-cover bg-center"></div>
        <Header />
        <PricingHero />

        <div className="container mx-auto md:px-6 px-2 w-full pt-12 flex flex-col font-Nunito    py-12">
          <div className="text-center mb-10 mt-4">
            <h2 className="text-xl text-foreground md:text-2xl font-semibold">
              <span className="text-primary">Choose</span> your Perfect Plan
              with Fero Event
            </h2>
          </div>
          <PricingPage />
        </div>
      </div>
    </div>
  );
};

export default page;
