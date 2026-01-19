"use client";

import React, { useEffect, useState } from "react";
import { IEvent } from "@/app/interfaces/event.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { toast, ToastContent } from "react-toastify";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/utils/constant";
import { useRouter } from "next/navigation";
import axiosApi from "@/lib/axios";
import { AxiosError } from "axios";
import { formatError } from "@/utils/helper";
import { Input } from "@/components/ui/input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event?: IEvent | null;
}

const EventRegistrationFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  setIsConfirmationModalOpen,
  event,
}) => {
  const token = Cookies.get(TOKEN_NAME);
  const router = useRouter();

  const { auth } = useAuthStore();
  const [attendanceType, setAttendanceType] = useState<"online" | "physical">(
    "online",
  );
  const [regLoading, setRegLoading] = useState(false);

  const [input, setInput] = useState<{
    confirmEmail: string;
    firstName: string;
    lastName: string;
  }>({
    confirmEmail: auth?.email || "",
    firstName: auth?.firstName || "",
    lastName: auth?.lastName || "",
  });

  useEffect(() => {
    if (!auth) return;

    setInput({
      confirmEmail: auth.email ?? "",
      firstName: auth.firstName ?? "",
      lastName: auth.lastName ?? "",
    });
  }, [auth]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventId = event?._id;
    if (!eventId) {
      toast.warning("Event ID is missing.");

      return;
    }

    if (!token) {
      toast.error("Please log in to register for the event.");

      router.push("/login");
      return;
    }

    try {
      setRegLoading(true);
      const payload = { eventId };
      const response = await axiosApi.post(`/events/register`, payload, {});
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || "Registration successful");

        setIsConfirmationModalOpen(true);
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
    } finally {
      setRegLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 no-scrollbar bg-gray-600 opacity-97 flex  items-center scroll-hide z-10 justify-center p-4 font-sans">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm  sm:max-w-md lg:max-w-lg max-h-[90vh] z-70 no-scrollbar overflow-y-auto p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Event Registration
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="confirmEmail"
                className="block text-gray-700 text-sm font-medium mb-1">
                Confirm Email Address
              </label>
              <Input
                type="email"
                className="text-black"
                value={input.confirmEmail}
                required
                onChange={(e) =>
                  setInput({ ...input, confirmEmail: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                First Name
              </label>
              <Input
                type="text"
                className="text-black"
                value={input.firstName}
                required
                onChange={(e) =>
                  setInput({ ...input, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Last Name
              </label>
              <Input
                type="text"
                className="text-black"
                value={input.lastName}
                required
                onChange={(e) =>
                  setInput({ ...input, lastName: e.target.value })
                }
              />
            </div>

            <div className="pt-2">
              <p className="text-gray-700 text-sm font-medium mb-2">
                How would you like to attend the event?
              </p>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attendance"
                    value="online"
                    checked={attendanceType === "online"}
                    onChange={() => setAttendanceType("online")}
                    className="h-4 accent-slate-700  w-4"
                  />
                  <span className="ml-2 text-gray-700">Online</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attendance"
                    value="physical"
                    checked={attendanceType === "physical"}
                    onChange={() => setAttendanceType("physical")}
                    className="h-4 accent-slate-700 w-4"
                  />
                  <span className="ml-2 text-gray-700">Physical</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded-md font-semibold hover:bg-blue-700">
              {regLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={onClose}
              className="text-blue-600 cursor-pointer text-sm hover:underline">
              Go back to Events
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventRegistrationFormModal;
