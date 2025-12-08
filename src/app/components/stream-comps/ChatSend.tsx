/* eslint-disable @next/next/no-img-element */
import { IComment } from "@/app/interfaces/event.interface";
import { Check } from "lucide-react";
import React from "react";
import styled from "styled-components";

const ChatSend: React.FC<{ chat: IComment }> = ({ chat }) => {
  return (
    <Wrapper>
      <div className="chats p-2">
        <div className="flex items-center justify-end gap-4">
          <div className="flex flex-col bg-[#29303c] text-white p-3 message">
            <small className="">
              {chat?.message || "hhfhhfhfhfhfhfhfhfjjsioweiueu"}
            </small>
          </div>

          <div className="flex  items-center flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px]">{chat.time || "3:39"}</span>

              <div className="check">
                <Check size={15} />
              </div>
            </div>
            <img
              className="rounded-[50%] w-8 h-8 object-cover"
              src="/images/avater-1.png"
              alt="avatar"
            />
            <p>{chat.name || "Tom Tim"}</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatSend;

const Wrapper = styled.div`
  .chats {
    .message {
      position: relative;
      border-radius: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 400px;

      &::before {
        content: "";
        position: absolute;
        top: 8px;
        right: -8px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #29303c;
      }
    }
  }
`;
