import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { IComment } from "../interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { LIMIT } from "@/utils/constant";

export const useChat = (eventId: string, userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  /** SOCKET INIT */
  useEffect(() => {
    const s = io(`${axiosApi}/comments`, {
      path: "/comments",
      transports: ["websocket"],
    });

    setSocket(s);

    s.on("connect", () => {
      s.emit("join", { room: eventId, userId });
    });

    s.on("message", (msg: IComment) => {
      // Always append new message to bottom
      setComments((prev) => [...prev, msg]);

      // remove typing indicator
      if (msg.creator?.id) {
        setTypingUsers((t) => {
          const copy = { ...t };
          if (msg.creator?.id) {
            delete copy[msg.creator.id];
          }
          return copy;
        });
      }
    });

    s.on("typing", ({ user }) => {
      const { id, name = "Someone" } = user;
      if (!id) return;

      setTypingUsers((t) => ({ ...t, [id]: name }));

      setTimeout(() => {
        setTypingUsers((t) => {
          const copy = { ...t };
          delete copy[id];
          return copy;
        });
      }, 2000);
    });

    return () => {
      s.emit("leave", { room: eventId });
      s.disconnect();
      setSocket(null);
    };
  }, [eventId, userId]);

  /** FETCH MESSAGES PAGINATION */
  const loadMessages = useCallback(
    async (p = 1) => {
      if (!eventId) return;

      try {
        setLoading(true);

        const { data } = await axiosApi.get(
          `/events/${eventId}/comment?page=${p}&limit=${LIMIT}`
        );

        const fetched: IComment[] = data?.comments || [];
        const total: number = data?.total ?? 0;

        if (p === 1) {
          setComments(fetched); // newest already at bottom
        } else {
          setComments((prev) => [...fetched, ...prev]); // prepend older
        }

        setHasMore(p * LIMIT < total);
        setPage(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  const sendMessage = (payload: IComment) => {
    setComments((prev) => [...prev, payload]);
    socket?.emit("comment", {
      eventId,
      content: payload.message,
      creatorId: userId,
    });
  };

  const sendTyping = () => {
    socket?.emit("typing", {
      user: {
        id: userId,
      },
    });
  };

  return {
    comments,
    typingUsers,
    loading,
    hasMore,
    loadMessages,
    sendMessage,
    sendTyping,
    socketReady: !!socket,
  };
};
