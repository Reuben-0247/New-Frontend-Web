"use client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import axiosApi from "@/lib/axios";
import { toast, ToastContent } from "react-toastify";
import { AxiosError } from "axios";
import { detectCurrency, formatError, formatUSD } from "@/utils/helper";
import { useAuthStore } from "@/app/store/auth.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/app/store/theme.store";

function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { auth } = useAuthStore();
  const { theme } = useThemeStore();
  const [billing, setBilling] = useState<"Month" | "Yearly">("Month");
  const [currency, setCurrency] = useState<"NGN" | "USD">("USD");
  const [resolvedTheme, setResolvedTheme] = useState<string | null>(null);

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  useEffect(() => {
    setResolvedTheme(theme);
  }, [theme]);

  const isMonthly = billing === "Month";

  const plans = useMemo(() => {
    return [
      {
        id: 1,
        name: "Basic",
        amount: isMonthly ? 22350 : 212940,
        billingCycle: isMonthly ? "Monthly" : "Yearly",
        usd: isMonthly ? 14.97 : 141.92,
        features: [
          { label: "Create and share Resources", value: true },
          { label: "Live streaming (HD Video)", value: true },
          { label: "Live clipping", value: true },
          { label: "Livestream to VOD", value: true },
          { label: "Adaptive Bitrate", value: true },
          { label: "Ultra low latency", value: true },
          {
            label: (
              <p>
                Cloud storage{" "}
                <span className="text-yellow-300 font-bold">(100GB)</span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Allocated bandwidth{" "}
                <span className="text-yellow-300  font-bold">
                  {isMonthly ? "(150GB)" : "(1.8TB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Multiple stream{" "}
                <span className="text-yellow-300 font-bold">
                  {isMonthly ? "(5)" : "(6)"}
                </span>{" "}
                destinations
              </p>
            ),
            value: true,
          },
        ],
      },
      {
        id: 2,
        name: "Intermediate",
        amount: isMonthly ? 67455 : 639573,
        billingCycle: isMonthly ? "Monthly" : "Yearly",
        usd: isMonthly ? 44.98 : 426.32,
        features: [
          { label: "Create and share Resources", value: true },
          { label: "Live streaming (HD Video)", value: true },
          { label: "Live clipping", value: true },
          { label: "Livestream to VOD", value: true },
          { label: "Adaptive Bitrate", value: true },
          { label: "Ultra low latency", value: true },
          {
            label: (
              <p>
                Cloud storage{" "}
                <span className="text-[#07c24f] font-bold">
                  {isMonthly ? "(250GB)" : "(250GB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Allocated bandwidth{" "}
                <span className="text-[#07c24f] font-bold">
                  {isMonthly ? "(500GB)" : "(6TB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Multiple stream{" "}
                <span className="text-[#07c24f] font-bold">
                  {isMonthly ? "(10)" : "(10)"}
                </span>{" "}
                destinations
              </p>
            ),
            value: true,
          },
        ],
      },
      {
        id: 3,
        name: "Advanced",
        amount: isMonthly ? 134955 : 1279373,
        billingCycle: isMonthly ? "Monthly" : "Yearly",
        usd: isMonthly ? 89.97 : 852.92,
        features: [
          { label: "Create and share Resources", value: true },
          { label: "Live streaming (HD Video)", value: true },
          { label: "Live clipping", value: true },
          { label: "Livestream to VOD", value: true },
          { label: "Adaptive Bitrate", value: true },
          { label: "Ultra low latency", value: true },
          {
            label: (
              <p>
                Cloud storage{" "}
                <span className="text-[#0896ee] font-bold">
                  {isMonthly ? "(1TB)" : "(1.2TB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Allocated bandwidth{" "}
                <span className="text-[#0896ee] font-bold">
                  {isMonthly ? "(1.5TB)" : "(18TB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Multiple stream{" "}
                <span className="text-[#0896ee] font-bold">
                  {isMonthly ? "(15)" : "(15)"}
                </span>{" "}
                destinations
              </p>
            ),
            value: true,
          },
        ],
      },
      {
        id: 4,
        name: "Premium",
        amount: isMonthly ? 299955 : 2843573,
        billingCycle: isMonthly ? "Monthly" : "Yearly",
        usd: isMonthly ? 199.97 : 1895.72,
        features: [
          { label: "Create and share Resources", value: true },
          { label: "Live streaming (HD Video)", value: true },
          { label: "Live clipping", value: true },
          { label: "Livestream to VOD", value: true },
          { label: "Adaptive Bitrate", value: true },
          { label: "Ultra low latency", value: true },
          {
            label: (
              <p>
                Cloud storage{" "}
                <span className="text-[#cc070a] font-bold">
                  {isMonthly ? "(2TB)" : "(2TB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Allocated bandwidth{" "}
                <span className="text-[#cc070a] font-bold">
                  {isMonthly ? "(3TB)" : "(36TB)"}
                </span>
              </p>
            ),
            value: true,
          },
          {
            label: (
              <p>
                Multiple stream{" "}
                <span className="text-[#cc070a] font-bold">
                  {isMonthly ? "(20)" : "(20)"}
                </span>{" "}
                destinations
              </p>
            ),
            value: true,
          },
        ],
      },
    ];
  }, [isMonthly]);

  function formatNaira(amount: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  const payNow = async (
    plan: string,
    circle: string,
    amount: number,
    usd: number,
  ) => {
    try {
      const payload = {
        email: auth?.email,
        userId: auth?._id,
        paymentPlan: plan,
        billingCycle: circle?.toLowerCase(),
        amount: currency === "NGN" ? amount : usd,
      };
      setLoading(plan);
      const { data } = await axiosApi.post<{
        data: {
          access_code: string;
          authorization_url: string;
          reference: string;
        };
      }>(`/payments/initialize`, payload);
      // const { data } = await axiosApi.get(`/payments/verify/rootsxz0gw`);

      if (data) {
        toast.success("Payment initialized successfully!", {
          delay: 3000,
          position: "top-right",
        });

        setLoading(null);
        console.log(data);
        window.location.assign(data.data.authorization_url);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.message as ToastContent);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Wrapper>
      <div className=" ">
        <div className="w-full pricing">
          <div className="md:col-span-2">
            <p className="text-xl font-semibold leading-6 text-foreground">
              Pricing Page
            </p>
            <p className="mt-1 truncate text-sm leading-5 text-foreground">
              Manage all your{" "}
              <span className="text-primary font-semibold">Fero Event</span>{" "}
              subscriptions across different plans.
            </p>
          </div>
          <div className=" overflow-y-hidden w-full pt-12 flex flex-col font-Nunito  text-foreground px-4 py-12">
            <div className="text-center mb-10 mt-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                <span className="text-blue-400">Choose</span> your Perfect Plan
                with Fero Event
              </h2>
            </div>
            <div className="flex justify-center w-full mb-8">
              <div className="flex items-center gap-6 border rounded-md p-2">
                <Button
                  variant={isMonthly ? "default" : "outline"}
                  onClick={() => setBilling("Month")}>
                  Monthly
                </Button>

                <Button
                  variant={!isMonthly ? "default" : "outline"}
                  onClick={() => setBilling("Yearly")}>
                  Annually
                </Button>
              </div>
            </div>
            <div className="plans grid md:grid-cols-4 grid-cols-1 gap-6">
              {plans.map((plan) => {
                //   const price = currency === "NGN" ? plan.amount : plan.usd;
                return (
                  <div
                    className={`item payment-card px-4 py-2 bg-background text-foreground rounded-2xl ${
                      plan.name === "Intermediate"
                        ? "intermediat"
                        : plan.name === "Premium"
                          ? " premium "
                          : plan.name === "Advanced"
                            ? "advanced"
                            : plan.name === "Basic"
                              ? "basic"
                              : ""
                    }`}
                    key={plan.id}>
                    <div className={`mb-4`}>
                      <Badge
                        className={`font-bold ${
                          plan.name === "Intermediate"
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : plan.name === "Premium"
                              ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100"
                              : plan.name === "Advanced"
                                ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                                : plan.name === "Basic"
                                  ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-100"
                                  : ""
                        }`}>
                        {plan.name?.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="flex items-center gap-1 m-0 mb-4">
                      {currency === "NGN"
                        ? formatNaira(plan.amount)
                        : formatUSD(plan.usd)}
                    </p>
                    <p>{plan.billingCycle?.toUpperCase()}</p>
                    <div className="w-full my-4 sub-button">
                      <Button
                        className={`btn font-bold ${
                          plan.name === "Intermediate"
                            ? "intermediate  bg-[#126833] dark:text-blue-300"
                            : plan.name === "Premium"
                              ? " premium  bg-red-950 dark:text-red-100"
                              : plan.name === "Advanced"
                                ? "advanced  bg-[#055c92] dark:text-sky-300"
                                : plan.name === "Basic"
                                  ? "basic  bg-yellow-700 dark:text-yellow-300"
                                  : ""
                        } text-cente  rounded-lg mb-4  px-2  w-full `}
                        disabled={loading === plan.name}
                        onClick={() =>
                          payNow(
                            plan.name,
                            plan.billingCycle,
                            (currency === "NGN" && plan.amount) || 0,
                            (currency !== "NGN" && plan.usd) || 0,
                          )
                        }>
                        {loading === plan.name ? "Loading..." : "Subscribe"}
                      </Button>
                    </div>
                    <hr />
                    <div className="features mt-4">
                      {plan.features.map((f, i) => (
                        <div className="content" key={i}>
                          <div className="flex justify-between  my-2">
                            <span className="font-semibold text-sm">
                              {f.label}
                            </span>
                            <span>
                              {f.value === true ? (
                                <svg
                                  width="19"
                                  height="19"
                                  viewBox="0 0 19 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.841 0.589553C9.90972 -0.196518 8.54732 -0.196517 7.616 0.589553L6.76784 1.30544C6.372 1.63954 5.88217 1.84245 5.36602 1.8861L4.26007 1.97963C3.04569 2.08233 2.08233 3.04569 1.97963 4.26007L1.8861 5.36602C1.84245 5.88217 1.63954 6.372 1.30544 6.76785L0.589553 7.616C-0.196518 8.54732 -0.196517 9.90972 0.589553 10.841L1.30544 11.6892C1.63954 12.085 1.84245 12.5749 1.8861 13.091L1.97963 14.197C2.08233 15.4114 3.04569 16.3748 4.26007 16.4774L5.36602 16.5709C5.88217 16.6146 6.372 16.8175 6.76785 17.1516L7.616 17.8675C8.54732 18.6535 9.90972 18.6535 10.841 17.8675L11.6892 17.1516C12.085 16.8175 12.5749 16.6146 13.091 16.5709L14.197 16.4774C15.4114 16.3748 16.3748 15.4114 16.4774 14.197L16.5709 13.091C16.6146 12.5749 16.8175 12.085 17.1516 11.6892L17.8675 10.841C18.6535 9.90972 18.6535 8.54732 17.8675 7.616L17.1516 6.76784C16.8175 6.372 16.6146 5.88217 16.5709 5.36602L16.4774 4.26007C16.3748 3.04569 15.4114 2.08233 14.197 1.97963L13.091 1.8861C12.5749 1.84245 12.085 1.63954 11.6892 1.30544L10.841 0.589553ZM13.7745 7.52407C14.2139 7.08473 14.2139 6.37242 13.7745 5.93308C13.3353 5.49373 12.6229 5.49373 12.1835 5.93308L7.97905 10.1376L6.27455 8.43308C5.83522 7.99373 5.1229 7.99373 4.68357 8.43308C4.24422 8.87242 4.24422 9.58473 4.68357 10.0241L7.18357 12.524C7.6229 12.9634 8.33522 12.9634 8.77455 12.524L13.7745 7.52407Z"
                                    fill={
                                      resolvedTheme !== "dark"
                                        ? "#000000"
                                        : "#FFFFFF"
                                    }
                                  />
                                </svg>
                              ) : (
                                // <img src="/images/verify.png" alt="" />
                                f.value
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* <ModalComp
            loading={loading===plan}
            open={pay}
            onClose={() => setPay(false)}
            onSave={() => {
              payNow();
            }}
            saveText="Continue"
            header="Payment">
            <div className="modal-body">
              Are you sure you want to proceed with payment?
            </div>
          </ModalComp> */}

          {/* <ModalComp
            open={show}
            onClose={() => setShow(false)}
            onSave={() => {
              setShow(false);
              setPay(true);
            }}
            saveText="Pay Now"
            header={selectedPlan?.name}>
            <div className="modal-body">
              <div className="mt-4 mb-2">
                <span>Amout:</span>{" "}
                <span className="font-semibold">
                  {formatNaira(amount || 0)}
                </span>
              </div>
              <div className="mb-6 text-sm flex gap-4">
                <label className="">Billing Cycle:</label>

                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="billingCycle"
                    value="Monthly"
                    checked={input === "Monthly"}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setAmount(Number(selectedPlan?.amount));
                    }}
                  />
                  <label>Monthly</label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="billingCycle"
                    value="Yearly"
                    checked={input === "Yearly"}
                    onChange={(e) => {
                      setInput(e.target.value);
                      const plan = selectedPlan?.yearly.split(" ") || "";
                      const getAmount = plan[1].replace("₦", "");

                      setAmount(Number(getAmount));
                    }}
                  />
                  <label>Yearly</label>
                </div>
              </div>
            </div>
          </ModalComp> */}
        </div>
      </div>
    </Wrapper>
  );
}

export default PricingPage;

const Wrapper = styled.div``;
