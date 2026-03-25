import { createClient } from "./server";

export async function getWaitlistBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("waitlists")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
}

export async function getWaitlistsByUser(userId: string) {
  const supabase = await createClient();
  return supabase
    .from("waitlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function getSubscribersByWaitlist(waitlistId: string) {
  const supabase = await createClient();
  return supabase
    .from("subscribers")
    .select("*")
    .eq("waitlist_id", waitlistId)
    .order("position", { ascending: true });
}

export async function getSubscriberCount(waitlistId: string) {
  const supabase = await createClient();
  return supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("waitlist_id", waitlistId);
}

export async function getReferralsByWaitlist(waitlistId: string) {
  const supabase = await createClient();
  return supabase
    .from("referrals")
    .select("*, referrer:referrer_id(email, referral_code), referee:referee_id(email)")
    .eq("waitlist_id", waitlistId)
    .order("created_at", { ascending: false });
}

export async function getProfileById(userId: string) {
  const supabase = await createClient();
  return supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
}

export async function getSubscriberByReferralCode(referralCode: string, waitlistId: string) {
  const supabase = await createClient();
  return supabase
    .from("subscribers")
    .select("id, email, position, referral_code")
    .eq("referral_code", referralCode)
    .eq("waitlist_id", waitlistId)
    .single();
}
