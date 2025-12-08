/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  MapPinHouse,
  ScissorsLineDashed,
  Settings,
  Tv,
  TvMinimalPlay,
} from "lucide-react";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { HiOutlineXMark } from "react-icons/hi2";

interface INav {
  label: string;
  icon: any;
  href: string;
  id: string;
  show: boolean;
}

const StreamAside: React.FC<{
  showAside: boolean;
  collapse: boolean;
  toggleAside: () => void;
  collapsAside: () => void;
  param: string;
}> = ({ showAside, toggleAside, collapsAside, collapse, param }) => {
  const pathname = usePathname();
  const navLinks: INav[] = [
    {
      label: "Livestream",
      icon: (
        <TvMinimalPlay
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith(`/stream/${param}`) && "text-primary"
          }`}
        />
      ),
      href: `/stream/${param}`,
      id: "",
      show: true,
    },
    {
      label: "Live Clipping",
      icon: (
        <ScissorsLineDashed
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith(`/stream/${param}/liveclipping`) &&
            "text-primary"
          }`}
        />
      ),
      href: `/stream/${param}/liveclipping`,
      id: "tour2-step2",
      show: true,
    },
    {
      label: "Live to VOD",
      icon: (
        <Tv
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith(`/stream/${param}/live-vod`) && "text-primary"
          }`}
        />
      ),
      href: `/stream/${param}/live-vod`,
      id: "tour1-step7",
      show: true,
    },
    {
      label: "Destinations",
      icon: (
        <MapPinHouse
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith(`/stream/${param}/destinations`) &&
            "text-primary"
          }`}
        />
      ),
      href: `/stream/${param}/destinations`,
      id: "",
      show: true,
    },
    {
      label: "Settings",
      icon: (
        <Settings
          className={`text-[#171717] dark:text-primary ${
            pathname.startsWith(`/stream/${param}/settings`) && "text-primary"
          }`}
        />
      ),
      href: `/stream/${param}/settings`,
      id: "tour1-step5",
      show: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === `/stream/${param}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
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
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {collapse ? (
              <Image
                src={`/images/logo-f.png`}
                alt="fero's logo"
                className="dark:brightness-200"
                width={51}
                height={45}
              />
            ) : (
              <Image
                src={`/images/logo-f.png`}
                width={144}
                height={65}
                className="dark:brightness-200"
                alt="fero's logo"
              />
            )}
          </Link>
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
                      id={item.id}
                      key={index}
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? "text-white rounded-lg font-bold border bg-primary  dark:bg-dash-gray border-none"
                          : "hover:bg-hover hover:rounded"
                      } ${
                        collapse ? "py-1 px-2" : "py-2 px-6"
                      }  flex items-center gap-4 capitalize  font-normal transition-all hoverable-link text-foreground`}>
                      <span
                        className={`${
                          isActive(item.href)
                            ? " bg-white text-primary"
                            : "bg-background"
                        } p-2 rounded-xl`}>
                        {item?.icon}
                      </span>
                      <span
                        className={`${
                          isActive(item.href)
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

export default StreamAside;
