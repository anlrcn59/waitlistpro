// Bu dosya npx supabase gen types typescript --local > src/types/supabase.ts
// ile otomatik üretilir. El ile düzenleme yapma.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          plan: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      waitlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string | null;
          settings: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description?: string | null;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["waitlists"]["Insert"]>;
      };
      subscribers: {
        Row: {
          id: string;
          waitlist_id: string;
          email: string;
          position: number;
          referral_code: string;
          referred_by: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          waitlist_id: string;
          email: string;
          position: number;
          referral_code?: string;
          referred_by?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscribers"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["referrals"]["Insert"]>;
      };
    };
  };
};
