import type { Plan } from "@/types";

export type PlanConfig = {
  id: Plan;
  name: string;
  price: { monthly: number };
  limits: {
    waitlists: number | null;
    subscribers: number | null;
    referral: boolean;
    customDomain: boolean;
    removeBranding: boolean;
    emailNotifications: boolean;
  };
  priceId: string | null;
};

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: { monthly: 0 },
    limits: {
      waitlists: 1,
      subscribers: 500,
      referral: false,
      customDomain: false,
      removeBranding: false,
      emailNotifications: false,
    },
    priceId: null,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: { monthly: 1900 },
    limits: {
      waitlists: 10,
      subscribers: 10_000,
      referral: true,
      customDomain: false,
      removeBranding: false,
      emailNotifications: true,
    },
    priceId: process.env["STRIPE_PRICE_PRO_MONTHLY"] ?? null,
  },
  business: {
    id: "business",
    name: "Business",
    price: { monthly: 4900 },
    limits: {
      waitlists: null,
      subscribers: null,
      referral: true,
      customDomain: true,
      removeBranding: true,
      emailNotifications: true,
    },
    priceId: process.env["STRIPE_PRICE_BUSINESS_MONTHLY"] ?? null,
  },
};
