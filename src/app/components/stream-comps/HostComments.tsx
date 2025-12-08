import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/auth.store";
import ChatReceived from "./ChatReceived";
import ChatSend from "./ChatSend";
import { formatTime } from "@/utils/helper";
import { useChat } from "@/app/hooks/useChat";
import styled from "styled-components";

interface Props {
  eventId: string;
}

const HostComments: React.FC<Props> = ({ eventId }) => {
  const { auth } = useAuthStore();
  const {
    comments,
    typingUsers,
    loading,
    // hasMore,
    loadMessages,
    sendMessage,
    sendTyping,
  } = useChat(eventId, auth?.id);

  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage({
      id: crypto.randomUUID(),
      message: message.trim(),
      time: formatTime(Date.now()),
      name: "You",
      creator: auth || undefined,
    });

    setMessage("");
    setShowPicker(false);
  };

  return (
    <Wrapper>
      <Card className="w-full bg-background">
        <CardHeader>
          <div>
            <CardTitle>Comments</CardTitle>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${comments.length} messages`}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={scrollRef}
            className="min-h-[40vh] h-[420px] overflow-auto px-4 py-2 space-y-4 chat-box">
            {comments.map((c) => (
              <div key={c.id}>
                {c?.creator?.id !== auth?.id ? (
                  <ChatReceived chat={c} />
                ) : (
                  <ChatSend chat={c} />
                )}
              </div>
            ))}
          </div>

          {Object.values(typingUsers).length > 0 && (
            <p className="px-3 pb-1 text-sm text-muted-foreground italic">
              {Object.values(typingUsers).join(", ")} typing…
            </p>
          )}

          <div className="border-t px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowPicker((p) => !p)}>
                  😊
                </Button>

                {showPicker && (
                  <div className="absolute bottom-10 left-0 z-50">
                    <Picker
                      onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
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
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default HostComments;
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
`;
