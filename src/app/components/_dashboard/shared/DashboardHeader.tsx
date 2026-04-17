/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
// import Link from "next/link";
// import Image from "next/image";
import { useRouter } from "next/navigation";
// import { Bell } from "lucide-react";
import { FaRegUser } from "react-icons/fa6";
import Cookies from "js-cookie";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuLogOut } from "react-icons/lu";
// import { useAuthStore } from "@/app/store/auth.store";
import { TOKEN_NAME, USER_ID } from "@/utils/constant";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import ThemeToggle from "../../ToggleTeam";
import { useAuthStore } from "@/app/store/auth.store";
import { useThemeStore } from "@/app/store/theme.store";
import { useEffect, useState } from "react";
// import NotificationModal from "./modal/NotificationModal";

const DashboardHeader: React.FC<{ toggleAside?: () => void }> = ({
  toggleAside,
}) => {
  const router = useRouter();
  const { auth } = useAuthStore();
  const { theme } = useThemeStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = () => {
    Cookies.remove(TOKEN_NAME);
    Cookies.remove(USER_ID);
    // Cookies.remove(ORG_ID);
    // Cookies.remove(ROLE);
    // window.location.href = "/login";

    router.push("/login");
  };

  const logo =
    mounted && theme === "dark"
      ? "/svgs/FERO_LOGO_light.svg"
      : "/svgs/Fero_logo_dark.svg";
  return (
    <div className="flex  h-[8vh] justify-between w-full items-center gap-4  border-b-line border-b bg-background  px-4  lg:px-6 dash-header">
      <div className="flex items-center gap-4 ">
        <button onClick={toggleAside}>
          <span className="mr-12  md:hidden  rounded-full  shadow-lg flex items-center justify-center text-2xl  transition">
            <Menu />
          </span>
        </button>

        <div className="w-max">
          <img
            src={logo}
            className="md:hidden"
            width={100}
            height={100}
            alt="logo"
          />
        </div>
      </div>
      <div className="text-foreground md:block hidden font-bold ">
        <p className="flex gap-2">
          Dashboard
          {/* <span>{mounted ? auth?.firstName : ""}</span>
          <span>{mounted ? auth?.lastName : ""}</span> */}
        </p>
      </div>

      <div className="flex items-center gap-6 justify-end w-full">
        <Bell className="text-primary cursor-pointer" />
        {mounted && <ThemeToggle />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex min-w-0 md:gap-x-4 outline-none cursor-pointer">
              <div className="flex items-center  text-foreground justify-center h-10 w-10 rounded-full">
                <img
                  src={
                    mounted
                      ? auth?.profilePhotoUrl || "/images/g2.jpg"
                      : "/images/g2.jpg"
                  }
                  alt="image"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-auto">
                <p className="hidden md:flex text-md font-semibold leading-6 text-foreground mb-0">
                  {mounted ? `${auth?.firstName} ${auth?.lastName}` : ""}
                </p>
                <p className="hidden md:flex truncate text-xs leading-5 text-foreground">
                  {mounted ? auth?.email : ""}
                </p>
              </div>
              <span className="sr-only">Toggle user menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex bg-background flex-col">
            <DropdownMenuLabel className="text-foreground">
              <span className="text-foreground">
                {" "}
                {mounted ? auth?.email : ""}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href="/profile" className="flex items-center w-full">
              <DropdownMenuItem className="cursor-pointer w-full ">
                <FaRegUser className="mr-2 h-4 w-4" />
                <span className="text-foreground"> Profile</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div
                className="text-[#D22727] text-md justify-start  w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}>
                <span className="flex items-center">
                  <LuLogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
