import { create } from "zustand";
import { ISubscription } from "../interfaces/subscription.interface";
import { IPayment } from "../interfaces/payment.interface";

interface IProp {
  subscriptions: ISubscription[];
  payments: IPayment[];
  payment: IPayment | null;
  subscription: ISubscription | null;
  setSubs: (data: ISubscription[]) => void;
  setSub: (data: ISubscription | null) => void;
  setPayments: (data: IPayment[]) => void;
  setPayment: (data: IPayment | null) => void;
}

export const useSubscriptionStore = create<IProp>((set) => ({
  subscriptions: [],
  payments: [],
  payment: null,
  subscription: null,
  setSubs: (subscriptions: ISubscription[]) => set({ subscriptions }),
  setSub: (subscription: ISubscription | null) => set({ subscription }),
  setPayments: (payments: IPayment[]) => set({ payments }),
  setPayment: (payment: IPayment | null) => set({ payment }),
}));
