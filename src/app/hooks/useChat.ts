import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { IComment } from "../interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { LIMIT } from "@/utils/constant";
import { useChatStore } from "../store/chat.store";
import { mergeById, normalizeComment } from "@/utils/helper";
import { useAuthStore } from "../store/auth.store";

export const useChat = (eventId: string, userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [comments, setComments] = useState<IComment[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [loading, setLoading] = useState(true);
  const { auth } = useAuthStore();
  const { chats, setChats, loading, createChat } = useChatStore();
  /** SOCKET INIT */
  useEffect(() => {
    // const s = io(`${axiosApi}/comments`, {
    //   path: "/comments",
    //   transports: ["websocket"],
    // });
    // s.on("connect", () => {
    //   setSocket(s);
    //   s.emit("join", { room: eventId, userId });
    // });
    // s.on("message", (msg: IComment) => {
    //   setChats([...chats, msg]);
    //   // remove typing indicator
    //   if (msg.creator?._id) {
    //     setTypingUsers((t) => {
    //       const copy = { ...t };
    //       if (msg.creator?._id) {
    //         delete copy[msg.creator._id];
    //       }
    //       return copy;
    //     });
    //   }
    // });
    // s.on("typing", ({ user }) => {
    //   const { id, name = "Someone" } = user;
    //   if (!id) return;
    //   setTypingUsers((t) => ({ ...t, [id]: name }));
    //   setTimeout(() => {
    //     setTypingUsers((t) => {
    //       const copy = { ...t };
    //       delete copy[id];
    //       return copy;
    //     });
    //   }, 2000);
    // });
    // return () => {
    //   s.emit("leave", { room: eventId });
    //   s.disconnect();
    //   setSocket(null);
    // };
  }, [eventId, userId, setChats, chats]);

  const loadMessages = useCallback(
    async (p = 1) => {
      if (!eventId) return;

      try {
        const { data } = await axiosApi.get<{ data: { comments: IComment[] } }>(
          `/events/${eventId}/comment?page=${p}&limit=${LIMIT}`
        );

        const fetched: IComment[] = data?.data?.comments || [];
        const normalized = fetched.map((c) => normalizeComment(c, auth));
        const total: number = data?.data?.comments.length ?? 0;

        if (p === 1) {
          setChats(normalized);
        } else {
          // setChats([...normalized.reverse(), ...chats]);
          // setChats((prev) => [...normalized, ...prev]);
          setChats((prev) => mergeById(prev, normalized));
        }

        setHasMore(p * LIMIT < total);
        setPage(p);
      } catch (err) {
        console.error(err);
      }
    },
    [eventId, auth, setChats]
  );

  useEffect(() => {
    if (!eventId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axiosApi.get<{
          data: { comments: IComment[] };
        }>(`/events/${eventId}/comment?page=1&limit=${LIMIT}`);

        const fetched = data?.data?.comments ?? [];
        const normalized = fetched.map((c) => normalizeComment(c, auth));

        setChats((prev) => mergeById(prev, normalized));
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [eventId, auth, setChats]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    await createChat(content, eventId);
  };

  const sendTyping = () => {
    socket?.emit("typing", {
      user: {
        id: userId,
      },
    });
  };

  return {
    comments: chats,
    typingUsers,
    loading,
    hasMore,
    loadMessages,
    sendMessage,
    sendTyping,
    socketReady: !!socket,
  };
};
