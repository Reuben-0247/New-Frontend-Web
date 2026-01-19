"use client";
import CreateEventForm from "@/app/components/_dashboard/CreateEventForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CreateEventPage = () => {
  const router = useRouter();
  return (
    <div className=" overflow-y-hidden ">
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={() => router.back()}
          variant={"outline"}
          className="cursor-pointer">
          <ArrowLeft /> Back
        </Button>
        <p className="text-2xl font-bold">Create Event Page</p>
      </div>
      <CreateEventForm />
    </div>
  );
};

export default CreateEventPage;
