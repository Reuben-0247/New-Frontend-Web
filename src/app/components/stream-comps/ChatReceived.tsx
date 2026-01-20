/* eslint-disable @next/next/no-img-element */
import { IComment } from "@/app/interfaces/event.interface";
import { formatTime } from "@/utils/helper";
import React from "react";
import styled from "styled-components";

const ChatReceived: React.FC<{ chat: IComment }> = ({ chat }) => {
  return (
    <Wrapper>
      <div className="message-reply p-2">
        <div className="flex gap-3">
          <div className="">
            <img
              className="rounded-[50%] w-8 h-8 object-cover"
              src={chat?.creator?.profilePhotoUrl || "/images/avater-1.png"}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col  bg-[#011d4e] text-white p-2 reply">
            <small className=" ">
              {chat?.content || "hhfhhf hfhfhfhf hfhfjjsi  "}
            </small>
            <p className="flex items-center ml-12 justify-end  text-gray-400 gap-2 text-xs ">
              {formatTime(chat?.createdAt)}
            </p>
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
      border-radius: 0px 8px 8px 8px;

      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 400px;

      &::before {
        content: "";
        position: absolute;
        top: 0px;
        left: -7px;
        width: 0;
        height: 0;
        border-top: 0px solid transparent;
        border-bottom: 12px solid transparent;
        border-right: 8px solid #011d4e;
      }
    }
  }
`;
