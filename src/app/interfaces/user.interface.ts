export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  password?: string;

  email: string;

  hasSubscribed?: boolean;
  paymentPlan?: string;

  status?: "active" | "inactive" | "suspended";

  phoneNumber?: string;
  dateOfBirth?: string;
  state?: string;
  gender?: string;

  role?: string;

  savedEvents?: string[];
  savedPlatformsIDs?: string[];

  googleUserId?: string;
  facebookUserId?: string;

  profilePhotoUrl?: string;

  categoryIds?: string[];

  emailVerified?: boolean;

  accountSuspended?: boolean;
  accountClosed?: boolean;

  registeredEvents?: string[];
  interests?: string[];

  personalEventId?: string;

  vodIds?: string[];
}
