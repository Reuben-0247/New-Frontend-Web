"use client";
import DeleteAccountFormModal from "@/app/components/_dashboard/DeleteModal";
/* eslint-disable @next/next/no-img-element */
import NotesFromEvents from "@/app/components/_dashboard/Notes";
import { UpdateUserInput } from "@/app/interfaces/auth.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosApi from "@/lib/axios";
import { formatError } from "@/utils/helper";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast, ToastContent } from "react-toastify";

const ProfilePage = () => {
  const { auth, updateAuth, uploadImage, loading } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const [loadingDel, setLoadingDel] = useState(false);

  const [inputValues, setInputValues] = useState<UpdateUserInput>({
    firstName: auth?.firstName || "",
    lastName: auth?.lastName || "",
    phoneNumber: auth?.phoneNumber || "",
  });

  const handleSubmit = async () => {
    try {
      setLoadingDel(true);
      await axiosApi.delete(`/users/${auth?._id}`);
      toast.success("Account deleted successfully...");
      window.location.href = "/login";
      setShowModal(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.response as ToastContent);
    } finally {
      setLoadingDel(false);
    }
  };

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAuth(inputValues);
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      await uploadImage(file, reader.result as string);
    };
  };

  return (
    <div>
      <Card className="bg-background border-0">
        <CardContent>
          <div className="md:flex items-center gap-4 px-3 mb-8">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 border-2 rounded-full bg-gray-200 flex items-center justify-center">
              <img
                src={auth?.profilePhotoUrl || "/images/avater-1.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
              <button
                onClick={() => {
                  imageRef.current?.click();
                }}
                className="absolute bottom-0 right-0 cursor-pointer p-2 bg-blue-600 rounded-full text-white"
                aria-label="Edit profile photo">
                {loading ? (
                  <span className="relative flex h-4 w-4 ">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-200"></span>
                  </span>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
                  </svg>
                )}
              </button>
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="customFile"
                name="profileImage"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <p className="text-xl font-semibold dark:text-white">
                Profile Photo
              </p>
              <p className="text-sm text-gray-500">
                This will be displayed on your profile
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background mt-6 border-0">
        <CardContent>
          <form onSubmit={onUpdate}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <label>First Name</label>
                <Input
                  value={inputValues.firstName}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Last Name</label>
                <Input
                  value={inputValues.lastName}
                  onChange={(e) =>
                    setInputValues({ ...inputValues, lastName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Email</label>
                <Input type="email" disabled value={auth?.email} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Phone Number</label>
                <Input
                  value={inputValues.phoneNumber}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                disabled={loading}
                onClick={onUpdate}
                type="submit"
                className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-background my-6 border-0">
        <CardContent>
          <NotesFromEvents />
        </CardContent>
      </Card>

      {/* <Card className="bg-background border-0">
        <CardContent> */}
      <div className="  font-sans">
        <div className="w-full bg-background text-foreground rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <TrashIcon className="text-red-500" />
            <h2 className="text-xl font-medium m-0 text-foreground">
              Delete account
            </h2>
          </div>

          <p className="text-foreground leading-relaxed mb-6 text-base md:text-lg sm:text-base">
            Deleting your account is a permanent action. All your data will be
            erased, and this action cannot be undone. Please proceed with
            caution.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto md:px-36 py-2 md:py-4 bg-primary text-white cursor-pointer font-medium text-lg rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200">
            Delete
          </button>
        </div>

        <DeleteAccountFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          loading={loadingDel}
        />
      </div>
      {/* </CardContent>
      </Card> */}
    </div>
  );
};

export default ProfilePage;
