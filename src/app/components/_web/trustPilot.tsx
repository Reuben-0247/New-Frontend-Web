/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import React from "react";

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-5 h-5 ${
      filled ? "text-yellow-400" : "text-gray-300"
    } fill-current`}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const ReviewCard: React.FC<{
  avatar: string;
  quote: string;
  name: string;
  title: string;
}> = ({ avatar, quote, name, title }) => {
  return (
    <div className=" p-2 md:p-2 text-left flex flex-col border-l h-[200px]">
      <div className="flex items-start mb-2">
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full mr-4 object-cover"
        />
        <p className="text-foreground text-base leading-relaxed grow">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
      <div className=" pl-14">
        <p className="font-semibold text-foreground text-sm">{name} </p>
        <p className="text-foreground text-xs">{title}</p>
      </div>
    </div>
  );
};

const TrustPilotSection = () => {
  const reviews = [
    {
      avatar: "https://placehold.co/40x40/FFD700/000000?text=G",
      quote:
        "The streaming & even sharing our presentation materials everything just worked. We reached hundreds of viewers across platforms without any stress.",
      name: "Grace E.",
      title: "Conference Organizer",
    },
    {
      avatar: "https://placehold.co/40x40/ADD8E6/000000?text=P",
      quote:
        "We used to struggle with uploading recordings after our live streams. Now, Fero Events automatically saves and organizes everything our members love it.",
      name: "Pastor Tolu A.",
      title: "Worship Stream Host",
    },
    {
      avatar: "https://placehold.co/40x40/90EE90/000000?text=D",
      quote:
        "I've used several tools, but Fero Events gives me everything in one place. The UI is clean, setting up events is fast, and I can easily manage my audience and content.",
      name: "Daniel C.",
      title: "Online Instructor",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 font-google-sans min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="flex mr-3">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={true} />
            ))}
          </div>
          <span className="text-lg font-medium text-foreground">
            Trust Pilot
          </span>
        </div>

        <h2 className="text-lg md:text-3xl lg:text-4xl font-medium text-foreground leading-tight mb-12 max-w-5xl mx-auto">
          Don't just take our word for it — here's how real hosts are using Fero
          Events to stream, engage, and manage events with ease.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              avatar={review.avatar}
              quote={review.quote}
              name={review.name}
              title={review.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPilotSection;
