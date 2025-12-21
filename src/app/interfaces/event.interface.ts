import { IUser } from "./user.interface";

export interface IEvent {
  _id?: string;
  eventId?: string;
  userId?: string;
  categoryId?: string;
  title: string;
  description?: string;

  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;

  dates?: {
    date: string;
    startTime?: string;
    endTime?: string;
  }[];

  attendanceLimit?: number;

  requirePassword: boolean;
  password?: string;
  requireAuthentication?: boolean;

  displayImage: string;
  backgroundImage?: string;
  location: {
    type?: "Online" | "Hybrid";
    address?: string;
  };

  featuredEvent?: boolean;
  isPublished: boolean;
  isLive?: boolean;

  country?: string;
  state?: string;
  city?: string;

  castrStreamId?: string;
  channelName?: string;
  token?: string;
  rtmToken?: string;
  uid?: string;

  participants?: string[];
  totalParticipants?: string[];
  likesCount?: number;
  viewsCount?: number;
  totalViewsCount?: number;
  reviewsCount?: number;

  createdAt?: string;
  updatedAt?: string;
}
export interface CreateEventFormInput {
  title: string;
  description: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  displayImage?: string;
  requirePassword: boolean;
  password?: string;
  appearInFeatureEvent: boolean;
  location: {
    address: string;
    type: "Online" | "Hybrid";
  };
  isPublished: boolean;
}

export interface IReview {
  _id?: string;
  title: string;
  comment: string;
  rating?: number;

  eventId: string;
  userId: string;

  createdAt?: string;
  updatedAt?: string;
}
export interface IComment {
  id: string;
  name: string;
  message: string;
  time: string;
  image?: string;
  check?: boolean;
  creator?: IUser;
}
