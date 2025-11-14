"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ThemeToggle from "./ToggleTeam";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };
  const navItems: { label: string; link: string }[] = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Events",
      link: "/event",
    },
    {
      label: "Pricing",
      link: "/pricing",
    },
    {
      label: "Solutions",
      link: "/solution",
    },
  ];

  return (
    <header className="w-full md:flex justify-center  md:bg-transparent">
      <div className=" container mx-auto px-2 md:px-6 flex justify-center w-full">
        <nav className=" w-full  py-3 flex justify-between   items-center">
          <Link href="/" className="">
            <img
              src="/images/logo-f.png"
              alt="Fero Events Logo"
              className="h-[70px] object-cover"
            />
          </Link>

          <ul className="hidden md:flex items-center justify-center m-0 p-0 gap-5 font-Nunito text-sm">
            {navItems.map((nav) => (
              <li key={nav.label}>
                <Link
                  href={nav.link}
                  className={` font-medium text-lg text-foreground transition-all duration-300 no-underline ${
                    isActive(nav.link)
                      ? "border-b-2 border-primary font-bold text-primary"
                      : ""
                  }`}>
                  {nav.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="">
              <Link
                href="/logIn"
                className="px-3 py-[11px] text-[20px] text-foreground font-medium border-2 border-[#0052CC85] rounded-lg dark:hover:bg-[#0052cc18] transition duration-300 no-underline">
                Login
              </Link>
            </div>
          </div>

          {/* <button
              className="md:hidden text-2xl transition-transform duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}>
              {menuOpen ? <IoClose /> : <HiMenuAlt3 />}
            </button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
