import { create } from "zustand";
import { IComment } from "../interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { normalizeComment } from "@/utils/helper";
import { useAuthStore } from "./auth.store";

interface IProp {
  chats: IComment[];
  chat: IComment | null;
  loading: boolean;
  setChat: (chat: IComment | null) => void;
  setChats: (chats: IComment[] | ((prev: IComment[]) => IComment[])) => void;
  deleteChat: (id: string) => Promise<boolean>;
  createChat: (
    content: string,
    eventId: string,
    userId?: string
  ) => Promise<IComment | boolean>;
}

export const useChatStore = create<IProp>((set) => ({
  chat: null,
  chats: [],
  loading: false,
  setChat: (chat: IComment | null) => set({ chat }),
  setChats: (updater) =>
    set((state) => ({
      chats: typeof updater === "function" ? updater(state.chats) : updater,
    })),
  // setChats: (chats: IComment[]|) => set({ chats }),
  createChat: async (
    content: string,
    eventId: string
  ): Promise<IComment | boolean> => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.post<{ eventLiveComment: IComment }>(
        `/events/${eventId}/comment`,
        {
          content,
        }
      );

      const normalized = normalizeComment(
        data.eventLiveComment,
        useAuthStore.getState().auth
      );
      set((state) => ({
        chats: [...state.chats, normalized],
      }));
      return normalized;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteChat: async (id: string): Promise<boolean> => {
    try {
      set({ loading: true });
      const res = await axiosApi.delete(`/comments/${id}`);
      const responseJson = res.data;

      if (responseJson.status === "success") {
        set((state) => ({
          chats: state.chats.filter((chat) => chat._id !== id),
        }));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
