/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {} from "react-hook-form";
import { cn } from "@/lib/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import axiosApi from "@/lib/axios";
import { toast, ToastContent } from "react-toastify";
import { formatError } from "@/utils/helper";
const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword: React.FC<{ email: string }> = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  //   const [accept, setAccept] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const payload = {
      email: email,
      password: values.password,
    };

    // console.log("Final Payload:", payload);

    try {
      // send payload, not values
      await axiosApi.post("/auth/reset-password", payload);

      toast.success("Password reset successfully!");
      router.push(`/login`);
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError?.message as ToastContent);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-center mb-6">
        <Link href="/" className="text-primary link font-semibold ">
          <img
            src="/svgs/Fero_logo_dark.svg"
            alt="Fero Events Logo"
            className="h-[70px] object-cover"
          />
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-center  text-black mb-8">
        Reset Your Password
      </h2>

      <div className=" flex mx-auto items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black!">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className={cn(
                            "text-black! border-border! active:border-primary! focus:border-primary! bg-transparent!",
                            form.formState.errors.password && "border-red-500!",
                          )}
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black!">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword2 ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className={cn(
                            "text-black! border-border! active:border-primary! focus:border-primary! bg-transparent!",
                            form.formState.errors.confirmPassword &&
                              "border-red-500!",
                          )}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2 text-sm"
                          onClick={() => setShowPassword2((prev) => !prev)}>
                          {showPassword2 ? (
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

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
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
