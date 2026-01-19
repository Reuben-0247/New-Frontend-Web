/* eslint-disable @next/next/no-img-element */
import { IComment } from "@/app/interfaces/event.interface";
import { formatTime } from "@/utils/helper";
import { Check } from "lucide-react";
import React from "react";
import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EllipsisVertical, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatSend: React.FC<{ chat: IComment }> = ({ chat }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Wrapper>
      <div className="chats p-2">
        <div className="flex items-center justify-end gap-1">
          <span className="delete">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  // onClick={(e) => e.stopPropagation()}
                  // onPointerDown={(e) => e.stopPropagation()}
                  className="cursor-pointer">
                  <EllipsisVertical size={15} className="text-secondary " />
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent
                align="end"
                className="flex bg-background flex-col outline-none border-0 absolute -top-11 right-3">
                <DropdownMenuItem className="cursor-pointer flex justify-center  w-max ">
                  <Button
                    variant="outline"
                    size="sm"
                    // onClick={() => {
                    //   setBoardToEdit(board);
                    //   setOpenDeleteModal(true);
                    // }}
                    className="cursor-pointer z-10">
                    <Trash2 size={15} className="text-red-500" />
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          </span>
          <div className="flex flex-col bg-[#011d4e] text-white p-2 message">
            <small className=" ">
              {chat?.content || "hhfhhf hfhfhfhf hfhfjjsi  "}
            </small>
            <p className="flex items-center ml-12 justify-end  text-gray-400 gap-2 text-xs ">
              {formatTime(chat?.createdAt)}
              <span>
                <Check size={15} />
              </span>
            </p>
          </div>
          {/* <div className="flex  items-center flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px]">
                {new Date(chat.createdAt).getTime()}
              </span>

              <div className="check">
                <Check size={15} />
              </div>
            </div>
            <img
              className="rounded-[50%] w-8 h-8 object-cover"
              src="/images/avater-1.png"
              alt="avatar"
            />
            <p className="">{chat.creator?.name || "Tom Tim"}</p>
          </div> */}
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
      border-radius: 8px 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 400px;

      &::before {
        content: "";
        position: absolute;
        top: 0px;
        right: -7px;
        width: 0;
        height: 0;
        border-top: 0px solid transparent;
        border-bottom: 12px solid transparent;
        border-left: 8px solid #011d4e;
        border-right: 0px solid transparent;
      }
    }
    .delete {
      visibility: hidden;
    }
    &:hover {
      .delete {
        visibility: visible;
      }
    }
  }
`;
