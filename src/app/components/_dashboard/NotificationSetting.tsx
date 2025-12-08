/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
// import { useTheme } from '../ThemeContext';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isDark: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  enabled,
  setEnabled,
  isDark,
}) => (
  <div className="flex items-center justify-between py-4 ">
    <div className="flex gap-2  items-center">
      <div>
        <img src="/images/iconNotification.png" alt="" />
      </div>
      <p className={`text-base  wrap-break-word m-0 text-foreground `}>
        {label}
      </p>
    </div>

    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-xl transition-colors duration-500 border-2 border-black ${
        enabled ? "bg-black border-black" : "bg-white border-gray-300"
      }`}
      aria-checked={enabled}
      role="switch">
      <span
        className={`inline-block h-2 w-2 transform rounded-full transition-transform duration-500 ${
          enabled ? "translate-x-5 bg-white" : "translate-x-1 bg-black"
        }`}
      />
    </button>
  </div>
);

const NotificationSettings = () => {
  const [newEventsEnabled, setNewEventsEnabled] = useState(true);
  const [liveEventsEnabled, setLiveEventsEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [isDark] = useState(false);

  return (
    <div className="  flex items-center scrollbar-hide mb-4">
      <div className=" md:w-[80%] dark:bg-gray-900 rounded-lg  p-3 md:p-6   border-gray-200">
        <div className="flex items-center mb-8">
          <div
            className={`p-1 h-10 w-10 flex justify-center  mr-4 items-center rounded-full text-foreground `}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          <h2
            className={`text-lg sm:text-xl mt-1 font-medium text-foreground `}>
            Notification
          </h2>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="space-y-0">
          <div className="space-y-0">
            <ToggleSwitch
              label="Get updates about new events"
              enabled={newEventsEnabled}
              setEnabled={setNewEventsEnabled}
              isDark={isDark}
            />
            <ToggleSwitch
              label="Get updates about live events"
              enabled={liveEventsEnabled}
              setEnabled={setLiveEventsEnabled}
              isDark={isDark}
            />
            <ToggleSwitch
              label="Reminder to join registered events"
              enabled={remindersEnabled}
              setEnabled={setRemindersEnabled}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
