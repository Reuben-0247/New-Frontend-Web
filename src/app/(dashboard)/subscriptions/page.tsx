/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { UsageProgress } from "@/app/components/_dashboard/GrantProgress";
import Reciept from "@/app/components/_dashboard/Reciept";
import { IPayment, IPaymentPrint } from "@/app/interfaces/payment.interface";
import { ISubscription } from "@/app/interfaces/subscription.interface";
import { useAuthStore } from "@/app/store/auth.store";
import { useSubscriptionStore } from "@/app/store/subscription.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axiosApi from "@/lib/axios";
import { formatDateTime, formatNaira } from "@/utils/helper";
import { Download, View, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const SubscriptionPage = () => {
  const { subscription, payments, setSub, setPayments } =
    useSubscriptionStore();
  const { auth } = useAuthStore();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [subData, setSubData] = React.useState<IPaymentPrint | null>(null);
  const [viewSubData, setViewSubData] = React.useState<IPaymentPrint | null>(
    null,
  );
  const printReceipt = useReactToPrint({
    contentRef,
  });
  const tableCol = [
    {
      id: 1,
      name: "Plan",
    },
    {
      id: 2,
      name: "Amount",
    },
    {
      id: 3,
      name: "Currency",
    },
    {
      id: 4,
      name: "Cycle",
    },
    {
      id: 5,
      name: "Date",
    },
    {
      id: 6,
      name: "Status",
    },
    // {
    //   id: 7,
    //   name: "",
    // },
  ];
  const printSubData = (data: IPayment) => {
    setSubData({
      ...data,
      firstName: auth?.firstName || "",
      lastName: auth?.lastName || "",
      subscribedAt: subscription?.periodStart || "",
      subscriptionEndDate: subscription?.periodEnd || "",
      billingCycle: data?.metadata?.billingCycle || "",
      paymentPlan: data?.metadata?.paymentPlan || "",
    });
  };

  useEffect(() => {
    if (subData) {
      printReceipt();
    }
  }, [subData]);

  const viewData = (data: IPayment) => {
    setViewSubData({
      ...data,
      firstName: auth?.firstName || "",
      lastName: auth?.lastName || "",
      subscribedAt: subscription?.periodStart || "",
      subscriptionEndDate: subscription?.periodEnd || "",
      billingCycle: data?.metadata?.billingCycle || "",
      paymentPlan: data?.metadata?.paymentPlan || "",
    });
  };

  useEffect(() => {
    (async () => {
      if (payments.length || subscription?._id) return;
      if (!auth?._id) return;
      try {
        const { data } = await axiosApi.get<{
          payments: IPayment[];
          subscription: ISubscription;
          freeSub: ISubscription;
        }>(`/payments/user-payments/${auth?._id}`);
        if (data.subscription) {
          setSub(data.subscription);
        } else {
          setSub(data.freeSub);
        }
        setPayments(data.payments);
      } catch (error) {
        console.error("Error fetching subs", error);
      }
    })();
  }, [auth?._id, setPayments, setSub]);

  return (
    <div className="relative">
      <div className="md:col-span-2 mb-8">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold leading-6 text-foreground">
            Subscription
          </p>
          {!payments.length && (
            <Link
              href={"/pricing"}
              className=" bg-primary rounded-md px-4 py-1 text-white">
              Subscribe!
            </Link>
          )}
        </div>
        <p className="mt-1 truncate text-sm leading-5 text-foreground">
          Subscribe and manage your subscription across the application and
          streams.
        </p>
      </div>
      <div className="sub">
        <div className="details mb-8 grid md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold ">Current subscription</p>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {subscription?.paymentPlan || "N/A"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Status:
                    <span className="font-semibold text-gray-900 dark:text-white">
                      <Badge
                        className={`${subscription?.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"}`}>
                        {subscription?.status || "Exhausted"}
                      </Badge>
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
                    Auto-renew: {"disabled"}
                  </p>
                  <div className="flex gap-4 justify-end">
                    <Switch disabled />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatNaira(payments[0]?.amount || 0) || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-500">Expiring Date</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {formatDateTime(subscription?.periodEnd || "") || "Not set"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-500">Reference</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {subscription?.paymentReference || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
            <UsageProgress
              granted={
                subscription?.granted || { storageGB: 0, bandwidthGB: 0 }
              }
              used={subscription?.used || { storageGB: 0, bandwidthGB: 0 }}
              remaining={
                subscription?.remaining || { storageGB: 0, bandwidthGB: 0 }
              }
            />
          </div>
        </div>
        <h3 className="text-muted-foreground mb-2">Payment</h3>
        {payments.length > 0 ? (
          <div className="w-[400px] md:w-full overflow-x-auto scroll-smooth scrollbar-hide dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg bg-background shadow-md">
            <table className="w-[400px] md:w-full text-sm text-left text-foreground">
              <thead className="font-bold">
                <tr className="border-b border-border">
                  {tableCol?.map((th) => (
                    <th
                      key={th?.id}
                      className="px-4 py-3 font-bold text-muted-foreground whitespace-nowrap">
                      {th?.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {payments?.map((pay, index) => (
                  <tr
                    key={pay?._id}
                    className={`
            transition-colors
            hover:bg-hover
            ${index % 2 === 0 ? "bg-background" : "bg-dash-gray"}
          `}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {pay?.metadata?.paymentPlan}
                    </td>

                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {formatNaira(pay?.amount)}
                    </td>

                    <td className="px-4 py-3 uppercase text-xs text-muted-foreground whitespace-nowrap">
                      {pay?.currency}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {pay?.metadata?.billingCycle}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(pay?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* <td ></td> */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-between items-center ga-4">
                        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                          {pay?.status}
                        </Badge>
                        <div className="flex items-center gap-4 text-muted-foreground z-30">
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            onClick={() => viewData(pay)}>
                            <View size={15} />
                          </Button>
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            onClick={() => printSubData(pay)}>
                            <Download size={15} />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center">
            <p>You have no active subscription</p>
          </div>
        )}
      </div>
      {viewSubData && (
        <div className="absolute top-20  left-0 w-full h-full bg-black opacity-95 z-30 flex justify-center items-center">
          <div className="bg-white rounded-md ">
            <div className="flex justify-end w-full px-4 shadow-2xl">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setViewSubData(null)}>
                <X size={30} className="text-black z-40" />
              </Button>
            </div>
            <div className="">
              <Reciept resData={viewSubData} />
            </div>
          </div>
        </div>
      )}

      <div className="hidden">
        <div ref={contentRef}>
          <Reciept resData={subData} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
