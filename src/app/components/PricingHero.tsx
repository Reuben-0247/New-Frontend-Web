/* eslint-disable @next/next/no-img-element */

const PricingHero = () => {
  return (
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
          <span className="text-primary">Choose</span> your Perfect Plan with
          Fero Event
        </h1>
      </div>
      <div>
        <p className="mt-4 text-[24px] max-w-xl mx-auto text-foreground">
          Whether you are hosting a one-time meetup or running large-scale
          hybrid conferences, Fero Events has a plan that fits your needs.
        </p>
      </div>

      <div className="w-full flex flex-wrap gap-6 justify-center mb-12 md:gap-[149px] font-Nunito items-center">
        <div>
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-extrabold text-[18px] md:text-[30px] text-foreground">
              10k
            </h1>
            <p className="font-medium md:text-[20px]  text-foreground">
              Events Hosted
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-extrabold text-[18px] md:text-[30px] text-foreground">
            1M+
          </h1>
          <p className="font-medium md:text-[20px]  text-foreground">
            Total Viewers
          </p>
        </div>

        <div>
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-extrabold text-[18px] md:text-[30px] text-foreground">
              99%
            </h1>
            <p className="font-medium md:text-[20px]  text-foreground">
              Uptime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingHero;
