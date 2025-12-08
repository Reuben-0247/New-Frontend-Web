"use client";

import * as React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomIcons from "@/components/CustomIcons";

const DatePicker = ({
  date,
  onChange,
  disabledFrom,
  disableFuture = false,
  displayIcon = (
    <Image
      src={"/icons/calendar.svg"}
      width={24}
      height={24}
      alt="calendar icon"
    />
  ),
  disableDate,
  datePickerClass,
  placeholder = "Pick a date",
  preselectToday = false, // NEW PROP
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultDisabledFrom = new Date(today);
  defaultDisabledFrom.setDate(today.getDate() - 0);

  const selectedDate = date
    ? new Date(date)
    : preselectToday
    ? today
    : undefined;

  const displayDate = selectedDate ? format(selectedDate, "PPP") : placeholder;

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : "";
    onChange(formattedDate);
  };

  return (
    <Popover>
      <PopoverTrigger
        asChild
        disabled={disableDate}
        className={datePickerClass}
      >
        <Button
          variant="outline"
          className={cn(
            "w-full flex justify-between items-center text-left font-normal border-none text-sm shadow-none"
          )}
        >
          {displayDate}
          {displayIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          disabled={(currentDate) => {
            const disableStart = disabledFrom || defaultDisabledFrom;
            return (
              (disableDate && disableDate(currentDate)) ||
              currentDate < disableStart ||
              (disableFuture && currentDate > today)
            );
          }}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
