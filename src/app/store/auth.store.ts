import { create } from "zustand";
import { IUser } from "../interfaces/user.interface";
import axiosApi from "@/lib/axios";
import { toast, ToastContent } from "react-toastify";
import { AxiosError } from "axios";
import { formatError } from "@/utils/helper";
import {
  ChangePasswordInput,
  UpdateUserInput,
} from "../interfaces/auth.interface";
import Cookies from "js-cookie";
import { TOKEN_NAME, USER_ID } from "@/utils/constant";
// import { useUserStore } from "./users.store";

interface IProp {
  auth: IUser | null;
  setLoadingAuth: (payload: boolean) => void;
  setAuth: (input: IUser) => void;
  loading: boolean;
  updateAuth: (input: UpdateUserInput) => Promise<IUser | undefined>;
  changePassword: (input: ChangePasswordInput) => Promise<boolean>;
  uploadImage: (file: File, image: string) => Promise<string | undefined>;
}
export const useAuthStore = create<IProp>((set) => ({
  auth: null,
  loading: false,
  setAuth: (auth: IUser) => set({ auth }),
  setLoadingAuth: (loading: boolean) => set({ loading }),
  updateAuth: async (input: UpdateUserInput) => {
    // const { staffs, setStaffs } = useStaffStore.getState();
    try {
      set({ loading: true });

      const { data } = await axiosApi.patch<{ data: { user: IUser } }>(
        "/users/update-profile",
        input
      );
      set((state) => ({
        auth: {
          ...state.auth,
          ...data.data.user,
        },
      }));

      // const userStore = useUserStore.getState();
      // const existingUsers = userStore.users || [];

      // const updatedUsers = existingUsers.map((user) =>
      //   user.id === input.id
      //     ? {
      //         ...user,
      //         firstName: data.firstName,
      //         lastName: data.lastName,
      //         phone: data.phone,
      //         image: data.image,
      //       }
      //     : user
      // );
      // userStore.setUsers(updatedUsers);

      toast.success(` User details Updated`);
      set({ loading: false });

      return data.data.user;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.response as ToastContent);
    } finally {
      set({ loading: false });
    }
  },
  changePassword: async (input: ChangePasswordInput): Promise<boolean> => {
    try {
      set({ loading: true });
      await axiosApi.post("/auth/change-password", input);
      Cookies.remove(TOKEN_NAME);
      Cookies.remove(USER_ID);
      // Cookies.remove(ORG_ID);
      // Cookies.remove(ROLE);
      window.location.href = "/login";
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.response as ToastContent);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  uploadImage: async (
    file: File,
    image?: string
  ): Promise<string | undefined> => {
    {
      try {
        set({ loading: true });
        const formData = new FormData();
        formData.append("profileImage", file);
        const { data } = await axiosApi.patch<{ imageUrl: string }>(
          "/users/update-profile-image",
          formData
        );
        set((state) => {
          if (!state.auth) return {};
          return {
            auth: {
              ...state.auth,
              profilePhotoUrl: image || "",
            },
          };
        });

        return data.imageUrl;
      } catch (error) {
        const axiosError = error as AxiosError;
        const formattedError = formatError(axiosError);
        toast.error(formattedError.response as ToastContent);
      } finally {
        set({ loading: false });
      }
    }
  },
}));
