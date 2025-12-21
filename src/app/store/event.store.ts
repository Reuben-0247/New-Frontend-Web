import { create } from "zustand";
import { CreateEventFormInput, IEvent } from "../interfaces/event.interface";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import { toast, ToastContent } from "react-toastify";
import axiosApi from "@/lib/axios";
import { IStreamData } from "../interfaces/castr.interface";

interface IProp {
  events: IEvent[];
  event: IEvent | null;
  streamData: IStreamData | null;
  setStreamData: (data: IStreamData | null) => void;
  setEvents: (data: IEvent[]) => void;
  setEvent: (data: IEvent | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  createEvent: (input: CreateEventFormInput) => Promise<IEvent>;
}

export const useEventStore = create<IProp>((set) => ({
  event: null,
  streamData: null,
  events: [],
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setStreamData: (streamData: IStreamData | null) => set({ streamData }),
  setEvent: (event: IEvent | null) => set({ event }),
  setEvents: (events: IEvent[]) => set({ events }),
  createEvent: async (input: CreateEventFormInput): Promise<IEvent> => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.post<IEvent>("/events/publish", input);
      console.log(data);
      set((state) => ({
        events: [data, ...state.events],
      }));
      toast.success("Event created successfully");

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
}));
