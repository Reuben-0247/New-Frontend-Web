import { AxiosError } from "axios";
import {
  CreateDestinationInput,
  IDestination,
  IEnableDestination,
  UpdateDestinationInput,
} from "../interfaces/destination.interface";
import { formatError } from "@/utils/helper";
import { toast, ToastContent } from "react-toastify";
import axiosApi from "@/lib/axios";
import { create } from "zustand";

interface IProp {
  destinations: IDestination[];
  destination: IDestination | null;
  loading: boolean;
  setLoading: (data: boolean) => void;
  setDestination: (data: IDestination | null) => void;
  setDestinations: (data: IDestination[]) => void;
  createDestination: (
    input: CreateDestinationInput,
    userId?: string,
    castrId?: string,
  ) => Promise<IDestination | undefined>;
  updateDestination: (
    input: UpdateDestinationInput,
    castrId?: string,
  ) => Promise<IDestination | undefined>;
  deleteDestination: (id: string, streamId?: string) => Promise<boolean>;
  enableDestination: (
    input: IEnableDestination,
  ) => Promise<IDestination | undefined>;
}
export const useDestinationStore = create<IProp>((set) => ({
  destination: null,
  destinations: [],
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setDestination: (destination: IDestination | null) => set({ destination }),
  setDestinations: (destinations: IDestination[]) => set({ destinations }),
  createDestination: async (
    input: CreateDestinationInput,
    userId?: string,
    castrId?: string,
  ) => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.post<{ data: IDestination }>(
        `/stream/platform/${userId}/${castrId}`,
        input,
      );
      const newDestination = data.data;
      set((state) => ({
        destinations: [...state.destinations, newDestination],
      }));
      toast.success("Destination created successfully");
      return newDestination;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateDestination: async (
    input: UpdateDestinationInput,
    castrId?: string,
  ) => {
    try {
      set({ loading: true });
      const { data } = await axiosApi.patch<{ data: IDestination }>(
        `/stream/platform/update/${castrId}`,
        input,
      );
      const updatedDestination = data.data;
      set((state) => ({
        destinations: state.destinations.map((d) =>
          d._id === input._id ? updatedDestination : d,
        ),
      }));
      toast.success("Destination updated successfully");
      return updatedDestination;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteDestination: async (id: string, streamId?: string) => {
    try {
      set({ loading: true });
      await axiosApi.delete(`/stream/platform/${id}/${streamId}`);
      set((state) => {
        const updatedDestinations = state.destinations.filter(
          (d) => d.platform_id !== id,
        );

        return {
          destinations: updatedDestinations.length ? updatedDestinations : [],
        };
      });
      toast.success("Destination deleted successfully");
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
  enableDestination: async (input: IEnableDestination) => {
    try {
      set({ loading: true });
      const { platform_id, streamId, ...res } = input;
      const { data } = await axiosApi.patch<{ response: IDestination }>(
        `/stream/castr/${streamId}/destination/${platform_id}`,
        res,
      );
      const enabledDestination = data.response;
      set((state) => ({
        destinations: state.destinations.map((d) =>
          d.platform_id === input.platform_id ? enabledDestination : d,
        ),
      }));
      toast.success(
        `Destination ${enabledDestination?.isEnabled ? "enabled" : "disabled"} successfully`,
      );
      return enabledDestination;
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
