/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { IComment } from "@/app/interfaces/event.interface";

export const formatDate = (date: dayjs.ConfigType) => {
  const formattedDate = dayjs(date).format("dddd, D MMMM, YYYY");
  return formattedDate;
};
export const formatDateInput = (date: Date | string) => {
  return new Date(date)?.toISOString().split("T")[0];
};

export const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString || new Date()).toLocaleString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
  return date;
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

export const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const detectCurrency = () => {
  if (typeof window === "undefined") return "USD";

  const locale = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (locale.includes("NG") || timezone.includes("Lagos")) {
    return "NGN";
  }

  return "USD";
};

export const formatUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
export const formatCurrency = (
  amount: number,
  options: {
    currency?: string;
    isKobo?: boolean;
  } = {},
): string => {
  const { currency = "NGN", isKobo = false } = options;

  const value = isKobo ? amount / 100 : amount;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(value);
};

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

// export const formatError = (error: AxiosError): FormattedAxiosError => {
//   if (error.response) {
//     return {
//       status: error.response.status,
//       statusText: error.response.statusText,
//       data: error.response.data,
//       message:
//         error.response.data &&
//         typeof error.response.data === "object" &&
//         "message" in error.response.data
//           ? (error.response.data as { message: unknown }).message
//           : undefined,
//       isAxiosError: true,
//       url: error?.config?.url,
//       method: error?.config?.method,
//       response: error?.response?.data,
//     };
//   } else if (error.request) {
//     return {
//       message: "No response received",
//       isAxiosError: true,
//       url: error?.config?.url,
//       method: error?.config?.method,
//     };
//   } else {
//     return {
//       message: error.message,
//       isAxiosError: true,
//     };
//   }
// };

export const formatError = (error: AxiosError): FormattedAxiosError => {
  if (error.response) {
    const data: any = error.response.data;

    let message: unknown = undefined;

    if (data) {
      if (
        (typeof data === "object" && "message" in data) ||
        (typeof data === "object" &&
          "errResponse" in data &&
          "message" in data.errResponse)
      ) {
        if (data.message.includes("Request failed with status code")) {
          message =
            data.errResponse?.message || data.message || "An error occurred";
        } else {
          message =
            data.message || data.errResponse?.message || "An error occurred";
        }
      } else if (Array.isArray(data?.errors) && data.errors.length > 0) {
        message = data.errors[0];
      } else if (typeof data?.error === "string") {
        message = data.error;
      }
    }

    return {
      status: error.response.status,
      statusText: error.response.statusText,
      data,
      message,
      isAxiosError: true,
      url: error?.config?.url,
      method: error?.config?.method,
      response: data,
    };
  }

  if (error.request) {
    return {
      message: "No response received",
      isAxiosError: true,
      url: error?.config?.url,
      method: error?.config?.method,
    };
  }
  console.log(error);
  return {
    message: error.message,
    isAxiosError: true,
  };
};

export const normalizeComment = (comment: any, auth: any): IComment => {
  return {
    _id: comment._id,
    content: comment.content,
    createdAt: comment.createdAt,
    creator: comment.creator ?? {
      _id: auth?._id,
      name: auth?.name,
      profilePhotoUrl: auth?.profilePhotoUrl,
    },
  };
};

export const mergeById = (prev: IComment[], incoming: IComment[]) => {
  const map = new Map<string, IComment>();

  prev.forEach((msg) => map.set(msg._id, msg));
  incoming.forEach((msg) => map.set(msg._id, msg));

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};
