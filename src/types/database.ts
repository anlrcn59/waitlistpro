// ─────────────────────────────────────────────────────────────────────────────
// WaitlistPro — Supabase Database Types
// Manually maintained until `supabase gen types typescript` is run.
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─────────────────────────────────────────────────────────────────────────────
// Database
// ─────────────────────────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          plan: Database["public"]["Enums"]["plan_type"];
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          plan?: Database["public"]["Enums"]["plan_type"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          plan?: Database["public"]["Enums"]["plan_type"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
      };
      waitlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string | null;
          settings: WaitlistSettings;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description?: string | null;
          settings?: WaitlistSettings;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          settings?: WaitlistSettings;
          is_active?: boolean;
          created_at?: string;
        };
      };
      subscribers: {
        Row: {
          id: string;
          waitlist_id: string;
          email: string;
          position: number;
          referral_code: string;
          referred_by: string | null;
          status: Database["public"]["Enums"]["subscriber_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          waitlist_id: string;
          email: string;
          position: number;
          referral_code?: string;
          referred_by?: string | null;
          status?: Database["public"]["Enums"]["subscriber_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          waitlist_id?: string;
          email?: string;
          position?: number;
          referral_code?: string;
          referred_by?: string | null;
          status?: Database["public"]["Enums"]["subscriber_status"];
          created_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          waitlist_id: string;
          referrer_id: string;
          referee_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          waitlist_id: string;
          referrer_id: string;
          referee_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          waitlist_id?: string;
          referrer_id?: string;
          referee_id?: string;
          created_at?: string;
        };
      };
    };
    Enums: {
      plan_type: "free" | "pro" | "business";
      subscriber_status: "waiting" | "confirmed" | "invited";
    };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// JSONB shape for waitlists.settings
// ─────────────────────────────────────────────────────────────────────────────

export type WaitlistSettings = {
  color: string;
  logo_url: string | null;
  redirect_url: string | null;
  custom_fields: Json[];
  referral_enabled: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Generic helpers — mirror the pattern from `supabase gen types`
// ─────────────────────────────────────────────────────────────────────────────

type PublicTables = Database["public"]["Tables"];
type PublicEnums = Database["public"]["Enums"];

export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];
export type TablesInsert<T extends keyof PublicTables> =
  PublicTables[T]["Insert"];
export type TablesUpdate<T extends keyof PublicTables> =
  PublicTables[T]["Update"];
export type Enums<T extends keyof PublicEnums> = PublicEnums[T];

// ─────────────────────────────────────────────────────────────────────────────
// Per-table Row / Insert / Update exports
// ─────────────────────────────────────────────────────────────────────────────

export type ProfileRow = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

export type WaitlistRow = Tables<"waitlists">;
export type WaitlistInsert = TablesInsert<"waitlists">;
export type WaitlistUpdate = TablesUpdate<"waitlists">;

export type SubscriberRow = Tables<"subscribers">;
export type SubscriberInsert = TablesInsert<"subscribers">;
export type SubscriberUpdate = TablesUpdate<"subscribers">;

export type ReferralRow = Tables<"referrals">;
export type ReferralInsert = TablesInsert<"referrals">;
export type ReferralUpdate = TablesUpdate<"referrals">;

// ─────────────────────────────────────────────────────────────────────────────
// Enum value types
// ─────────────────────────────────────────────────────────────────────────────

export type PlanType = Enums<"plan_type">;
export type SubscriberStatus = Enums<"subscriber_status">;
