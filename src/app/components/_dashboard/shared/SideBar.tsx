"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CircleDollarSign,
  LogOut,
  Medal,
  MonitorPlay,
  Settings,
  User,
} from "lucide-react";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { HiOutlineXMark } from "react-icons/hi2";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/utils/constant";
import { useMounted } from "@/app/hooks/useOnmount";
import { useThemeStore } from "@/app/store/theme.store";

interface INav {
  label: string;
  icon: any;
  href: string;
  show: boolean;
}

const SideBar: React.FC<{
  showAside?: boolean;
  collapse?: boolean;
  toggleAside: () => void;
  collapsAside: () => void;
}> = ({ showAside, toggleAside, collapsAside, collapse }) => {
  const mounted = useMounted();
  const { theme } = useThemeStore();

  const pathname = usePathname();
  const token = Cookies.get(TOKEN_NAME);

  const navLinks: INav[] = [
    {
      label: "Find Events",
      icon: (
        <CalendarCheck
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/find-events") && "text-primary"
          }`}
        />
      ),
      href: "/find-events",
      show: true,
    },
    {
      label: "My Events",
      icon: (
        <CalendarCheck
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/events") && "text-primary"
          }`}
        />
      ),
      href: "/events",
      show: !!token,
    },
    {
      label: "Go Live",
      icon: (
        <MonitorPlay
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/go-live") && "text-primary"
          }`}
        />
      ),
      href: "/go-live",
      show: !!token,
    },
    {
      label: "Fero points",
      icon: (
        <Medal
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/fero-points") && "text-primary"
          }`}
        />
      ),
      href: "/fero-points",
      show: !!token,
    },
    {
      label: "Pricing",
      icon: (
        <CircleDollarSign
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/pricing") && "text-primary"
          }`}
        />
      ),
      href: "/pricing",
      show: !!token,
    },
    {
      label: "Profile",
      icon: (
        <User
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/profile") && "text-primary"
          }`}
        />
      ),
      href: "/profile",
      show: !!token,
    },
    {
      label: "Settings",
      icon: (
        <Settings
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith("/settings") && "text-primary"
          }`}
        />
      ),
      href: "/settings",
      show: !!token,
    },
  ];
  if (!mounted) return null;

  return (
    <div
      className={`${collapse ? " w-max" : "w-[18vw]"} aside ${
        showAside ? "show" : "hide"
      } `}>
      <div
        className={`flex flex-col gap-2 h-full relative  bg-background border-r  border-r-line transition-width duration-300 aside-inner`}>
        <div
          className={`${
            collapse ? "p-2 w-full" : "p-4"
          } flex  items-center border-b-line border-b  h-[8vh] justify-between `}>
          {theme === "dark" ? (
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {collapse ? (
                <Image
                  src={`/svgs/FERO_LOGO_light.svg`}
                  alt="fero's logo"
                  width={51}
                  height={45}
                />
              ) : (
                <Image
                  src={`/svgs/FERO_LOGO_light.svg`}
                  width={110}
                  height={30}
                  alt="fero's logo"
                />
              )}
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {collapse ? (
                <Image
                  src={`/svgs/Fero_logo_dark.svg`}
                  alt="fero's logo"
                  width={51}
                  height={45}
                />
              ) : (
                <Image
                  src={`/svgs/Fero_logo_dark.svg`}
                  width={110}
                  height={30}
                  alt="fero's logo"
                />
              )}
            </Link>
          )}
          <HiOutlineXMark
            size={30}
            className="text-primary md:hidden block font-bold cursor-pointer"
            onClick={toggleAside}
          />
        </div>
        <div
          className="absolute top-16 -right-4 h-7 w-7 rounded-2xl bg-background border flex items-center justify-center shadow-lg cursor-pointer collapse-btn"
          onClick={collapsAside}>
          {collapse ? (
            <BiChevronRight size={30} className="text-primary" />
          ) : (
            <BiChevronLeft size={30} className="text-primary" />
          )}
        </div>
        <div className="flex flex-col flex-1 overflow-auto mt-4">
          <p
            className={`${
              collapse ? "text-[10px] w-max p-2 mb-4" : "text-sm p-4"
            }   font-semibold text-[#AAB1B8] `}>
            Main Menu
          </p>
          <nav
            className={`${
              collapse ? "px-1" : "px-2 lg:px-4"
            }  text-sm font-medium  flex-1 overflow-auto`}>
            <div
              className={`${
                collapse ? "w-max" : ""
              } flex flex-col  justify-between h-full pb-4`}>
              <div className="grid gap-1 w-max ">
                {navLinks
                  .filter((nav) => nav.show === true)
                  .map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={toggleAside}
                      className={`${
                        pathname.startsWith(item.href)
                          ? "text-white rounded-lg font-bold border bg-primary  dark:bg-dash-gray border-none"
                          : "hover:bg-hover hover:rounded"
                      } ${
                        collapse ? "py-1 px-2" : "py-2 px-6"
                      }  flex items-center gap-4 capitalize  font-normal transition-all hoverable-link text-foreground`}>
                      <span
                        className={`${
                          pathname.startsWith(item.href)
                            ? " bg-white text-primary"
                            : "bg-background"
                        } p-2 rounded-xl`}>
                        {item?.icon}
                      </span>
                      <span
                        className={`${
                          pathname.startsWith(item.href)
                            ? "text-white font-semibold"
                            : "text-foreground"
                        } ${collapse ? "hidden" : "inline"}  text-base`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
              </div>
              <div
                className={`${collapse ? "px-1" : "px-6"} mt-4 pt-4 border-t `}>
                <Button variant="outline" className="w-full cursor-pointer">
                  <LogOut className="text-red-500" />
                  <span className={`${collapse ? "hidden" : "inline"} `}>
                    Log out
                  </span>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
