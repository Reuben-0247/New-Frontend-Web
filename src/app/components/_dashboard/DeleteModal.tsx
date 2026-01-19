import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import ModalComp from "../ModalComp";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/store/auth.store";

const DeleteAccountFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { auth } = useAuthStore();
  const handleContinue = () => {
    if (!email || !password) {
      toast.warn("Email and password are required.");
      return;
    }
    onSubmit();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 opacity-97   flex items-center justify-center p-4 z-40 font-sans">
      <ModalComp
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSave={() => handleContinue}
        loading={loading}
        saveText="Delete"
        actionType="delete"
        header="Delete Account">
        <div>
          <p className="">
            Are you sure you want to delete this account{" "}
            <span className="font-bold text-primary">{auth?.firstName}</span>?
          </p>
        </div>
      </ModalComp>
      <div className="bg-white z-50 rounded-lg shadow-xl w-full max-w-xl mx-auto p-6 sm:p-8">
        <h2 className="text-[30px] sm:text-2xl font-meduim text-gray-900 mb-6 ">
          You are deleting your account
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-black text-base font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-black text-base font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer text-xl">
              {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onClose}
            className="flex-1 cursor-pointer px-6 py-3 bg-gray-300 text-gray-800 font-medium text-lg rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200">
            Cancel
          </Button>
          <Button
            onClick={() => setOpenDeleteModal(true)}
            className="flex-1 px-6 py-3 cursor-pointer bg-blue-600 text-white font-medium text-lg rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountFormModal;
