/* eslint-disable @next/next/no-img-element */
import { IEvent } from "@/app/interfaces/event.interface";
import React, { useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const EventSlide: React.FC<{ events: IEvent[] }> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  return (
    <Wrapper>
      <div className="relative md:w-full  px-3 md:px-0">
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 dark:bg-slate-600/70 bg-white  shadow rounded-full `}
          onClick={scrollLeft}
          aria-label="Scroll left">
          <ChevronLeft />
        </button>

        <div
          ref={containerRef}
          className=" track"
          tabIndex={0}
          role="list"
          aria-label="Scrollable list of events">
          {[...events, ...events].map((ev, idx) => (
            <div key={`${ev.eventId}-${idx}`} className="card">
              <img
                src={ev.displayImage || "https://via.placeholder.com/256x144"}
                alt={ev.title}
              />

              <div className="content">
                <h3>{ev.title}</h3>
                <div className="meta">
                  <span>
                    <Calendar size={12} />
                    {new Date(ev.startDate || "").toLocaleDateString()}
                  </span>
                  <span>{ev.totalParticipants?.length} registered</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 dark:bg-slate-600/70 bg-white shadow rounded-full `}
          onClick={scrollRight}
          aria-label="Scroll right">
          <ChevronRight />
        </button>
      </div>
    </Wrapper>
  );
};

export default EventSlide;

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;

  .track {
    display: flex;
    width: max-content;
    animation: scroll 300s linear infinite;
  }

  .card {
    flex-shrink: 0;
    width: 280px;
    height: 81px;
    display: flex;
    border-radius: 8px;
    border: 1px solid rgba(153, 153, 153, 0.418);
    background: transparent;
    margin-right: 16px;
  }

  img {
    width: 30%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px 0 0 8px;
  }

  .content {
    width: 70%;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h3 {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    opacity: 0.7;
  }

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  @media (max-width: 640px) {
    .track {
      width: 240px;
    }
    .card {
      width: 240px;
    }

    .track {
      animation-duration: 10s;
    }
  }
`;
