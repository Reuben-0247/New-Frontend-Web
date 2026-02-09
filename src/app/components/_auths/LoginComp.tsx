/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContent, toast } from "react-toastify";
// import Cookies from "js-cookie";
// import axiosApi from "@/lib/axios";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useRouter, useSearchParams } from "next/navigation";
import { formatError } from "@/utils/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Spinner } from "@/app/components/Spinner";
import { TOKEN_NAME } from "@/utils/constant";
import SocialAuth from "./SocialAuth";
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address. Please check and try again"),
  password: z.string().min(4, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginComp: React.FC<{ token: string }> = ({ token }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    Cookies.set(TOKEN_NAME, token);
    router.replace("/events");
  }, [token, router]);

  // const email = form.watch("email");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data } = await axios.post<{ message: string }>(
        "/auth/login",
        values,
      );
      // console.log("Login response:", values);
      if (data) {
        toast.success("Login successful");
        router.replace("/find-events");
      }

      // if (data.message) {
      //   toast.success("Login successful");
      //   router.push("/dashboard");
      //   setLoading(false);
      // }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError?.message as ToastContent);
    } finally {
      setLoading(false);
    }
  }
  if (token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="md:mt-6 mt-2 ">
      <div className="flex justify-center mb-6">
        <Link href="/" className="text-primary link font-semibold ">
          <img
            src="/svgs/Fero_logo_dark.svg"
            alt="Fero Events Logo"
            className="h-[70px] object-cover"
          />
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-center text-black mb-1">
        Welcome back to Fero Events
      </h2>
      <p className="text-center text-secondary mb-6">
        Log in to manage your events, stream content, and connect with your
        audience.
      </p>

      <div className=" flex mx-auto items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">
                      <p>
                        Email Address<span className="text-red-600">*</span>
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className=" text-black border-border! active:border-primary! focus:border-primary! bg-transparent!"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className=" text-black border-border! active:border-primary! focus:border-primary! bg-transparent!"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2 text-sm"
                          onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? (
                            <FaEyeSlash
                              name="eyeClose"
                              className="text-primary"
                              size={18}
                            />
                          ) : (
                            <FaEye
                              name="eyeOpen"
                              size={18}
                              className="text-primary"
                            />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end text-sm">
                <Link
                  href="/forgot-password"
                  className="text-black underline italic">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer text-white"
                disabled={loading}>
                {loading ? (
                  <span className="relative flex h-4 w-4 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-200"></span>
                  </span>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* <LoginComp /> */}

      <div className="flex items-center mt-7 mb-12">
        <hr className="grow border-2 border-line" />
        <span className="mx-2 text-foreground text-sm">Or</span>
        <hr className="grow border-2 border-line" />
      </div>

      <div className="w-full border rounded flex justify-center items-center py-2">
        <SocialAuth authType="signin" />
      </div>

      <p className="text-center text-sm text-black mt-5">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary link font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginComp;
