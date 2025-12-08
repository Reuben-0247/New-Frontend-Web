"use client";

import React, { useState } from "react";

const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-foreground">
    <path
      fillRule="evenodd"
      d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-foreground">
    <path
      fillRule="evenodd"
      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const AccordionItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  toggleAccordion: () => void;
}> = ({ question, answer, isOpen, toggleAccordion }) => {
  return (
    <div className="my-6 cursor-pointer" onClick={toggleAccordion}>
      <div className="flex justify-between items-center py-2">
        <p className="font-medium">{question}</p>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100 py-4 px-6"
            : "max-h-0 opacity-0 px-6"
        }`}>
        {isOpen && (
          <div className="h-0.5 w-full bg-linear-to-r from-transparent via-line to-transparent"></div>
        )}
        <p className="text-foreground text-base leading-relaxed">{answer}</p>
      </div>

      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-line to-transparent"></div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Fero Events?",
      answer:
        "Feroevent is a livestreaming and event broadcasting platform that enables individuals, organizations, and event planners to stream, record, and share events in real-time, while engaging audiences across multiple platforms",
    },
    {
      question: "Who can use Fero Events?",

      answer:
        "Our platform is designed for a wide range of users—churches, educational institutions, corporate conference organizers, training facilitators, virtual event hosts, and content creators running premium or paid events.",
    },
    {
      question: " Do I need technical expertise to use Feroevent?",
      answer:
        "Not at all. Feroevent is built with an intuitive interface for beginners, but it also supports professional-grade tools for advanced streamers. Whether you’re new to streaming or a seasoned broadcaster, you’ll find it easy to operate",
    },
    {
      question: "What streaming quality does Feroevent support?",
      answer:
        "We support high-definition streaming (up to 1080p), with adaptive bitrate delivery for optimal viewing on any device, even in low-bandwidth areas",
    },
    {
      question: " Can I stream to multiple platforms at once?",
      answer:
        "Yes. With our multi-destination streaming feature, you can broadcast to up to 25 platforms simultaneously, including YouTube, Facebook, LinkedIn, Instagram and custom RTMP destinations",
    },
    {
      question: " How does resource sharing work?",
      answer:
        "During your livestream, you can upload and share relevant documents—like brochures, slides, or event schedules—directly with your online audience for better engagement.",
    },
    {
      question: "  Is my stream secure?",
      answer:
        "Absolutely. All streams are delivered through secure connections, and we use Akamai CDN to ensure safe, fast, and reliable delivery worldwide",
    },
    {
      question: "Can I record my livestream?",
      answer:
        "Yes. Our cloud recording feature lets you store your event securely for up to 72 hours after broadcast. You can download the recording for archiving, replay, or editing",
    },
    {
      question: "  What is live clipping?",
      answer:
        "Live clipping allows you to cut and share key highlights from your livestream instantly—perfect for social media teasers, real-time updates, or promoting ongoing sessions",
    },
    {
      question: " Do you support virtual and hybrid events?",
      answer:
        "Yes. Feroevent is built to handle fully virtual events as well as hybrid setups that combine in-person attendance with online streaming",
    },
    {
      question: " What internet speed do I need?",
      answer:
        "We recommend a stable internet connection with at least 5 Mbps upload speed for HD streaming. Higher speeds ensure smoother performance, especially when streaming to multiple destinations.",
    },
    {
      question: " How do I get started with Feroevent?",
      answer:
        "Simply sign up, choose your subscription plan and event type, connect your streaming equipment or webcam, configure your destinations, and go live in minutes",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background py-16   lg:px-8 font-google-sans min-h-screen flex  justify-center">
      <div className=" w-full container mx-auto md:px-6 px-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-tight mb-12 text-center">
          Frequently asked questions
        </h2>

        <div className="">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleAccordion={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
