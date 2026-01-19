/* eslint-disable @typescript-eslint/no-explicit-any */

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
  type?: "publish" | "draft";
  featuredEvent: boolean;
  location: {
    address: string;
    type: "Online" | "Hybrid";
  };
  // isPublished?: boolean;
}

export interface UpdateEventFormInput {
  _id: string;
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
  type?: "publish" | "draft";
  featuredEvent: boolean;
  location: {
    address: string;
    type: "Online" | "Hybrid";
  };
  // isPublished?: boolean;
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
  _id: string;
  // name: string;
  content: string;
  createdAt: string;
  // image?: string;
  // check?: boolean;
  creator?: {
    _id: string;
    name: string;
    profilePhotoUrl?: string;
  };
}

export interface Iboard {
  _id: string;
  name: string;
  type: "note" | "document";
  content: string;
  createdAt: string;
  eventId: string;
  updatedAt: string;
}

export interface CreateBoardFormInput {
  name: string;
  type: "note" | "document";
  content: string;
}

export interface UpdateBoardFormInput {
  boardId: string;
  name?: string;
  type?: string;
  content?: any;
}
