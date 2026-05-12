"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string; // "HH:mm" format
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = "Pick a time",
}: TimePickerProps) {
  const [hour, setHour] = React.useState(value?.split(":")[0] ?? "");
  const [minute, setMinute] = React.useState(value?.split(":")[1] ?? "");

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0"),
  );

  const handleChange = (newHour: string, newMinute: string) => {
    if (newHour && newMinute) {
      onChange?.(`${newHour}:${newMinute}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}>
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-background" align="start">
        <div className="flex items-center gap-2">
          {/* Hours */}
          <Select
            value={hour}
            onValueChange={(val) => {
              setHour(val);
              handleChange(val, minute);
            }}>
            <SelectTrigger className="w-[72px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent className="h-48 overflow-y-auto bg-background">
              {hours.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-lg font-semibold">:</span>

          {/* Minutes */}
          <Select
            value={minute}
            onValueChange={(val) => {
              setMinute(val);
              handleChange(hour, val);
            }}>
            <SelectTrigger className="w-[72px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent className="h-48 overflow-y-auto bg-background">
              {minutes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
