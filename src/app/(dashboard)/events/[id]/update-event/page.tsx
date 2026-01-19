/* eslint-disable react-hooks/set-state-in-effect */
"use client";
/* eslint-disable @next/next/no-img-element */
import { ICategory } from "@/app/interfaces/category.interface";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axiosApi from "@/lib/axios";
import { ArrowLeft, MapPin, UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useEventStore } from "@/app/store/event.store";
import { useRouter } from "next/navigation";
import { UpdateEventFormInput } from "@/app/interfaces/event.interface";
import { formatDateInput } from "@/utils/helper";

const UodateEventPage: React.FC = () => {
  const router = useRouter();
  const { updateEvent, loading, event } = useEventStore();
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [displayImageFile, setDisplayImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const form = useForm<UpdateEventFormInput>({
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      requirePassword: false,
      featuredEvent: false,
      password: "",
      location: {
        type: "Online",
        address: "",
      },
    },
  });

  useEffect(() => {
    if (!event) return;
    setDisplayImage(event.displayImage ?? null);
    form.reset({
      title: event.title,
      categoryId: event.categoryId,
      description: event.description,
      startDate: formatDateInput(event?.startDate || ""),
      endDate: formatDateInput(event?.endDate || ""),
      startTime: event.startTime,
      endTime: event.endTime,
      requirePassword: event.requirePassword,
      featuredEvent: event.featuredEvent,
      password: "",
      location: {
        type: event.location.type,
        address: event.location.address ?? "",
      },
    });
  }, [event, form]);

  useEffect(() => {
    return () => {
      if (displayImage?.startsWith("blob:")) {
        URL.revokeObjectURL(displayImage);
      }
    };
  }, [displayImage]);

  const watchEventType = useWatch({
    control: form.control,
    name: "location.type",
  });

  const watchRequirePassword = useWatch({
    control: form.control,
    name: "requirePassword",
  });

  useEffect(() => {
    if (watchEventType === "Online") {
      form.setValue("location.address", "");
    }
  }, [watchEventType, form]);

  useEffect(() => {
    if (!watchRequirePassword) {
      form.setValue("password", "");
    }
  }, [watchRequirePassword, form]);

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await axiosApi.get(`/categories`);
      setCategories(data.data.categories || []);
    };
    getCategories();
  }, []);

  async function onSubmit(values: UpdateEventFormInput) {
    await updateEvent(
      {
        ...values,
        type: "publish",
        location: {
          type: values.location.type,
          address: values.location.address ?? "",
        },
      },
      displayImageFile ?? undefined
    );
    form.reset();
    router.push(`/events?tab=Published`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => router.back()}
          className="text-foreground font-semibold cursor-pointer">
          <ArrowLeft /> <span>Back</span>
        </Button>
        <p className="font-bold text-2xl text-foreground">Update Event</p>
      </div>
      <Form {...form}>
        <div className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <label
            htmlFor="image-upload"
            className="rounded-lg  bg-gray-100 hover:bg-blue-50 flex dark:bg-gray-800 dark:hover:bg-gray-700 flex-col items-center justify-center gap-2 h-40 cursor-pointer transition ">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Uploaded"
                className="object-cover h-full w-full rounded-lg"
              />
            ) : (
              <div className="flex items-center gap-3">
                <UploadIcon />
                <span className="text-foreground">Click to add image</span>
              </div>
            )}
          </label>

          <input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setDisplayImageFile(file);
              setDisplayImage(url);
            }}
          />

          <div className="grid md:grid-cols-2 gap-4 grid-cols-1 ">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Event Title" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-full!">
                  <FormLabel>
                    Category<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="w-full! ">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full!">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event description" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 grid-cols-1 ">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full! block!" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full! block!" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time *</FormLabel>
                  <FormControl className="w-full">
                    <Input type="time" {...field} className="w-full! block!" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="w-full! block!" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
            <FormField
              control={form.control}
              name="location.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}>
                    {["Online", "Hybrid"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={option}
                          className="border-2"
                        />
                        <label htmlFor={option} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <div
                      className={`${
                        watchEventType === "Online"
                          ? "cursor-not-allowed"
                          : "cursor-text"
                      } w-full dark:bg-[#27314e4d ]  h-10 px-3 rounded-md border dark:border-[#7e85994d] border-[#06080e4d] mt-4 flex justify-between items-center text-sm`}>
                      <Input
                        {...field}
                        placeholder="Enter event location"
                        disabled={watchEventType === "Online"}
                        className={`outline-none! border-0! focus:border-0! focus:ring-0! active:border-0! bg-transparent! w-full `}
                      />
                      <MapPin className="text-gray-600 w-5 h-5" />
                    </div>
                  </FormControl>
                  {watchEventType === "Hybrid" && (
                    <FormMessage className="text-red-500" />
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
            <FormField
              control={form.control}
              name="requirePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Require password?</FormLabel>
                  <RadioGroup
                    value={field.value ? "Yes" : "No"}
                    onValueChange={(val) => field.onChange(val === "Yes")}>
                    {["Yes", "No"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={option}
                          className="border-2"
                        />
                        <label htmlFor={option} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter password"
                      {...field}
                      disabled={watchRequirePassword === false}
                      // className={`${
                      //   watchRequirePassword
                      //     ? "cursor-not-allowed"
                      //     : "cursor-text"
                      // }`}
                    />
                  </FormControl>
                  {watchRequirePassword === true && <FormMessage />}
                </FormItem>
              )}
            />
          </div>

          <div className="">
            <FormField
              control={form.control}
              name="featuredEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Do you want to boost your event to appear on the featured
                    events?
                  </FormLabel>
                  <RadioGroup
                    value={field.value ? "Yes" : "No"}
                    onValueChange={(val) => field.onChange(val === "Yes")}>
                    {["Yes", "No"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={option}
                          className="border-2 border-gray-600"
                        />
                        <label htmlFor={option} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex   gap-4  w-full">
            <Button
              disabled={loading}
              className="bg-primary text-white  cursor-pointer"
              onClick={form.handleSubmit(onSubmit)}>
              {loading ? "loading..." : " Update Event"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UodateEventPage;
