/* eslint-disable @next/next/no-img-element */
import { IComment } from "@/app/interfaces/event.interface";
import React from "react";
import styled from "styled-components";

const ChatReceived: React.FC<{ chat: IComment }> = ({ chat }) => {
  return (
    <Wrapper>
      <div className="message-reply p-2">
        <div className="flex items-center gap-4">
          <div className="flex  flex-col">
            <span className="text-[12px] mb-3">{chat?.time || "3:12"}</span>
            <img
              className="rounded-[50%] w-8 h-8 object-cover"
              src="/images/avater-1.png"
              alt="avatar"
            />
            <span className="text-[12px]">{"John Doe"}</span>
          </div>
          <div className="  bg-[#29303c] text-white p-3 reply">
            <small className="">
              {chat?.message || "hdhdhdhdhjdjdjdjdjdjd"}
            </small>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatReceived;

const Wrapper = styled.div`
  .message-reply {
    .reply {
      position: relative;
      border-radius: 15px;

      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 400px;

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: -8px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid #29303c;
      }
    }
  }
`;
