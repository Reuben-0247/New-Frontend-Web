import { create } from "zustand";
import {
  CreateEventFormInput,
  Iboard,
  IEvent,
  UpdateEventFormInput,
} from "../interfaces/event.interface";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import { toast, ToastContent } from "react-toastify";
import axiosApi from "@/lib/axios";
import { IStreamData } from "../interfaces/castr.interface";

interface IProp {
  events: IEvent[];
  event: IEvent | null;
  boards: Iboard[];
  board: Iboard | null;
  streamData: IStreamData | null;
  setStreamData: (data: IStreamData | null) => void;
  setEvents: (data: IEvent[]) => void;
  setEvent: (data: IEvent | null) => void;
  setBoard: (data: Iboard | null) => void;
  setBoards: (data: Iboard[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  createEvent: (
    input: CreateEventFormInput,
    displayImage: File | null,
  ) => Promise<IEvent | boolean>;
  updateEvent: (
    input: UpdateEventFormInput,
    displayImage?: File | null,
  ) => Promise<IEvent | boolean>;
  goLiveEvent: (eventId: string) => Promise<IEvent | boolean>;
  endStream: (eventId: string) => Promise<IEvent | boolean>;
  createBoard: (
    input: FormData,
    eventId: string,
  ) => Promise<Iboard[] | boolean>;
  updateBoard: (input: FormData, board: Iboard) => Promise<Iboard | boolean>;
  deleteBoard: (board: Iboard) => Promise<boolean>;
}

export const useEventStore = create<IProp>((set) => ({
  event: null,
  streamData: null,
  events: [],
  boards: [],
  board: null,
  setBoard: (board: Iboard | null) => set({ board }),
  setBoards: (boards: Iboard[]) => set({ boards }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setStreamData: (streamData: IStreamData | null) => set({ streamData }),
  setEvent: (event: IEvent | null) => set({ event }),
  setEvents: (events: IEvent[]) => set({ events }),
  createEvent: async (
    input: CreateEventFormInput,
    displayImage: File | null,
  ): Promise<IEvent | boolean> => {
    try {
      set({ loading: true });
      const formData = new FormData();

      if (displayImage) {
        formData.append("displayImage", displayImage);
      }

      formData.append("title", input.title || "");
      formData.append("description", input.description || "");
      formData.append("categoryId", input.categoryId || "");
      formData.append("startDate", input.startDate || "");
      formData.append("endDate", input.endDate || "");
      formData.append("startTime", input.startTime || "");
      formData.append("endTime", input.endTime || "");
      if (input.requirePassword == true) {
        formData.append("requirePassword", input.requirePassword && "true");
      }
      formData.append("featuredEvent", input.featuredEvent ? "true" : "false");
      formData.append("location", JSON.stringify(input.location));
      if (input.password) {
        formData.append("password", input.password);
      }

      formData.append("type", input.type || "");
      const { data } = await axiosApi.post<{ data: { event: IEvent } }>(
        "/events",
        formData,
      );
      set((state) => ({
        events: [data.data.event, ...state.events],
      }));
      toast.success("Event created successfully");

      return data.data.event;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateEvent: async (
    input: UpdateEventFormInput,
    displayImage?: File | null,
  ): Promise<IEvent | boolean> => {
    try {
      set({ loading: true });

      if (displayImage) {
        const formData = new FormData();
        formData.append("title", input.title || "");
        formData.append("description", input.description || "");
        formData.append("categoryId", input.categoryId || "");
        formData.append("startDate", input.startDate || "");
        formData.append("endDate", input.endDate || "");
        formData.append("startTime", input.startTime || "");
        formData.append("endTime", input.endTime || "");
        if (input.requirePassword == true) {
          formData.append("requirePassword", input.requirePassword && "true");
        }
        formData.append(
          "featuredEvent",
          input.featuredEvent ? "true" : "false",
        );
        formData.append("location", JSON.stringify(input.location));
        if (input.password) {
          formData.append("password", input.password);
        }

        formData.append("type", input.type || "");
        formData.append("displayImage", displayImage);
        const { data } = await axiosApi.patch<{ data: { event: IEvent } }>(
          `/events/publish/${input._id}`,
          formData,
        );
        set((state) => ({
          events: [data.data.event, ...state.events],
        }));
        toast.success("Event updated successfully");

        return data.data.event;
      } else {
        const { data } = await axiosApi.patch<{ data: { event: IEvent } }>(
          `/events/publish/${input._id}`,
          input,
        );
        set((state) => ({
          events: [data.data.event, ...state.events],
        }));
        toast.success("Event updated successfully");

        return data.data.event;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  goLiveEvent: async (eventId: string): Promise<IEvent | boolean> => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.patch(`/events/live/${eventId}`, {
        evenId: eventId,
        streamPlatform: "castr",
      });
      set((state) => ({
        event: state.event ? { ...state.event, isLive: true } : null,
      }));
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  endStream: async (eventId: string): Promise<IEvent | boolean> => {
    try {
      set({ loading: true });

      const { data } = await axiosApi.patch(`/stream/end-streaming`, {
        eventId: eventId,
        streamType: "castr",
      });
      set((state) => ({
        event: state.event ? { ...state.event, isLive: false } : null,
        streamData: null,
      }));
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(
        "To end this stream, please stop the stream on your broadcasting software",
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createBoard: async (
    input: FormData,
    eventId: string,
  ): Promise<Iboard[] | boolean> => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.post<{ board: Iboard[] }>(
        `/events/${eventId}/boards`,
        input,
      );
      set((state) => ({
        boards: [...state.boards, ...data.board],
      }));
      return data.board;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateBoard: async (
    input: FormData,
    board: Iboard,
  ): Promise<Iboard | boolean> => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.put<{ data: Iboard }>(
        `/events/boards/update/${board?._id}`,
        input,
      );
      set((state) => ({
        boards: state.boards.map((b) =>
          b._id === board._id ? { ...b, ...data.data } : b,
        ),
      }));
      toast.success("Board updated successfully");
      return data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteBoard: async (board: Iboard): Promise<boolean> => {
    try {
      set({ loading: true });
      await axiosApi.delete(`/events/${board.eventId}/boards/${board._id}`);
      set((state) => ({
        boards: state.boards.filter((b) => b._id !== board._id),
      }));
      toast.success("Board deleted successfully");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
