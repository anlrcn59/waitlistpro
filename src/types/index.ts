export type Plan = "free" | "pro" | "business";

export type SubscriberStatus = "waiting" | "confirmed" | "invited";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
};

export type WaitlistSettings = {
  color: string;
  logo_url: string | null;
  redirect_url: string | null;
  custom_fields: unknown[];
  referral_enabled: boolean;
};

export type Waitlist = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  settings: WaitlistSettings;
  is_active: boolean;
  created_at: string;
};

export type Subscriber = {
  id: string;
  waitlist_id: string;
  email: string;
  position: number;
  referral_code: string;
  referred_by: string | null;
  status: SubscriberStatus;
  created_at: string;
};

export type Referral = {
  id: string;
  waitlist_id: string;
  referrer_id: string;
  referee_id: string;
  created_at: string;
};

export type ApiResponse<T = void> =
  | { data: T; error: null }
  | { data: null; error: string };
