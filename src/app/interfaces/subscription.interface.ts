export interface ISubscription {
  _id: string;
  userId: string;

  paymentPlan: "Free" | "Basic" | "Intermediate" | "Advanced" | "Premium";
  billingCycle: "monthly" | "yearly";

  periodStart: string;
  periodEnd: string;

  status: "active" | "expired" | "cancelled";

  destinations: number;

  granted: IQuota;
  remaining: IQuota;
  used: IQuota;

  rolloverEligible: boolean;

  paymentReference: string;

  createdAt: string;
  updatedAt: string;

  __v: number;
}

export interface IQuota {
  storageGB: number;
  bandwidthGB: number;
}
