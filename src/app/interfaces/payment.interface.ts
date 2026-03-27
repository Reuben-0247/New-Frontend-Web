export interface IPlans {
  id: number;
  name: string;
  canseled: string;
  amount: number;
  billingCycle: string;
  yearly: string;
  features: {
    label: string;
    value: boolean | string;
  }[];
}

export interface IPaymentMetadata {
  userId: string;
  paymentPlan: "Free" | "Basic" | "Intermediate" | "Advanced" | "Premium";
  billingCycle: "monthly" | "yearly";
  referrer?: string;
}

export interface IPayment {
  _id: string;
  userId: string;
  reference: string;
  email: string;
  amount: number;
  currency: "NGN";
  status: "success" | "failed" | "pending";
  transactionId: number;
  metadata: IPaymentMetadata;
  createdAt: string;
  __v: number;
}
