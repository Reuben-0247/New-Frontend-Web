"use client";
/* eslint-disable @next/next/no-img-element */
import NotificationSettings from "@/app/components/_dashboard/NotificationSetting";
import ThemeToggle from "@/app/components/ToggleTeam";
import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading] = useState(false);

  // const { isDark, toggleDarkMode } = useTheme();

  // const handleUpdatePassword = async () => {
  //   const token = sessionStorage.getItem("token");

  //   try {
  //     setLoading(true);
  //     const formData = {
  //       oldPassword: currentPassword,
  //       newPassword: newPassword,
  //     };

  //     const response = await Axios.patch(`/auth/change-password`, formData, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.data.status === "success") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Password updated successfully!",
  //         toast: true,
  //         timer: 2000,
  //         showConfirmButton: false,
  //         position: "top-right",
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: response.data.error || "Password reset failed",
  //         text: response.data.errors?.[0],
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     const backendError = error.response?.data;

  //     Swal.fire({
  //       icon: "error",
  //       title: backendError?.error || "Something went wrong",
  //       text: backendError?.errors?.[0] || error.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <section className="w-full min-h-screen transition-colors duration-300">
      <div className="w-full  pt-[26px]">
        <h1 className="text-gray-500 text-sm px-3 mb-4">
          Settings and account preferences
        </h1>

        <div className="mb-10 px-3">
          <div className="flex items-center gap-3">
            <img src="/images/setting-icon.png" alt="setting icon" />
            <h2 className="text-lg font-medium text-gray-900 mt-2 dark:text-white">
              Preference
            </h2>
          </div>

          <div className="flex items-center max-w-md px-3 justify-between py-4 border-b dark:text-white border-gray-200">
            <div>
              <p className="text-base text-gray-900 dark:text-white">
                Select Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-white">
                Toggle to select either dark or light mode
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-4 w-8 items-center rounded-full border-2 border-gray-400 dark:border-gray-500 bg-gray-200 dark:bg-gray-600">
                <span
                  className={`inline-block h-2 w-2 transform rounded-full bg-black transition-transform duration-300 ${
                    isDark ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button> */}
              <ThemeToggle />
            </div>
          </div>

          {/* Password Section */}
          <div className="mt-14 px-1">
            <div className="flex items-center gap-3">
              <img src="/images/setting-icon.png" alt="security icon" />
              <h2 className="text-lg font-medium text-gray-900 mt-2 dark:text-white">
                Password & Security
              </h2>
            </div>

            <div className="grid grid-cols-1  gap-7 w-full md:grid-cols-2 mt-6">
              {/* Current Password */}
              <div className="relative">
                <label
                  htmlFor="currentPassword"
                  className="block text-lg text-gray-900 dark:text-white mb-3">
                  Enter current password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  className="w-full md:py-3 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  value={currentPassword}
                  placeholder="************"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 top-[50%] right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Toggle password visibility">
                  {showCurrentPassword ? (
                    <BsEyeFill size={18} />
                  ) : (
                    <BsEyeSlashFill size={18} />
                  )}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-lg text-gray-900 dark:text-white mb-3">
                  Enter new password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  className="w-full  md:py-3 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  value={newPassword}
                  placeholder="************"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 top-[50%] right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Toggle password visibility">
                  {showNewPassword ? (
                    <BsEyeFill size={18} />
                  ) : (
                    <BsEyeSlashFill size={18} />
                  )}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-lg text-gray-900 dark:text-white mb-3">
                  Confirm new password
                </label>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  className="w-full  md:py-3 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  value={confirmNewPassword}
                  placeholder="************"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  className="absolute inset-y-0 top-[50%] right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Toggle password visibility">
                  {showConfirmNewPassword ? (
                    <BsEyeFill size={18} />
                  ) : (
                    <BsEyeSlashFill size={18} />
                  )}
                </button>
              </div>
              <div className="w-full flex items-end">
                <button
                  // onClick={handleUpdatePassword}
                  className="w-full   md:py-3 px-4 py-3  bg-blue-600 flex items-center justify-center text-white font-medium text-lg rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  {loading ? (
                    <div className="loader border-t-transparent border-white animate-spin rounded-full w-5 h-5 border-2" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="  pt-[26px]">
        <NotificationSettings />
      </div>
    </section>
  );
};

export default SettingsPage;
