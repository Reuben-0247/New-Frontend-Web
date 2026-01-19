/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/auth.store";
import Cookies from "js-cookie";

// import { formatTime } from "@/utils/helper";
import { useChat } from "@/app/hooks/useChat";
import styled from "styled-components";
import { Send } from "lucide-react";
import ChatReceived from "../stream-comps/ChatReceived";
import ChatSend from "../stream-comps/ChatSend";
import ModalComp from "../ModalComp";
import { TOKEN_NAME } from "@/utils/constant";
import Link from "next/link";

const LiveComment: React.FC<{ eventId: string }> = ({ eventId }) => {
  const token = Cookies.get(TOKEN_NAME);
  const { auth } = useAuthStore();
  const {
    comments,
    typingUsers,
    // hasMore,
    loadMessages,
    sendMessage,
    sendTyping,
  } = useChat(eventId, auth?._id);

  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    loadMessages(1);
  }, [loadMessages]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [comments]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message.trim());

    setMessage("");
    setShowPicker(false);
  };

  const checkIsLoggedIn = () => {
    if (!token) {
      setShowModal(true);
    }
  };

  return (
    <Wrapper>
      <ModalComp
        header="Login"
        onClose={() => setShowModal(false)}
        open={showModal}>
        <div>
          <p className="mb-4">😥 Oops account not logged in</p>
          <p>
            Please{" "}
            <Link className="text-primary font-bold underline" href="/login">
              Login
            </Link>{" "}
            to comment
          </p>
        </div>
      </ModalComp>
      <Card className="w-full bg-background pt-4 pb-0">
        <CardContent className="p-0">
          {comments.length < 1 ? (
            <div className=" min-h-[40vh] h-[420px] bg-[#0F172A]  flex flex-col text-center justify-center  items-center">
              <img src="/images/image.png" alt="" />

              <h3 className=" text-white">Start a conversation</h3>
              <p className=" text-white">
                There are no messages here yet. Start a conversation by sending
                a message.
              </p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="min-h-[40vh] h-[420px] overflow-auto px-4 py-2 space-y-4 chat-box">
              {comments.map((c) => (
                <div key={c._id}>
                  {c?.creator?._id !== auth?._id ? (
                    <ChatReceived chat={c} />
                  ) : (
                    <ChatSend chat={c} />
                  )}
                </div>
              ))}
            </div>
          )}

          {Object.values(typingUsers).length > 0 && (
            <p className="px-3 pb-1 text-sm text-muted-foreground italic">
              {Object.values(typingUsers).join(", ")} typing…
            </p>
          )}

          <div className="border-t px-3 py-2">
            <form onSubmit={handleSend}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    ref={buttonRef}
                    type="button"
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => setShowPicker((p) => !p)}>
                    😊
                  </Button>

                  {showPicker && (
                    <div
                      ref={pickerRef}
                      className="absolute bottom-12 left-0 z-50 shadow-lg"
                      onClick={(e) => e.stopPropagation()}>
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setMessage((prev) => prev + e.emoji);
                          // setShowPicker(false);
                        }}
                        height={350}
                        width={300}
                      />
                    </div>
                  )}
                </div>

                <Input
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    sendTyping();
                  }}
                  onFocus={checkIsLoggedIn}
                  placeholder="Type a message..."
                />

                <Button
                  variant={"ghost"}
                  className="cursor-pointer"
                  onClick={handleSend}>
                  <Send />
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default LiveComment;

const Wrapper = styled.div`
  .chat-box {
    flex: 1;
    min-height: 40vh;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 5px;
      overflow: hidden;
    }

    &::-webkit-scrollbar-track {
      border-radius: 10px;
      padding: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #0062ff;
      border-radius: 10px;
    }
  }
  .chat-send {
    position: relative;
    .delete {
      display: none;
    }
    &:hover {
      .delete {
        display: block;
        position: absolute;
        top: 0;
        right: 10px;
        z-index: 10;
      }
    }
  }
`;
