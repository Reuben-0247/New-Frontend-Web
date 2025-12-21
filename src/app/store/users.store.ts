import { create } from "zustand";
import { IUser } from "../interfaces/user.interface";

interface IProp {
  users: IUser[];
  user: IUser | null;
  loading: boolean;
  setLoading: (data: boolean) => void;
  setUser: (data: IUser | null) => void;
  setUsers: (data: IUser[]) => void;
}

export const useUserStore = create<IProp>((set) => ({
  user: null,
  users: [],
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setUser: (user: IUser | null) => set({ user }),
  setUsers: (users: IUser[]) => set({ users }),
}));
