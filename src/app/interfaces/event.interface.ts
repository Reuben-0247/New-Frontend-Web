import { IUser } from "./user.interface";

export interface IReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
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
