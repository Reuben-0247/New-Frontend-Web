/* eslint-disable @next/next/no-img-element */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
} from "react";
import { AxiosError } from "axios";
import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContent } from "react-toastify";
import { formatError } from "@/utils/helper";
import { useRouter } from "next/navigation";
import axiosApi from "@/lib/axios";
import Link from "next/link";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const OtpScreen: React.FC = () => {
  const router = useRouter();
  //   const { state } = useLocation();

  //   const storedEmail = localStorage.getItem("email");
  const email: string = "your.email@example.com";
  // storedEmail ||
  // (state as { email?: string })?.email ||
  // "your.email@example.com";

  const [loading, setLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState<number>(0);
  const [isResending, setIsResending] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  /* -------------------- TIMER -------------------- */
  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(
      2,
      "0",
    )}`;
  };

  /* -------------------- INPUT HANDLERS -------------------- */
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (element.value !== "" && !/^[0-9]$/.test(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && newOtp.every((digit) => digit !== "")) {
      onSubmitAuto(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.split("").slice(0, 6);
    const newOtp = [...otp];

    pasteArray.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });

    setOtp(newOtp);

    inputRefs.current[pasteArray.length - 1]?.focus();

    if (newOtp.every((digit) => digit !== "")) {
      onSubmitAuto(newOtp.join(""));
    }
  };

  /* -------------------- VERIFY OTP -------------------- */
  const onSubmitAuto = async (enteredOtp: string) => {
    setErrorMsg("");
    setBtnDisabled(true);

    try {
      const response = await axiosApi.post(`/auth/verify-email/`, {
        email,
        otp: enteredOtp,
      });

      if (response?.data?.status === "success") {
        toast.success("Email verified successfully");
        await signUp();
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.error(err?.response?.data?.error || "OTP verification failed.");
    } finally {
      setBtnDisabled(false);
    }
  };

  /* -------------------- SIGN UP -------------------- */
  const signUp = async () => {
    if (!userDetails) return;

    try {
      setLoading(true);
      setBtnDisabled(true);

      const response = await axiosApi.post(`/auth/signup`, userDetails);

      if (response?.data?.status === "success") {
        toast.success("Account created successfully");
        localStorage.setItem("email", userDetails.email);

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError?.message as ToastContent);
    } finally {
      setLoading(false);
      setBtnDisabled(false);
    }
  };

  /* -------------------- RESEND OTP -------------------- */
  const sendOTPToMail = async () => {
    if (!userDetails) return;

    setBtnDisabled(true);

    try {
      const response = await axiosApi.post(
        `/auth/send-otp/`,
        {
          email,
          firstName: userDetails.firstName,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response?.data?.status === "success") {
        toast.success("An OTP has been sent to your mail");
        setTimer(270);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError?.message as ToastContent);
    } finally {
      setBtnDisabled(false);
      setIsResending(false);
    }
  };

  /* -------------------- MANUAL SUBMIT -------------------- */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    onSubmitAuto(enteredOtp);
  };

  /* -------------------- LOAD USER DATA -------------------- */
  useEffect(() => {
    const raw = localStorage.getItem("userSignUp");
    if (raw) {
      const data = JSON.parse(raw);
      setUserDetails({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
    }
  }, []);

  return (
    <div className="h-auto bg-white flex flex-col items-center justify-center p-4">
      <div className="mb-12">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-primary link font-semibold ">
            <img
              src="/svgs/Fero_logo_dark.svg"
              alt="Fero Events Logo"
              className="h-[70px] object-cover"
            />
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg max-w-xl border w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Verify Your Email
        </h2>

        <p className="text-gray-600 mb-8">
          We'll send a 6-digit code to{" "}
          <span className="font-medium text-blue-600">{email}</span>
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-6" onPaste={handlePaste}>
            <label className="block text-sm font-medium mb-3">Enter OTP</label>

            <div className="flex justify-center space-x-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="w-10 h-12 text-center text-lg font-bold border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={digit}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {timer > 0
              ? `Code expires in ${formatTime(timer)}`
              : "No active code"}
          </p>

          <button
            type="submit"
            disabled={btnDisabled}
            className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold ${
              btnDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}>
            {btnDisabled ? (
              <ThreeDots height="20" width="40" color="#fff" />
            ) : (
              "Verify and Continue"
            )}
          </button>
        </form>

        <p className="text-sm mt-6">
          Didn't get the code?{" "}
          <button
            disabled={timer > 0}
            onClick={() => {
              setIsResending(true);
              sendOTPToMail();
            }}
            className={`font-medium ${
              timer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:underline"
            }`}>
            {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpScreen;
