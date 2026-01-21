/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
// import StreamLinks from "../components/StreamLinks";
import styled from "styled-components";
import { MenuIcon } from "lucide-react";
import axiosApi from "@/lib/axios";
import { toast, ToastContent } from "react-toastify";
import { Button } from "@/components/ui/button";
import ModalComp from "@/app/components/ModalComp";
import { AxiosError } from "axios";
import { formatError } from "@/utils/helper";
import { useAuthStore } from "@/app/store/auth.store";
// import Swal from "sweetalert2";
// import { AxiosForm } from "../../Utils/AxiosConfig";
// import Config from "../../Config.json";
// import { Modal, Button } from "react-bootstrap";

interface IPlans {
  id: number;
  name: string;
  canseled: string;
  amount: number;
  billingCycle: string;
  yearly: string;
  features: {
    label: string;
    value: boolean | string;
  }[];
}
const plans: IPlans[] = [
  {
    id: 1,
    name: "Bronze",
    canseled: "₦100",
    amount: 900,
    billingCycle: "Monthly",

    yearly: "Billed ₦10000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
  {
    id: 2,
    name: "Silver",
    canseled: "₦200",
    amount: 1800,
    billingCycle: "Monthly",

    yearly: "Billed ₦20000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
  {
    id: 3,
    name: "Gold",
    canseled: "₦500",
    amount: 4500,
    billingCycle: "Monthly",

    yearly: "Billed ₦50000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
  {
    id: 4,
    name: "Daimond",
    canseled: "₦1000",
    amount: 9000,
    billingCycle: "Monthly",

    yearly: "Billed ₦100000 yearly",
    features: [
      { label: "Create and share Resources", value: true },
      { label: "SRT/RTMP Pull links", value: true },
      { label: "Live clipping", value: true },
      { label: "Cloud recording", value: true },
      { label: "Adaptive Bitrate", value: true },
      { label: "Ultra low latency", value: true },
      { label: "Video storage", value: "200 GB" },
      { label: "Allocated bandwidth", value: "500 GB" },
      { label: "Multiple stream destinations", value: "10 Destinations" },
    ],
  },
];

function PricingPage() {
  const [pay, setPay] = useState(false);
  // const userDetailsString = sessionStorage.getItem("userDetails");
  // const userData = userDetailsString ? JSON.parse(userDetailsString) : null;
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPlans>();
  const [input, setInput] = useState("Monthly");
  const [amount, setAmount] = useState(selectedPlan?.amount);
  const { auth } = useAuthStore();
  const selectPlan = (plan: IPlans) => {
    setSelectedPlan(plan);
    setShow(true);
    setInput("Monthly");
    setAmount(plan?.amount);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  function formatNaira(amount: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  const payNow = async () => {
    // console.log(userData);

    try {
      const payload = {
        email: auth?.email,
        userId: auth?._id,
        paymentPlan: selectedPlan?.name.toLowerCase(),
        billingCycle: input.toLowerCase(),
        amount: amount,
      };
      setLoading(true);

      const { data } = await axiosApi.post(`/payments/initialize`, payload);

      if (data) {
        toast.success("Payment initialized successfully!", {
          delay: 3000,
          position: "top-right",
        });

        setLoading(false);
        handleClose();

        window.location.href = data.data.authorization_url;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const formattedError = formatError(axiosError);
      toast.error(formattedError.response as ToastContent);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className=" ">
        <div className="w-full pricing">
          <div className=" overflow-y-hidden w-full pt-12 flex flex-col font-Nunito  text-foreground px-4 py-12">
            <div className="text-center mb-10 mt-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                <span className="text-blue-400">Choose</span> your Perfect Plan
                with Fero Event
              </h2>
            </div>
            <div className="plans grid md:grid-cols-2 grid-cols-1 gap-6">
              {plans.map((plan) => (
                <div
                  className="item p-4 rounded-2xl text-white bg-[#00061A]"
                  key={plan.id}>
                  <div>{plan.name}</div>

                  <p className="flex items-center gap-1 m-0">
                    <span className="line-through text-white">
                      {plan.canseled}
                    </span>
                    <span className="text-[#0062FF]">{plan.amount} </span> -{" "}
                    {plan.billingCycle}
                  </p>
                  {/* <div className="mt-4">{plan.price}</div> */}
                  <div className="mb-6 text-sm">{plan.yearly}</div>
                  <hr />
                  <div className="features">
                    {plan.features.map((f, i) => (
                      <div className="content" key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="">{f.label}</span>
                          <span>
                            {f.value === true ? (
                              <img src="/images/verify.png" alt="" />
                            ) : (
                              f.value
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full mt-4">
                    <Button
                      // variant="primary"
                      onClick={() => selectPlan(plan)}
                      className="text-center rounded-lg mb-4 bg-[#0062FF] px-2 h-[45px] w-full ">
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ModalComp
            loading={loading}
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
          </ModalComp>

          <ModalComp
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
          </ModalComp>
        </div>
      </div>
    </Wrapper>
  );
}

export default PricingPage;

const Wrapper = styled.div``;
