"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";
import { formatError } from "@/utils/helper";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/utils/constant";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address. Please check and try again"),
  password: z.string().min(4, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginComp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      Cookies.set(TOKEN_NAME, token);
    }
  }, [searchParams]);

  // const email = form.watch("email");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      // const { data } = await axiosApi.post<{ message: string }>(
      //   "/auth/login",
      //   values
      // );
      console.log("Login response:", values);

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

  return (
    <div className=" flex mx-auto items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      className=" text-foreground border-border! active:border-primary! focus:border-primary!"
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
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className=" text-foreground border-border! active:border-primary! focus:border-primary!"
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
                className="text-foreground underline italic">
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
  );
};

export default LoginComp;
