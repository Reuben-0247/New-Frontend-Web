"use client";
import React, { useState } from "react";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContent, toast } from "react-toastify";
// import Cookies from "js-cookie";
// import axiosApi from "@/lib/axios";
import { AxiosError } from "axios";

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
import { useRouter } from "next/navigation";
import { formatError } from "@/utils/helper";
// import Cookies from "js-cookie";
// import { TOKEN_NAME } from "@/utils/constant";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SocialAuth from "./SocialAuth";
import { cn } from "@/lib/utils";
import axiosApi from "@/lib/axios";
const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address. Please check and try again"),

    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
const SignupComp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accept, setAccept] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    // console.log("Final Payload:", payload);

    try {
      // send payload, not values
      const { data } = await axiosApi.post("/auth/signup", payload);
      if (data) {
        router.push("/signup/authentication");

        toast.success("Account created successfully!");
      }
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    <p>
                      First Name<span className="text-red-600">*</span>
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your first name"
                      {...field}
                      className={cn(
                        "text-foreground border-border! active:border-primary! focus:border-primary!",
                        form.formState.errors.firstName && "border-red-500!",
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    <p>
                      Last Name<span className="text-red-600">*</span>
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your last name"
                      {...field}
                      className={cn(
                        "text-foreground border-border! active:border-primary! focus:border-primary!",
                        form.formState.errors.lastName && "border-red-500!",
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  <p>
                    Email Address<span className="text-red-600">*</span>
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className={cn(
                      "text-foreground border-border! active:border-primary! focus:border-primary!",
                      form.formState.errors.email && "border-red-500!",
                    )}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className={cn(
                          "text-foreground border-border! active:border-primary! focus:border-primary!",
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
                  <FormLabel className="text-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword2 ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className={cn(
                          "text-foreground border-border! active:border-primary! focus:border-primary!",
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
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              checked={accept}
              onChange={() => setAccept(!accept)}
            />
            <label className="text-sm text-secondary">
              Agree to terms and privacy
            </label>
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
      <div className="my-6 flex items-center">
        <hr className="grow border-t" />
        <span className="mx-2 text-foreground">Or</span>
        <hr className="grow border-t" />
      </div>

      <div className="w-full border rounded flex justify-center items-center py-2">
        <SocialAuth authType="signup" />
      </div>
      <p className="text-center text-sm text-gray-600 mt-4">
        Have an account?{" "}
        <Link href="/login" className="text-blue-600 font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupComp;
