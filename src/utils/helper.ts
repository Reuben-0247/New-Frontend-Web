import dayjs from "dayjs";
import { AxiosError } from "axios";

export const formatDate = (date: dayjs.ConfigType) => {
  const formattedDate = dayjs(date).format("dddd, D MMMM, YYYY");
  return formattedDate;
};
export const formatDateInput = (date: Date) => {
  return new Date(date)?.toISOString()?.substring(0, 10);
};

export const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
};

export const formatToLocaleDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
};

export function formatTime(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface FormattedAxiosError {
  status?: number;
  statusText?: string;
  data?: unknown;
  message: unknown;
  response?: string | unknown;
  isAxiosError: boolean;
  url?: string;
  method?: string;
}

export const formatError = (error: AxiosError): FormattedAxiosError => {
  if (error.response) {
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      message:
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: unknown }).message
          : undefined,
      isAxiosError: true,
      url: error?.config?.url,
      method: error?.config?.method,
      response: error?.response?.data,
    };
  } else if (error.request) {
    return {
      message: "No response received",
      isAxiosError: true,
      url: error?.config?.url,
      method: error?.config?.method,
    };
  } else {
    return {
      message: error.message,
      isAxiosError: true,
    };
  }
};
