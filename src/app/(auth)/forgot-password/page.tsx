/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosApi from "@/lib/axios";
import { toast, ToastContent } from "react-toastify";
import { AxiosError } from "axios";
import { formatError } from "@/utils/helper";

const PasswordResetPage = () => {
  //   const router = useRouter();
  const [input, setInput] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axiosApi.post("/auth/forgot-password", input);

      if (response) {
        toast.success(
          "Reset password link has been sent to your email. Please check your inbox.",
        );
        setLoading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError?.message as ToastContent);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto p-6 mx-auto flex flex-col gap-4">
      <div className="flex justify-center mb-6">
        <Link href="/" className="text-primary link font-semibold ">
          <img
            src="/images/logo-f.png"
            alt="Fero Events Logo"
            className="h-[70px] object-cover"
          />
        </Link>
      </div>
      <div className="mt-10 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl text-black md:text-2xl font-semibold">
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                className="text-black"
                value={input.email}
                placeholder="you@example.com"
                required
                autoComplete="email"
                onChange={(e) => setInput({ ...input, email: e.target.value })}
              />
            </div>

            <Button
              className="w-full mt-4 bg-primary flex justify-center items-center text-white cursor-pointer"
              size="lg"
              type="submit"
              disabled={loading}>
              {loading ? (
                <span className="relative flex h-4 w-4 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-50 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-200"></span>
                </span>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
