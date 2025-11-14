/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { MailIcon } from "lucide-react";
import { FiMapPin } from "react-icons/fi";
import { BsInstagram, BsTwitterX, BsWhatsapp } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-line to-transparent"></div>

      <footer className="w-full  bg-background pt-8 pb-0 text-foreground font-sans">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between gap-4 px-4 md:px-10 lg:px-16">
          <div className="max-w-[220px] flex flex-col ">
            <img
              src="/images/logo-f.png"
              className=" h-[70px] w-[150px]"
              alt=""
            />
            <p className="text-sm text-foreground max-w-xs leading-relaxed mt-8">
              Whether you're hosting a virtual conference, hybrid meetup, or
              live concert, Fero Events scales with you.
            </p>
            <div className="flex gap-3 mt-3 ">
              <a
                href="#"
                aria-label="Facebook"
                className="bg-background border-border border hover:border-primary rounded-full link flex justify-center items-center h-12 w-12 transition ">
                <FaFacebookF className="text-2xl text-foreground hover:text-primary " />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="bg-background border-border border hover:bg-white hover:border-black rounded-full flex justify-center items-center h-12 w-12 link  transition">
                <BsTwitterX className="text-2xl text-foreground hover:text-black" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="bg-background border-border border hover:border-primary rounded-full flex justify-center items-center h-12 w-12 link transition">
                <FaLinkedinIn className="text-2xl text-foreground hover:text-primary " />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="bg-background border-border border hover:border-pink-400 rounded-full flex justify-center items-center h-12 w-12 link transition">
                <BsInstagram className="text-2xl text-foreground hover:text-pink-400" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center gap-2 min-w-40">
            <a
              href="/pricing"
              className="mb-2 link text-foreground font-medium hover:underline">
              Pricing
            </a>
            <a
              href="#"
              className="mb-2 font-medium text-foreground link hover:underline">
              Solutions
            </a>
            <a
              href="#"
              className="mb-2 font-medium text-foreground link hover:underline">
              Request a Demo
            </a>
          </div>

          <div className="flex flex-col text-foreground items-start justify-center gap-2 min-w-40">
            <a
              href="/event"
              className="mb-2 font-medium text-foreground link hover:underline">
              Events
            </a>
            <a
              href="#"
              className="mb-2 font-medium link text-foreground hover:underline">
              Support
            </a>
            <a
              href="#"
              className="mb-2 font-medium link text-foreground hover:underline">
              Custom Plan
            </a>
          </div>

          {/* Right: Contact Details */}
          <div className="flex flex-col justify-center items-start text-foreground gap-3 min-w-[220px]">
            <div className="flex items-center gap-2">
              <MailIcon className="text-xl text-foreground" />
              <span className="text-sm font-medium break-all">
                support@feroevent.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BsWhatsapp className="text-lg" />
              <span className="text-sm font-medium">+2347045071045</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-lg" />
              <span className="text-sm font-medium">
                Port Harcourt, Nigeria
              </span>
            </div>
          </div>
        </div>

        <div className="my-7 max-w-[1350px] mx-auto h-px w-full bg-background"></div>

        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-2 px-4 md:px-10 lg:px-16 pb-5">
          <p className="text-xs text-secondary">
            &copy; Copyright 2025 Fero Events
          </p>
          <div className="flex space-x-8 mt-2 md:mt-0">
            <a href="#" className="text-xs text-secondary link hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-secondary link hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-secondary link hover:underline">
              Cookie Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
