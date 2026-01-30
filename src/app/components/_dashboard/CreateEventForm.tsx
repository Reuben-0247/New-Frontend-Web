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
import { MapPin, UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEventStore } from "@/app/store/event.store";
import { useRouter } from "next/navigation";
// import { CreateEventFormInput } from "@/app/interfaces/event.interface";

const eventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Event category is required"),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),

    // displayImage: z.string().optional(),

    requirePassword: z.boolean(),
    password: z.string().optional(),

    featuredEvent: z.boolean(),

    location: z.object({
      type: z.enum(["Online", "Hybrid"]),
      address: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.location.type === "Hybrid" && !data.location.address) {
      ctx.addIssue({
        path: ["location", "address"],
        message: "Event location is required for hybrid events",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.requirePassword && !data.password) {
      ctx.addIssue({
        path: ["password"],
        message: "Password is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });
type CreateEventFormInput = z.infer<typeof eventSchema>;

const CreateEventForm = () => {
  const router = useRouter();
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [displayImageFile, setDisplayImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingDraft, setLoadingDraft] = useState(false);
  // const [sAction, setSAction] = useState("draft");
  const { createEvent, loading } = useEventStore();

  const form = useForm<CreateEventFormInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      requirePassword: false,
      featuredEvent: false,
      location: {
        type: "Online",
        address: "",
      },
    },
  });

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

  async function onSubmit(values: z.infer<typeof eventSchema>) {
    await createEvent(
      {
        ...values,
        // isPublished: true,
        type: "publish",
        location: {
          type: values.location.type,
          address: values.location.address ?? "",
        },
      },
      displayImageFile!,
    );
    form.reset();
    router.push(`/events?tab=Published`);
  }

  async function onSave(values: z.infer<typeof eventSchema>) {
    setLoadingDraft(true);
    await createEvent(
      {
        ...values,
        // isPublished: false,
        type: "draft",
        location: {
          type: values.location.type,
          address: values.location.address ?? "",
        },
      },
      displayImageFile!,
    );
    setLoadingDraft(false);
    form.reset();
    router.push(`/events?tab=Drafts`);
  }

  return (
    <div className="">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
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
                  <FormLabel>Event Location *</FormLabel>
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
                      // type="text"
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
              {loading ? "Publishing..." : " Publish Event"}
            </Button>

            <Button
              disabled={loadingDraft}
              onClick={form.handleSubmit(onSave)}
              className="dark:bg-gray-700 bg-gray-300  cursor-pointer">
              {loadingDraft ? "Saving..." : "Save as Draft"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateEventForm;
