import { create } from "zustand";
import { IUser } from "../interfaces/user.interface";
// import { AxiosError } from "axios";
// import { formatError } from "@/utils/helper";
// import { toast, ToastContent } from "react-toastify";
// import axiosApi from "@/lib/axios";

interface IProp {
  users: IUser[];
  user: IUser | null;
  loading: boolean;
  setLoading: (data: boolean) => void;
  setUser: (data: IUser | null) => void;
  setUsers: (data: IUser[]) => void;
  // fetchUsers: () => Promise<void>;
}

export const useUserStore = create<IProp>((set) => ({
  user: null,
  users: [],
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setUser: (user: IUser | null) => set({ user }),
  setUsers: (users: IUser[]) => set({ users }),
  // fetchUsers: async (): Promise<void> => {
  //   try {
  //     set({ loading: true });
  //     const { data } = await axiosApi.get<IUser[]>("/users/all-users");
  //     set({ users: data });
  //   } catch (error) {
  //     const axiosError = error as AxiosError;
  //     const formattedError = formatError(axiosError);
  //     toast.error(formattedError.message as ToastContent);
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
}));
