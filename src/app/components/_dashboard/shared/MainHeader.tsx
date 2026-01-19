/* eslint-disable @next/next/no-img-element */
"use client";
// import Link from "next/link";
import Image from "next/image";
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
// import NotificationModal from "./modal/NotificationModal";

const MainHeader: React.FC<{ toggleAside?: () => void }> = ({
  toggleAside,
}) => {
  const router = useRouter();
  const { auth } = useAuthStore();
  const { theme } = useThemeStore();

  const logout = () => {
    Cookies.remove(TOKEN_NAME);
    Cookies.remove(USER_ID);
    // Cookies.remove(ORG_ID);
    // Cookies.remove(ROLE);
    // window.location.href = "/login";

    router.push("/login");
  };

  return (
    <header className="flex  h-[8vh] justify-between w-full items-center gap-4  border-b-line border-b bg-background  px-4  lg:px-6 dash-header">
      <div className="flex items-center gap-4 ">
        <button onClick={toggleAside}>
          <span className="mr-12  md:hidden  rounded-full  shadow-lg flex items-center justify-center text-2xl  transition">
            <Menu />
          </span>
        </button>
        {theme === "dark" ? (
          <Image
            src={`/svgs/FERO_LOGO_light.svg`}
            className="md:hidden"
            width={100}
            height={100}
            alt="checkCITE logo"
          />
        ) : (
          <Image
            src={`/svgs/Fero_logo_dark.svg`}
            className="md:hidden"
            width={100}
            height={100}
            alt="checkCITE logo"
          />
        )}
      </div>
      <div className="text-foreground md:block hidden font-bold ">
        <p className="flex gap-2">
          <span>{auth?.firstName}</span> <span>{auth?.lastName}</span>
        </p>
      </div>

      <div className="flex items-center gap-6 justify-end w-full">
        <Bell className="text-primary cursor-pointer" />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex min-w-0 md:gap-x-4 cursor-pointer">
              <div className="flex items-center  text-foreground justify-center h-10 w-10 rounded-full">
                <img
                  src={auth?.profilePhotoUrl || "/images/g2.jpg"}
                  alt="image"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-auto">
                <p className="hidden md:flex text-md font-semibold leading-6 text-foreground mb-0">
                  {auth?.firstName} {auth?.lastName}
                </p>
                <p className="hidden md:flex truncate text-xs leading-5 text-foreground">
                  {auth?.email}
                </p>
              </div>
              <span className="sr-only">Toggle user menu</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex bg-background flex-col">
            <DropdownMenuLabel className="text-foreground">
              <span className="text-foreground"> {auth?.email}</span>
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
    </header>
  );
};

export default MainHeader;
