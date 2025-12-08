/* eslint-disable @next/next/no-img-element */

export default function FeroJourney() {
  return (
    <div className=" flex flex-col items-center px-4 py-16  text-gray-800">
      {/* Header Section */}
      <div className="text-center max-w-2xl mb-16">
        <div className="flex justify-center mb-4">
          <div className="">
            <img src="/images/feropoint-icon.png" alt="" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl dark:text-white font-bold mb-2">
          Your Fero Journey Begins Here
        </h1>
        <p className=" dark:text-white text-base sm:text-base">
          Earn points and unlock badges as you host, join, share, and grow your
          events.
        </p>
      </div>

      <h2 className="text-[18px] dark:text-white font-semibold mb-6 text-center">
        How to Earn Points
      </h2>

      <div className="flex flex-col lg:flex-row gap-2   md:max-w-5xl w-full">
        {/* Card 1 */}
        <div className="border rounded-lg p-6 w-full  hover:shadow-md transition">
          <img src="/images/feropoints1.png" className="dark:invert" alt="" />
          <h3 className="font-semibold dark:text-white m-1 text-[16px] ">
            Complete Your Profile
          </h3>

          <p className="dark:text-white   text-sm">
            Earn points by filling out your profile and providing more
            information about yourself.
          </p>
        </div>

        <div className="border rounded-lg p-6 w-full  hover:shadow-md transition">
          <img src="/images/feropoint2.png" className="dark:invert" alt="" />
          <h3 className="font-semibold my-1 dark:text-white text-[16px] ">
            Join and Host Events
          </h3>
          <p className="dark:text-white   text-sm">
            Attend webinars, workshops, and other community events to earn
            points.
          </p>
        </div>

        <div className="border rounded-lg p-6 w-full  hover:shadow-md transition">
          <img src="/images/feropoints3.png" className="dark:invert" alt="" />
          <h3 className="font-semibold my-1 dark:text-white  text-[16px] ">
            Contribute to the Platform
          </h3>
          <p className="dark:text-white   text-sm">
            Contribute to the platform&apos;s documentation, code, or other
            resources to earn points.
          </p>
        </div>
      </div>
    </div>
  );
}
