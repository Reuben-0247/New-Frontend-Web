/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast, ToastContent } from "react-toastify";
// import { api } from "@/lib/axios";
// import Cookies from "js-cookie";
// import { TOKEN_NAME, USER_ID } from "@/utils/constant";
import { AxiosError } from "axios";
import { formatError } from "@/utils/helper";
import Link from "next/link";

const formSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
});

const AuthenticationForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  // const [otpAttempts, setOtpAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      // const { data } = await api.post("/auth/verify-otp", values);
      // if (data) {
      //   toast.success("OTP verified successfully!");
      //   Cookies.set(TOKEN_NAME, data.token);
      //   Cookies.set(USER_ID, data.id);
      //   setLoading(false);
      //   if (data.role === "Inspector") {
      //     router.push("/inspections");
      //   } else if (data.role === "Handler") {
      //     router.push("/issues");
      //   } else {
      //     router.push("/dashboard");
      //   }
      // }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError?.message as ToastContent);
      // setOtpAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  flex items-center justify-center ">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-primary link font-semibold ">
            <img
              src="/svgs/Fero_logo_dark.svg"
              alt="Fero Events Logo"
              className="h-[70px] object-cover"
            />
          </Link>
        </div>

        <h2 className="text-2xl mb-2 text-center font-bold text-gray-900 ">
          Verify Your Email
        </h2>
        {/* <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="mb-8 cursor-pointer">
          <FiArrowLeft className="h-4 w-4" />
        </Button> */}

        <div className="mb-8 text-center text-black">
          {/* <p className="text-2xl md:text-4xl font-semibold text-black">
            Confirm that it&apos;s you
          </p> */}
          <p>
            We&apos;ve sent a 6-digit code to{" "}
            <span className="text-primary font-bold">{email}</span> enter it
            below to verify your email address.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={form.watch("otp")}
                onChange={(value) => form.setValue("otp", value)}>
                {[...Array(6)].map((_, index) => (
                  <InputOTPGroup key={index}>
                    <InputOTPSlot
                      index={index}
                      className="bg-transparent! text-black!"
                    />
                  </InputOTPGroup>
                ))}
              </InputOTP>
            </div>

            <FormMessage>{form.formState.errors.otp?.message}</FormMessage>

            <Button
              className="w-full cursor-pointer mt-4 bg-primary text-white"
              size="lg"
              type="submit"
              disabled={loading}>
              {loading ? (
                <span className="relative flex h-4 w-4 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-50 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-200"></span>
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthenticationForm;
