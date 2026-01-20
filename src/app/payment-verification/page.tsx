"use client";
import React, { useEffect, useState, useRef } from "react";
// import { useRoutes, useSearchParams, useNavigate } from "react-router-dom";
// import { ReactComponent as Logo } from "/svg/logof.svg";
import { useReactToPrint } from "react-to-print";
import axiosApi from "@/lib/axios";
import ModalComp from "../components/ModalComp";
import Reciept from "../components/_dashboard/Reciept";
import { Button } from "@/components/ui/button";
import { Spinner } from "../components/Spinner";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentVerify = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [resData, setResData] = useState({});
  //   const [isPrinted, setIsPrinted] = useState(false);
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const printReceipt = useReactToPrint({
    contentRef,
  });

  const goHome = () => {
    setShow(false);
    // setIsPrinted(false);
    setShow(false);
    navigate.push("/pricing");
    // setResData({});
  };
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosApi.get(`/payments/verify/${reference}`);
        if (data) {
          setResData(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white  p-6">
      <div className="modal-body">
        <div className="flex justify-between mb-8">
          <Button
            variant="secondary"
            className="text-white"
            onClick={() => setShow(true)}>
            Back
          </Button>
          <Button
            className="text-white"
            variant={"default"}
            onClick={printReceipt}>
            Print
          </Button>
        </div>
        {resData && (
          <div ref={contentRef}>
            <Reciept resData={resData} />
          </div>
        )}
      </div>
      <ModalComp
        open={show}
        onClose={() => setShow(false)}
        onSave={() => {
          setShow(false);
          goHome();
        }}
        saveText="Continue"
        header="">
        <div className="modal-body">
          Are you sure you want to go back without printing?
        </div>
      </ModalComp>
    </div>
  );
};

export default PaymentVerify;
